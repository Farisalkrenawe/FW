import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters long' },
        { status: 400 }
      );
    }

    const searchTerm = query.trim();

    // Search products
    const products = await prisma.product.findMany({
      where: {
        status: ProductStatus.ACTIVE,
        OR: [
          {
            name: {
              contains: searchTerm
            }
          },
          {
            brand: {
              contains: searchTerm
            }
          },
          {
            description: {
              contains: searchTerm
            }
          },
          {
            shortDescription: {
              contains: searchTerm
            }
          },
          {
            tags: {
              contains: searchTerm
            }
          }
        ]
      },
      include: {
        category: true,
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
      take: limit,
      orderBy: {
        featured: 'desc' // Show featured products first
      }
    });

    // Search categories
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        OR: [
          {
            name: {
              contains: searchTerm
            }
          },
          {
            description: {
              contains: searchTerm
            }
          }
        ]
      },
      include: {
        _count: {
          select: {
            products: {
              where: {
                status: ProductStatus.ACTIVE
              }
            }
          }
        }
      },
      take: 5
    });

    // Calculate product ratings
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

    // Get search suggestions (popular search terms)
    const suggestions = await getSearchSuggestions(searchTerm);

    return NextResponse.json({
      query: searchTerm,
      results: {
        products: productsWithRatings,
        categories,
        suggestions
      },
      counts: {
        products: products.length,
        categories: categories.length
      }
    });

  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get search suggestions
async function getSearchSuggestions(searchTerm: string) {
  try {
    // Get unique brands that match the search term
    const brands = await prisma.product.findMany({
      where: {
        status: ProductStatus.ACTIVE,
        brand: {
          contains: searchTerm
        }
      },
      select: {
        brand: true
      },
      distinct: ['brand'],
      take: 5
    });

    // Get categories that match
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        name: {
          contains: searchTerm
        }
      },
      select: {
        name: true,
        slug: true
      },
      take: 5
    });

    // Get popular tags that contain the search term
    const productsWithTags = await prisma.product.findMany({
      where: {
        status: ProductStatus.ACTIVE,
        tags: {
          contains: searchTerm.toLowerCase()
        }
      },
      select: {
        tags: true
      },
      take: 10
    });

    // Extract relevant tags
    const relevantTags = new Set<string>();
    productsWithTags.forEach(product => {
      if (product.tags && typeof product.tags === 'string') {
        // Split tags string by comma or space
        const tagList = product.tags.split(/[,\s]+/).filter(tag => tag.trim());
        tagList.forEach(tag => {
          if (tag.toLowerCase().includes(searchTerm.toLowerCase())) {
            relevantTags.add(tag.trim());
          }
        });
      }
    });

    return {
      brands: brands.map(b => b.brand).filter(Boolean),
      categories: categories.map(c => ({ name: c.name, slug: c.slug })),
      tags: Array.from(relevantTags).slice(0, 5)
    };

  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return {
      brands: [],
      categories: [],
      tags: []
    };
  }
}