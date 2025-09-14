import { PrismaClient, ProductStatus } from '@prisma/client'
import fs from 'fs'
import csv from 'csv-parser'
import path from 'path'

const prisma = new PrismaClient()

interface CSVRow {
  'Handle': string
  'Title': string
  'Body (HTML)': string
  'Vendor': string
  'Product Category': string
  'Type': string
  'Tags': string
  'Published': string
  'Option1 Name': string
  'Option1 Value': string
  'Variant SKU': string
  'Variant Inventory Qty': string
  'Variant Price': string
  'Variant Compare At Price': string
  'Image Src': string
  'Image Position': string
  'Image Alt Text': string
  'SEO Title': string
  'SEO Description': string
  'Age group (product.metafields.shopify.age-group)': string
  'Dial color (product.metafields.shopify.dial-color)': string
  'Target gender (product.metafields.shopify.target-gender)': string
  'Watch display (product.metafields.shopify.watch-display)': string
  'Watch features (product.metafields.shopify.watch-features)': string
  'Cost per item': string
  'Included / Israel': string
  'Price / Israel': string
  'Compare At Price / Israel': string
  'Status': string
}

interface ProductData {
  main: CSVRow
  variants: CSVRow[]
  images: CSVRow[]
}

async function main() {
  console.log('🚀 Starting Shopify CSV Import for Luxury Watches...')
  console.log('📁 Reading CSV file: data/products_export_1.csv')
  
  const products = new Map<string, ProductData>()
  const csvPath = path.join(process.cwd(), 'data', 'products_export_1.csv')
  
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found:', csvPath)
    process.exit(1)
  }

  // Parse CSV and group by Handle
  await new Promise<void>((resolve, reject) => {
    const stream = fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row: CSVRow) => {
        const handle = row.Handle?.trim()
        if (!handle) return // Skip empty rows
        
        if (!products.has(handle)) {
          products.set(handle, {
            main: row,
            variants: [],
            images: []
          })
        }
        
        const product = products.get(handle)!
        
        // If this row has image data, add to images
        if (row['Image Src'] && row['Image Position']) {
          product.images.push(row)
        }
        
        // If this row has variant data (not the main product), add to variants
        if (row['Option1 Value'] && row['Option1 Value'] !== 'Default Title') {
          product.variants.push(row)
        }
      })
      .on('end', () => {
        console.log(`📊 Found ${products.size} unique products`)
        resolve()
      })
      .on('error', reject)
  })

  await importProducts(products)
}

async function importProducts(productsMap: Map<string, ProductData>) {
  console.log('\n🏗️  Starting import process...')
  
  let successCount = 0
  let errorCount = 0
  let skipCount = 0
  const errors: string[] = []
  
  // Default watch images for products without images
  const defaultWatchImages = [
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500',
    'https://images.unsplash.com/photo-1506796684999-9fa2770af9c3?w=500',
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500',
    'https://images.unsplash.com/photo-1617643321008-2e8c6d9e2e79?w=500'
  ]
  
  for (const [handle, data] of productsMap) {
    try {
      const mainProduct = data.main
      
      // Skip products without title
      if (!mainProduct.Title?.trim()) {
        skipCount++
        console.log(`⏭️  Skipping ${handle}: No title`)
        continue
      }
      
      console.log(`\n📦 Processing: ${mainProduct.Title}`)
      
      // Create or find category based on Vendor
      const vendorName = mainProduct.Vendor?.trim() || 'Uncategorized'
      const category = await prisma.category.upsert({
        where: { slug: slugify(vendorName) },
        update: {},
        create: {
          name: vendorName,
          slug: slugify(vendorName),
          description: `${vendorName} luxury watches collection`,
          isActive: true
        }
      })
      
      console.log(`   📂 Category: ${category.name}`)
      
      // Clean HTML from description
      const cleanDescription = cleanHtml(mainProduct['Body (HTML)']) || `Luxury ${vendorName} watch - ${mainProduct.Title}`
      
      // Parse pricing
      const price = parseFloat(mainProduct['Variant Price']) || 0
      const comparePrice = mainProduct['Variant Compare At Price'] ? 
        parseFloat(mainProduct['Variant Compare At Price']) : null
      const costPrice = mainProduct['Cost per item'] ? 
        parseFloat(mainProduct['Cost per item']) : null
      
      // Parse inventory
      const stockQuantity = parseInt(mainProduct['Variant Inventory Qty']) || 0
      
      // Generate SKU if missing
      const sku = mainProduct['Variant SKU']?.trim() || `SKU-${handle}-${Date.now()}`
      
      // Process tags
      const tagsString = mainProduct.Tags ? 
        mainProduct.Tags.split(',').map(t => t.trim()).filter(t => t).join(',') : ''
      
      // Create specifications object with all watch metadata
      const specifications = {
        ageGroup: mainProduct['Age group (product.metafields.shopify.age-group)'] || null,
        dialColor: mainProduct['Dial color (product.metafields.shopify.dial-color)'] || null,
        targetGender: mainProduct['Target gender (product.metafields.shopify.target-gender)'] || null,
        watchDisplay: mainProduct['Watch display (product.metafields.shopify.watch-display)'] || null,
        watchFeatures: mainProduct['Watch features (product.metafields.shopify.watch-features)'] || null,
        productCategory: mainProduct['Product Category'] || null,
        type: mainProduct['Type'] || null,
        israelPrice: mainProduct['Price / Israel'] || null,
        israelComparePrice: mainProduct['Compare At Price / Israel'] || null,
        israelIncluded: mainProduct['Included / Israel'] === 'true',
        published: mainProduct.Published === 'true'
      }
      
      // Determine status
      const status: ProductStatus = mainProduct.Status === 'active' ? 'ACTIVE' : 'DRAFT'
      
      // Create main product
      const product = await prisma.product.create({
        data: {
          name: mainProduct.Title.trim(),
          slug: handle,
          description: cleanDescription,
          shortDescription: cleanDescription.substring(0, 200),
          sku: sku,
          price: price,
          comparePrice: comparePrice,
          costPrice: costPrice,
          brand: vendorName,
          categoryId: category.id,
          status: status,
          featured: tagsString.toLowerCase().includes('featured'),
          tags: tagsString,
          specifications: specifications,
          metaTitle: mainProduct['SEO Title'] || mainProduct.Title,
          metaDescription: mainProduct['SEO Description'] || cleanDescription.substring(0, 160)
        }
      })
      
      console.log(`   ✅ Product created: ${product.name} (${product.id})`)
      
      // Add product images
      const imagesToAdd = data.images.length > 0 ? data.images : [mainProduct]
      let imageCount = 0
      
      for (const imageRow of imagesToAdd) {
        if (imageRow['Image Src']) {
          try {
            await prisma.productImage.create({
              data: {
                productId: product.id,
                url: imageRow['Image Src'],
                altText: imageRow['Image Alt Text'] || product.name,
                isPrimary: imageCount === 0,
                sortOrder: parseInt(imageRow['Image Position']) || imageCount + 1
              }
            })
            imageCount++
          } catch (imgError) {
            console.log(`   ⚠️  Image error: ${imgError}`)
          }
        }
      }
      
      // Add default image if no images were added
      if (imageCount === 0) {
        const defaultImage = defaultWatchImages[Math.floor(Math.random() * defaultWatchImages.length)]
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: defaultImage,
            altText: product.name,
            isPrimary: true,
            sortOrder: 1
          }
        })
        console.log(`   🖼️  Added default image`)
      } else {
        console.log(`   🖼️  Added ${imageCount} images`)
      }
      
      // Create inventory record
      await prisma.inventory.create({
        data: {
          productId: product.id,
          quantity: stockQuantity,
          reserved: 0,
          lowStockAlert: 5
        }
      })
      
      // Handle variants if they exist
      if (data.variants.length > 0) {
        let variantCount = 0
        for (const variant of data.variants) {
          if (variant['Option1 Value'] && variant['Option1 Name']) {
            try {
              const variantSku = variant['Variant SKU'] || `${sku}-${variant['Option1 Value']}`
              const variantPrice = parseFloat(variant['Variant Price']) || price
              const variantQty = parseInt(variant['Variant Inventory Qty']) || 0
              
              const productVariant = await prisma.productVariant.create({
                data: {
                  productId: product.id,
                  name: variant['Option1 Name'],
                  value: variant['Option1 Value'],
                  sku: variantSku,
                  price: variantPrice !== price ? variantPrice : null,
                  sortOrder: variantCount
                }
              })
              
              // Create inventory for variant
              await prisma.inventory.create({
                data: {
                  variantId: productVariant.id,
                  quantity: variantQty,
                  reserved: 0,
                  lowStockAlert: 5
                }
              })
              
              variantCount++
            } catch (variantError) {
              console.log(`   ⚠️  Variant error: ${variantError}`)
            }
          }
        }
        console.log(`   🎯 Added ${variantCount} variants`)
      }
      
      successCount++
      console.log(`   ✅ Successfully imported ${mainProduct.Title}`)
      
    } catch (error) {
      errorCount++
      const errorMsg = `❌ Error importing ${handle}: ${error}`
      console.error(errorMsg)
      errors.push(errorMsg)
    }
  }
  
  // Generate final report
  console.log(`
🎉========================================
📊 IMPORT COMPLETE - LUXURY WATCHES
========================================
✅ Successfully imported: ${successCount} products
❌ Failed: ${errorCount} products  
⏭️  Skipped: ${skipCount} products
📦 Total processed: ${successCount + errorCount + skipCount}
========================================`)

  if (errors.length > 0) {
    console.log(`\n❌ ERRORS ENCOUNTERED:`)
    errors.forEach(error => console.log(error))
  }
  
  // Show categories created
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  })
  
  console.log(`\n📂 CATEGORIES CREATED:`)
  categories.forEach(cat => {
    console.log(`   • ${cat.name}: ${cat._count.products} products`)
  })
  
  console.log(`\n🎯 Ready! Visit http://localhost:3003 to see your luxury watch store!`)
}

function slugify(text: string): string {
  return text
    ?.toLowerCase()
    ?.replace(/[^a-z0-9]+/g, '-')
    ?.replace(/(^-|-$)/g, '') || 'untitled'
}

function cleanHtml(html: string): string {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

// Run the import
main()
  .catch((error) => {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🔌 Database disconnected')
  })