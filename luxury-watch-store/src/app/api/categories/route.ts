import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeProducts = searchParams.get('includeProducts') === 'true';
    const parentOnly = searchParams.get('parentOnly') === 'true';

    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        ...(parentOnly && { parentId: null })
      },
      include: {
        children: {
          where: {
            isActive: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        },
        parent: true,
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
              _count: {
                select: {
                  reviews: true
                }
              }
            },
            take: 10
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
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });

    return NextResponse.json(categories);

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // This would typically require admin authentication
    const body = await request.json();
    
    const {
      name,
      description,
      image,
      parentId,
      sortOrder = 0,
      isActive = true,
      metaTitle,
      metaDescription
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        parentId,
        sortOrder,
        isActive,
        metaTitle,
        metaDescription
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

    return NextResponse.json(category, { status: 201 });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}