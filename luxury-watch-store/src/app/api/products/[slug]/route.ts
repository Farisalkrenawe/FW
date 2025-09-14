import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: {
        slug,
        status: ProductStatus.ACTIVE
      },
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: 'asc'
          }
        },
        variants: {
          include: {
            inventory: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        },
        inventory: true,
        reviews: {
          include: {
            product: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate review statistics
    const reviews = product.reviews;
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    // Rating distribution
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    // Get related products (same category, different product)
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: {
          not: product.id
        },
        status: ProductStatus.ACTIVE
      },
      include: {
        images: {
          where: {
            isPrimary: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      },
      take: 4
    });

    // Calculate related products ratings
    const relatedWithRatings = relatedProducts.map(relatedProduct => {
      const relatedReviews = relatedProduct.reviews;
      const relatedAverageRating = relatedReviews.length > 0 
        ? relatedReviews.reduce((sum, review) => sum + review.rating, 0) / relatedReviews.length 
        : 0;
      
      const { reviews: _, ...productWithoutReviews } = relatedProduct;
      
      return {
        ...productWithoutReviews,
        averageRating: Math.round(relatedAverageRating * 10) / 10,
        reviewCount: relatedProduct._count.reviews
      };
    });

    const productWithStats = {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution,
      relatedProducts: relatedWithRatings
    };

    return NextResponse.json(productWithStats);

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // This would typically require admin authentication
    const { slug } = await params;
    const body = await request.json();

    const product = await prisma.product.findUnique({
      where: { slug }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const {
      name,
      description,
      shortDescription,
      sku,
      price,
      comparePrice,
      costPrice,
      categoryId,
      brand,
      featured,
      status,
      tags,
      specifications,
      metaTitle,
      metaDescription
    } = body;

    const updatedProduct = await prisma.product.update({
      where: { slug },
      data: {
        ...(name && { 
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }),
        ...(description && { description }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(sku && { sku }),
        ...(price && { price }),
        ...(comparePrice !== undefined && { comparePrice }),
        ...(costPrice !== undefined && { costPrice }),
        ...(categoryId && { categoryId }),
        ...(brand !== undefined && { brand }),
        ...(featured !== undefined && { featured }),
        ...(status && { status }),
        ...(tags && { tags }),
        ...(specifications !== undefined && { specifications }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        updatedAt: new Date()
      },
      include: {
        category: true,
        images: true,
        inventory: true
      }
    });

    return NextResponse.json(updatedProduct);

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // This would typically require admin authentication
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Soft delete by changing status to ARCHIVED
    await prisma.product.update({
      where: { slug },
      data: {
        status: ProductStatus.ARCHIVED,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ message: 'Product archived successfully' });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}