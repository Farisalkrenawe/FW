import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyImport() {
  console.log('🔍 Verifying Import Results...\n')

  // Count products
  const productCount = await prisma.product.count()
  console.log(`📦 Total Products: ${productCount}`)

  // Count categories
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  })
  
  console.log(`\n📂 Categories (${categories.length}):`)
  categories.forEach(cat => {
    console.log(`   • ${cat.name}: ${cat._count.products} products`)
  })

  // Count images
  const imageCount = await prisma.productImage.count()
  console.log(`\n🖼️  Total Product Images: ${imageCount}`)

  // Count inventory records
  const inventoryCount = await prisma.inventory.count()
  console.log(`📊 Inventory Records: ${inventoryCount}`)

  // Sample products by brand
  const brandCounts = await prisma.product.groupBy({
    by: ['brand'],
    _count: {
      brand: true
    },
    orderBy: {
      _count: {
        brand: 'desc'
      }
    }
  })

  console.log(`\n🏷️  Top Brands:`)
  brandCounts.slice(0, 10).forEach(brand => {
    console.log(`   • ${brand.brand}: ${brand._count.brand} products`)
  })

  // Price range
  const priceStats = await prisma.product.aggregate({
    _min: { price: true },
    _max: { price: true },
    _avg: { price: true }
  })

  console.log(`\n💰 Price Range:`)
  console.log(`   • Minimum: $${priceStats._min.price}`)
  console.log(`   • Maximum: $${priceStats._max.price}`)
  console.log(`   • Average: $${priceStats._avg.price?.toFixed(2)}`)

  // Featured products
  const featuredCount = await prisma.product.count({
    where: { featured: true }
  })
  console.log(`\n⭐ Featured Products: ${featuredCount}`)

  // Products with specifications
  const withSpecs = await prisma.product.count({
    where: {
      specifications: {
        not: null
      }
    }
  })
  console.log(`📋 Products with Specifications: ${withSpecs}`)

  console.log(`\n✅ Import verification complete!`)
  console.log(`🌐 Visit http://localhost:3003 to see your luxury watch store!`)
  console.log(`🛠️  Visit http://localhost:5555 for Prisma Studio database admin`)
}

verifyImport()
  .catch(console.error)
  .finally(() => prisma.$disconnect())