import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const hashedPassword = await bcryptjs.hash('admin123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@luxurywatch.com' },
    update: {},
    create: {
      email: 'admin@luxurywatch.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // Create categories
  const categories = [
    {
      name: 'Luxury Watches',
      slug: 'luxury-watches',
      description: 'Premium timepieces from the world\'s most prestigious manufacturers',
      image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=400&fit=crop',
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'Rolex',
      slug: 'rolex',
      description: 'Swiss luxury watches - A crown for every achievement',
      image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=400&fit=crop',
      isActive: true,
      sortOrder: 2,
    },
    {
      name: 'Omega',
      slug: 'omega',
      description: 'Swiss luxury watchmaker since 1848',
      image: 'https://images.unsplash.com/photo-1523170335258-f5c6c6bd6eaf?w=600&h=400&fit=crop',
      isActive: true,
      sortOrder: 3,
    },
    {
      name: 'Patek Philippe',
      slug: 'patek-philippe',
      description: 'You never actually own a Patek Philippe. You merely look after it for the next generation.',
      image: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=600&h=400&fit=crop',
      isActive: true,
      sortOrder: 4,
    },
    {
      name: 'Audemars Piguet',
      slug: 'audemars-piguet',
      description: 'To break the rules, you must first master them',
      image: 'https://images.unsplash.com/photo-1548181048-dab5c1b4a746?w=600&h=400&fit=crop',
      isActive: true,
      sortOrder: 5,
    },
    {
      name: 'Sport Watches',
      slug: 'sport-watches',
      description: 'Professional sports and diving watches',
      image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&h=400&fit=crop',
      isActive: true,
      sortOrder: 6,
    },
  ]

  const createdCategories = []
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
    createdCategories.push(created)
  }

  // Create comprehensive product data
  const products = [
    // Rolex Products
    {
      name: 'Rolex Submariner Date',
      slug: 'rolex-submariner-date',
      description: 'The Rolex Oyster Perpetual Submariner Date in Oystersteel with a Cerachrom bezel insert in black ceramic and a black dial with large luminescent hour markers. Designed for the deep, built to last.',
      shortDescription: 'Iconic diving watch with unidirectional rotatable bezel and 300m water resistance',
      sku: 'ROL-SUB-126610LN',
      price: 8950.00,
      comparePrice: 9500.00,
      costPrice: 7200.00,
      categoryId: createdCategories[1].id, // Rolex
      brand: 'Rolex',
      featured: true,
      status: 'ACTIVE' as const,
      tags: 'diving,luxury,swiss,automatic,ceramic,oystersteel',
      specifications: {
        movement: 'Perpetual, mechanical, self-winding',
        calibre: '3235',
        powerReserve: 'Approximately 70 hours',
        waterResistance: '300 metres / 1,000 feet',
        caseSize: '41mm',
        caseMaterial: 'Oystersteel',
        bracelet: 'Oyster, flat three-piece links',
        bezel: 'Unidirectional rotatable 60-minute graduated, Cerachrom insert in black ceramic',
        dial: 'Black',
        crystal: 'Scratch-resistant sapphire',
        functions: 'Centre hour, minute and seconds hands. Instantaneous date with rapid setting. Stop-seconds for precise time setting'
      },
      metaTitle: 'Rolex Submariner Date - Luxury Diving Watch | Luxury Watch Store',
      metaDescription: 'Own the iconic Rolex Submariner Date. Swiss luxury diving watch with ceramic bezel, automatic movement, and 300m water resistance.',
    },
    {
      name: 'Rolex GMT-Master II',
      slug: 'rolex-gmt-master-ii',
      description: 'The Rolex GMT-Master II with its rotatable bezel and additional 24-hour hand displays a second time zone. Developed for professional pilots, it has become the watch of choice for world travellers.',
      shortDescription: 'Professional pilot\'s watch displaying two time zones simultaneously',
      sku: 'ROL-GMT-126710BLRO',
      price: 12450.00,
      comparePrice: 13200.00,
      costPrice: 10200.00,
      categoryId: createdCategories[1].id, // Rolex
      brand: 'Rolex',
      featured: true,
      status: 'ACTIVE' as const,
      tags: 'pilot,gmt,two-timezone,luxury,swiss,automatic',
      specifications: {
        movement: 'Perpetual, mechanical, self-winding',
        calibre: '3285',
        powerReserve: 'Approximately 70 hours',
        waterResistance: '100 metres / 330 feet',
        caseSize: '40mm',
        caseMaterial: 'Oystersteel',
        bracelet: 'Oyster, flat three-piece links',
        bezel: 'Bidirectional rotatable 24-hour graduated, Cerachrom insert in blue and red ceramic',
        dial: 'Black',
        crystal: 'Scratch-resistant sapphire'
      },
      metaTitle: 'Rolex GMT-Master II - Professional Pilot Watch | Luxury Watch Store',
      metaDescription: 'Discover the Rolex GMT-Master II. Professional pilot watch with dual time zone display and distinctive Pepsi bezel.',
    },
    {
      name: 'Rolex Datejust 41',
      slug: 'rolex-datejust-41',
      description: 'The Rolex Datejust 41 embodies the quintessential Rolex watch. Classic and elegant, it has been a symbol of success and excellence for generations.',
      shortDescription: 'Classic dress watch with date display and timeless elegance',
      sku: 'ROL-DJ-126334',
      price: 7850.00,
      comparePrice: 8400.00,
      costPrice: 6100.00,
      categoryId: createdCategories[1].id, // Rolex
      brand: 'Rolex',
      featured: false,
      status: 'ACTIVE' as const,
      tags: 'dress,classic,luxury,swiss,automatic,datejust',
      specifications: {
        movement: 'Perpetual, mechanical, self-winding',
        calibre: '3235',
        powerReserve: 'Approximately 70 hours',
        waterResistance: '100 metres / 330 feet',
        caseSize: '41mm',
        caseMaterial: 'Oystersteel and white gold',
        bracelet: 'Oyster, flat three-piece links',
        bezel: 'Fluted, white gold',
        dial: 'Blue',
        crystal: 'Scratch-resistant sapphire'
      },
      metaTitle: 'Rolex Datejust 41 - Classic Luxury Watch | Luxury Watch Store',
      metaDescription: 'Experience timeless elegance with the Rolex Datejust 41. Classic Swiss luxury watch with iconic design.',
    },

    // Omega Products
    {
      name: 'Omega Speedmaster Professional Moonwatch',
      slug: 'omega-speedmaster-professional-moonwatch',
      description: 'The OMEGA Speedmaster Professional Moonwatch is one of the most famous chronographs in the world. When Apollo 11 landed on the moon, a Speedmaster was there.',
      shortDescription: 'The legendary moon watch worn by astronauts',
      sku: 'OMG-SPD-310.30.42.50.01.001',
      price: 6350.00,
      comparePrice: 6800.00,
      costPrice: 5100.00,
      categoryId: createdCategories[2].id, // Omega
      brand: 'Omega',
      featured: true,
      status: 'ACTIVE' as const,
      tags: 'chronograph,space,luxury,manual,moonwatch,nasa',
      specifications: {
        movement: 'Manual-winding chronograph',
        calibre: '1861',
        powerReserve: '48 hours',
        waterResistance: '50 metres / 164 feet',
        caseSize: '42mm',
        caseMaterial: 'Stainless steel',
        bracelet: 'Stainless steel',
        bezel: 'Black aluminium with tachymetric scale',
        dial: 'Black',
        crystal: 'Hesalite',
        functions: '30-minute recorder, 12-hour recorder, Central chronograph hand'
      },
      metaTitle: 'Omega Speedmaster Professional Moonwatch | Luxury Watch Store',
      metaDescription: 'Own the legendary Omega Speedmaster Professional. The first watch on the moon, NASA-qualified chronograph.',
    },
    {
      name: 'Omega Seamaster Planet Ocean',
      slug: 'omega-seamaster-planet-ocean',
      description: 'The Omega Seamaster Planet Ocean represents OMEGA\'s deep commitment to ocean exploration and marine conservation.',
      shortDescription: 'Professional diving watch with 600m water resistance',
      sku: 'OMG-PO-215.30.44.21.01.002',
      price: 5200.00,
      comparePrice: 5600.00,
      costPrice: 4200.00,
      categoryId: createdCategories[2].id, // Omega
      brand: 'Omega',
      featured: false,
      status: 'ACTIVE' as const,
      tags: 'diving,seamaster,luxury,automatic,600m,helium-escape',
      specifications: {
        movement: 'Self-winding chronometer',
        calibre: '8900',
        powerReserve: '60 hours',
        waterResistance: '600 metres / 2000 feet',
        caseSize: '43.5mm',
        caseMaterial: 'Stainless steel',
        bracelet: 'Stainless steel',
        bezel: 'Unidirectional rotating, orange aluminium ring',
        dial: 'Black',
        crystal: 'Scratch-resistant sapphire'
      },
      metaTitle: 'Omega Seamaster Planet Ocean - Professional Diving Watch | Luxury Watch Store',
      metaDescription: 'Explore the depths with the Omega Seamaster Planet Ocean. Professional diving watch with 600m water resistance.',
    },

    // Patek Philippe Products
    {
      name: 'Patek Philippe Calatrava',
      slug: 'patek-philippe-calatrava',
      description: 'The Patek Philippe Calatrava is the ultimate expression of the round watch. Its pure lines and understated elegance make it a true horological icon.',
      shortDescription: 'Ultimate expression of timeless elegance and Swiss craftsmanship',
      sku: 'PP-CAL-5227G-001',
      price: 32400.00,
      comparePrice: 34500.00,
      costPrice: 26000.00,
      categoryId: createdCategories[3].id, // Patek Philippe
      brand: 'Patek Philippe',
      featured: true,
      status: 'ACTIVE' as const,
      tags: 'dress,luxury,swiss,manual,white-gold,calatrava',
      specifications: {
        movement: 'Mechanical manually wound',
        calibre: '215 PS',
        powerReserve: '44 hours',
        waterResistance: '30 metres',
        caseSize: '38mm',
        caseMaterial: '18K white gold',
        strap: 'Alligator leather with fold-over clasp',
        dial: 'Cream',
        crystal: 'Sapphire crystal',
        functions: 'Hours, minutes, small seconds'
      },
      metaTitle: 'Patek Philippe Calatrava - Ultimate Luxury Watch | Luxury Watch Store',
      metaDescription: 'Experience the ultimate in Swiss luxury with the Patek Philippe Calatrava. Timeless elegance in 18K white gold.',
    },
    {
      name: 'Patek Philippe Nautilus',
      slug: 'patek-philippe-nautilus',
      description: 'The Patek Philippe Nautilus, launched in 1976, is one of the most coveted luxury sports watches in the world.',
      shortDescription: 'Iconic luxury sports watch with octagonal bezel',
      sku: 'PP-NAU-5711/1A-010',
      price: 89500.00,
      comparePrice: 95000.00,
      costPrice: 72000.00,
      categoryId: createdCategories[3].id, // Patek Philippe
      brand: 'Patek Philippe',
      featured: true,
      status: 'ACTIVE' as const,
      tags: 'sport-luxury,nautilus,swiss,automatic,steel,iconic',
      specifications: {
        movement: 'Self-winding',
        calibre: '26-330 S C',
        powerReserve: '35-45 hours',
        waterResistance: '120 metres',
        caseSize: '40mm',
        caseMaterial: 'Stainless steel',
        bracelet: 'Stainless steel',
        dial: 'Blue, horizontal embossed',
        crystal: 'Sapphire crystal',
        functions: 'Date, hours, minutes, sweep seconds'
      },
      metaTitle: 'Patek Philippe Nautilus - Iconic Luxury Sports Watch | Luxury Watch Store',
      metaDescription: 'Own the legendary Patek Philippe Nautilus. Iconic luxury sports watch with distinctive octagonal bezel.',
    },

    // Audemars Piguet Products
    {
      name: 'Audemars Piguet Royal Oak',
      slug: 'audemars-piguet-royal-oak',
      description: 'The Audemars Piguet Royal Oak, designed by Gérald Genta, revolutionized luxury watchmaking with its octagonal bezel and "Tapisserie" dial.',
      shortDescription: 'Revolutionary luxury sports watch with octagonal bezel',
      sku: 'AP-RO-15400ST.OO.1220ST.03',
      price: 27400.00,
      comparePrice: 29200.00,
      costPrice: 22000.00,
      categoryId: createdCategories[4].id, // Audemars Piguet
      brand: 'Audemars Piguet',
      featured: true,
      status: 'ACTIVE' as const,
      tags: 'luxury-sport,royal-oak,swiss,automatic,steel,octagonal',
      specifications: {
        movement: 'Automatic winding',
        calibre: '3120',
        powerReserve: '60 hours',
        waterResistance: '50 metres',
        caseSize: '41mm',
        caseMaterial: 'Stainless steel',
        bracelet: 'Stainless steel',
        dial: 'Silver-toned with "Grande Tapisserie" pattern',
        crystal: 'Sapphire crystal',
        functions: 'Hours, minutes, seconds, date'
      },
      metaTitle: 'Audemars Piguet Royal Oak - Luxury Sports Watch | Luxury Watch Store',
      metaDescription: 'Experience the revolutionary Audemars Piguet Royal Oak. Luxury sports watch with iconic octagonal design.',
    },

    // Sport Watch Category
    {
      name: 'Tudor Black Bay 58',
      slug: 'tudor-black-bay-58',
      description: 'The Tudor Black Bay 58 is a compact diving watch that captures the essence of Tudor\'s first divers\' watches launched in 1954.',
      shortDescription: 'Heritage-inspired diving watch with vintage charm',
      sku: 'TUD-BB-79030N',
      price: 3675.00,
      comparePrice: 3900.00,
      costPrice: 2950.00,
      categoryId: createdCategories[5].id, // Sport Watches
      brand: 'Tudor',
      featured: false,
      status: 'ACTIVE' as const,
      tags: 'diving,sport,heritage,automatic,steel,200m',
      specifications: {
        movement: 'Self-winding mechanical',
        calibre: 'MT5402',
        powerReserve: '70 hours',
        waterResistance: '200 metres',
        caseSize: '39mm',
        caseMaterial: 'Stainless steel',
        bracelet: 'Stainless steel',
        bezel: 'Unidirectional rotatable, 60-minute graduated, black aluminium insert',
        dial: 'Black',
        crystal: 'Sapphire crystal'
      },
      metaTitle: 'Tudor Black Bay 58 - Heritage Diving Watch | Luxury Watch Store',
      metaDescription: 'Discover the Tudor Black Bay 58. Heritage-inspired diving watch with 39mm case and 200m water resistance.',
    },
  ]

  const createdProducts = []
  for (const product of products) {
    try {
      const created = await prisma.product.create({
        data: product,
      })
      createdProducts.push(created)

      // Add sample images for each product
      const imageUrls = [
        'https://images.unsplash.com/photo-1548181048-dab5c1b4a746?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1523170335258-f5c6c6bd6eaf?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800&h=800&fit=crop&crop=center',
      ]

      await prisma.productImage.createMany({
        data: imageUrls.map((url, index) => ({
          productId: created.id,
          url,
          altText: `${created.name} - ${index === 0 ? 'Main View' : index === 1 ? 'Side View' : index === 2 ? 'Detail View' : 'Back View'}`,
          isPrimary: index === 0,
          sortOrder: index + 1,
        })),
      })

      // Add inventory for each product
      await prisma.inventory.create({
        data: {
          productId: created.id,
          quantity: Math.floor(Math.random() * 15) + 5, // Random quantity between 5-20
          reserved: 0,
          lowStockAlert: 3,
        },
      })

      // Add variants for select products (sizes)
      if (['Rolex', 'Omega', 'Tudor'].includes(product.brand)) {
        const sizes = ['40mm', '42mm']
        for (let i = 0; i < sizes.length; i++) {
          const size = sizes[i]
          await prisma.productVariant.create({
            data: {
              productId: created.id,
              name: 'Case Size',
              value: size,
              sku: `${product.sku}-${size}`,
              price: i === 1 ? 200 : 0, // 42mm adds $200
              sortOrder: i + 1,
            },
          })
        }
      }

      // Add sample reviews
      const sampleReviews = [
        {
          name: 'Michael Thompson',
          email: 'michael@example.com',
          rating: 5,
          title: 'Exceptional Craftsmanship',
          comment: 'This watch exceeded all my expectations. The attention to detail is remarkable and it keeps perfect time. Worth every penny.',
          isVerified: true,
        },
        {
          name: 'Sarah Chen',
          email: 'sarah@example.com',
          rating: 5,
          title: 'Stunning Timepiece',
          comment: 'Absolutely beautiful watch. The build quality is outstanding and it looks even better in person than in photos.',
          isVerified: true,
        },
        {
          name: 'David Rodriguez',
          email: 'david@example.com',
          rating: 4,
          title: 'Great Watch, Fast Delivery',
          comment: 'Very happy with this purchase. Beautiful watch and arrived quickly in perfect condition. Highly recommend!',
          isVerified: false,
        },
      ]

      for (const review of sampleReviews) {
        await prisma.review.create({
          data: {
            ...review,
            productId: created.id,
          },
        })
      }

      console.log(`✓ Created product: ${created.name}`)
    } catch (error) {
      console.log(`✗ Error creating product ${product.name}:`, error)
    }
  }

  console.log('\n🎉 Database seeded successfully!')
  console.log(`Created ${createdCategories.length} categories`)
  console.log(`Created ${createdProducts.length} products`)
  console.log(`Created admin user: ${adminUser.email}`)
  console.log('\n📊 Summary:')
  console.log('- Admin credentials: admin@luxurywatch.com / admin123')
  console.log('- Categories: Luxury Watches, Rolex, Omega, Patek Philippe, Audemars Piguet, Sport Watches')
  console.log('- Products include variants, inventory, images, and reviews')
  console.log('- Ready for e-commerce functionality!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })