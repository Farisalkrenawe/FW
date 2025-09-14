import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const includeProducts = searchParams.get('includeProducts') === 'true';

    const category = await prisma.category.findUnique({
      where: {
        slug,
        isActive: true
      },
      include: {
        parent: true,
        children: {
          where: {
            isActive: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        },
        ...(includeProducts && {
          products: {
            where: {
              status: 'ACTIVE'
            },
            include: {
              images: {
                where: {
                  isPrimary: true
                }
              },
              inventory: true,
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
            orderBy: {
              createdAt: 'desc'
            }
          }
        }),
        _count: {
          select: {
            products: {
              where: {
                status: 'ACTIVE'
              }
            }
          }
        }
      }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // If products are included, calculate ratings
    if (includeProducts && category.products) {
      const productsWithRatings = category.products.map(product => {
        const reviews = product.reviews;
        const averageRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 0;
        
        const { reviews: _, ...productWithoutReviews } = product;
        
        return {
          ...productWithoutReviews,
          averageRating: Math.round(averageRating * 10) / 10,
          reviewCount: product._count.reviews
        };
      });

      return NextResponse.json({
        ...category,
        products: productsWithRatings
      });
    }

    return NextResponse.json(category);

  } catch (error) {
    console.error('Error fetching category:', error);
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

    const category = await prisma.category.findUnique({
      where: { slug }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const {
      name,
      description,
      image,
      parentId,
      sortOrder,
      isActive,
      metaTitle,
      metaDescription
    } = body;

    const updatedCategory = await prisma.category.update({
      where: { slug },
      data: {
        ...(name && { 
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(parentId !== undefined && { parentId }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isActive !== undefined && { isActive }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        updatedAt: new Date()
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    return NextResponse.json(updatedCategory);

  } catch (error) {
    console.error('Error updating category:', error);
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

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: true,
        children: true
      }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has products or children
    if (category.products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with products. Move products to another category first.' },
        { status: 400 }
      );
    }

    if (category.children.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories. Delete subcategories first.' },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { slug }
    });

    return NextResponse.json({ message: 'Category deleted successfully' });

  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}