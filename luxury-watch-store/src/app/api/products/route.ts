import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Filters
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');
    const search = searchParams.get('search');
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: any = {
      status: ProductStatus.ACTIVE,
    };

    if (category) {
      where.category = {
        slug: category
      };
    }

    if (brand) {
      where.brand = {
        contains: brand
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (inStock === 'true') {
      where.inventory = {
        quantity: {
          gt: 0
        }
      };
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search
          }
        },
        {
          description: {
            contains: search
          }
        },
        {
          brand: {
            contains: search
          }
        },
        {
          tags: {
            contains: search
          }
        }
      ];
    }

    // Build order by clause
    const orderBy: any = {};
    
    if (sortBy === 'price') {
      orderBy.price = sortOrder;
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder;
    } else if (sortBy === 'newest') {
      orderBy.createdAt = 'desc';
    } else if (sortBy === 'popularity') {
      // Sort by featured status and creation date as popularity proxy
      orderBy.featured = 'desc';
    } else {
      orderBy[sortBy] = sortOrder;
    }

    // Execute query
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: {
              sortOrder: 'asc'
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
        orderBy,
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ]);

    // Calculate average ratings
    const productsWithRatings = products.map(product => {
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

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: productsWithRatings,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // This would typically require admin authentication
    // For now, we'll skip auth check but you should implement it
    
    const body = await request.json();
    
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
      featured = false,
      status = ProductStatus.ACTIVE,
      tags = [],
      specifications,
      metaTitle,
      metaDescription,
      images = []
    } = body;

    // Validate required fields
    if (!name || !description || !sku || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existingSku = await prisma.product.findUnique({
      where: { sku }
    });

    if (existingSku) {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 409 }
      );
    }

    // Create product with images
    const product = await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
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
        metaDescription,
        images: {
          create: images.map((image: any, index: number) => ({
            url: image.url,
            altText: image.altText || `${name} - Image ${index + 1}`,
            isPrimary: index === 0,
            sortOrder: index
          }))
        }
      },
      include: {
        category: true,
        images: true
      }
    });

    return NextResponse.json(product, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}