import { 
  PrismaClient, 
  CompanyType, 
  UserRole, 
  MaterialCategory, 
  MaterialGrade, 
  RecyclabilityRating, 
  MatchStatus, 
  ClaimStatus, 
  LogisticsMode, 
  RouteStatus, 
  NodeType, 
  NotificationType 
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting LoopPack Database Seeding...');

  // Clean existing data in reverse dependency order
  await prisma.notification.deleteMany();
  await prisma.routeNode.deleteMany();
  await prisma.claimTransaction.deleteMany();
  await prisma.logisticsRoute.deleteMany();
  await prisma.passportAuditLog.deleteMany();
  await prisma.digitalPassport.deleteMany();
  await prisma.aiMatch.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  console.log('🧹 Cleaned existing records.');

  // 1. CREATE COMPANIES
  const cTata = await prisma.company.create({
    data: {
      id: 'COMP-IN-TATA-01',
      name: 'Tata AutoComp Systems Ltd',
      type: CompanyType.MANUFACTURER,
      rating: 4.95,
      location: 'Chakan Industrial Estate',
      cityState: 'Pune, MH'
    }
  });

  const cBosch = await prisma.company.create({
    data: {
      id: 'COMP-IN-BOSCH-02',
      name: 'Bosch India Hardware Logistics',
      type: CompanyType.MANUFACTURER,
      rating: 4.88,
      location: 'Peenya Industrial Area',
      cityState: 'Bengaluru, KA'
    }
  });

  const cHyundai = await prisma.company.create({
    data: {
      id: 'COMP-IN-HYUNDAI-03',
      name: 'Hyundai Supplier Logistics Park',
      type: CompanyType.DISTRIBUTION_HUB,
      rating: 4.92,
      location: 'Sriperumbudur Auto Belt',
      cityState: 'Chennai, TN'
    }
  });

  const cGujarat = await prisma.company.create({
    data: {
      id: 'COMP-IN-GUJARAT-04',
      name: 'Gujarat Alkali & Chemicals Ltd',
      type: CompanyType.RECYCLER,
      rating: 4.85,
      location: 'Vatva GIDC Chemical Estate',
      cityState: 'Ahmedabad, GJ'
    }
  });

  const cBioPack = await prisma.company.create({
    data: {
      id: 'COMP-IN-BIOPACK-05',
      name: 'BioPack Solutions Pvt Ltd',
      type: CompanyType.MANUFACTURER,
      rating: 4.96,
      location: 'Electronic City Phase 1',
      cityState: 'Bengaluru, KA'
    }
  });

  const cFlipkart = await prisma.company.create({
    data: {
      id: 'COMP-IN-FLIPKART-06',
      name: 'Flipkart Logistics Fulfillment',
      type: CompanyType.DISTRIBUTION_HUB,
      rating: 4.90,
      location: 'Bhiwandi Freight Hub',
      cityState: 'Mumbai, MH'
    }
  });

  const cMahindraFleet = await prisma.company.create({
    data: {
      id: 'COMP-IN-MAHINDRA-07',
      name: 'Mahindra Electric Logistics Fleet',
      type: CompanyType.LOGISTICS_FLEET,
      rating: 4.94,
      location: 'Chakan Industrial Hub',
      cityState: 'Pune, MH'
    }
  });

  const cTvsFleet = await prisma.company.create({
    data: {
      id: 'COMP-IN-TVS-08',
      name: 'TVS Electric Logistics Fleet',
      type: CompanyType.LOGISTICS_FLEET,
      rating: 4.91,
      location: 'Hosur Auto Cluster',
      cityState: 'Hosur, TN'
    }
  });

  console.log('✅ Companies created.');

  // 2. CREATE USERS
  const uTata = await prisma.user.create({
    data: {
      id: 'USER-001',
      email: 'tata.admin@looppack.in',
      passwordHash: '$2b$10$e898f828a2a88...hash',
      fullName: 'Rajesh Sharma (Tata Logistics Mgr)',
      role: UserRole.MANUFACTURER,
      companyId: cTata.id
    }
  });

  const uBosch = await prisma.user.create({
    data: {
      id: 'USER-002',
      email: 'bosch.logistics@looppack.in',
      passwordHash: '$2b$10$d778a828b1b22...hash',
      fullName: 'Anita Desai (Bosch Circular Lead)',
      role: UserRole.MANUFACTURER,
      companyId: cBosch.id
    }
  });

  const uFlipkart = await prisma.user.create({
    data: {
      id: 'USER-003',
      email: 'flipkart.procurement@looppack.in',
      passwordHash: '$2b$10$a112f998c3c44...hash',
      fullName: 'Vikram Mehta (Flipkart Procurement)',
      role: UserRole.BUYER_RECYCLER,
      companyId: cFlipkart.id
    }
  });

  const uFleet = await prisma.user.create({
    data: {
      id: 'USER-004',
      email: 'mahindra.fleet@looppack.in',
      passwordHash: '$2b$10$f334a118d4d55...hash',
      fullName: 'Suresh Kumar (Mahindra Fleet Ops)',
      role: UserRole.LOGISTICS_FLEET,
      companyId: cMahindraFleet.id
    }
  });

  console.log('✅ Users created.');

  // 3. CREATE MATERIAL LISTINGS
  const lCardboard = await prisma.listing.create({
    data: {
      id: 'LIST-IN-101',
      title: 'Surplus Heavy Duty Double-Wall Corrugated Boxes',
      category: MaterialCategory.CARDBOARD,
      quantity: 2000,
      unit: 'boxes',
      weightPerUnitKg: 1.0,
      location: 'Chakan Industrial Estate',
      cityState: 'Pune, MH',
      distanceKm: 18.5,
      pricePerUnitInr: 0,
      condition: MaterialGrade.CLEAN_RECYCLABLE,
      sellerId: cTata.id,
      image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      verified: true,
      description: 'Clean double-wall kraft cardboard containers from single-trip auto component transport. 2,000 kg total weight. Baseline 0.9 vs Circular 0.2 kg CO₂e/kg.',
      compositionPercent: '92% Recycled Pulp, 8% Kraft Paper Liner',
      dimensions: '600mm x 400mm x 400mm',
      loadCapacityKg: 50
    }
  });

  const lPallets = await prisma.listing.create({
    data: {
      id: 'LIST-IN-102',
      title: 'Standard ISPM-15 Heat-Treated Wooden Euro Pallets',
      category: MaterialCategory.WOODEN_PALLETS,
      quantity: 350,
      unit: 'pallets',
      weightPerUnitKg: 20.0,
      location: 'Peenya Industrial Area',
      cityState: 'Bengaluru, KA',
      distanceKm: 24.0,
      pricePerUnitInr: 450,
      condition: MaterialGrade.GRADE_A_LIKE_NEW,
      sellerId: cBosch.id,
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      verified: true,
      description: 'ISPM-15 certified heat-treated pine pallets from hardware component shipments. Indoor dry stored.',
      compositionPercent: '100% Plantation Pine Wood (FSC Certified)',
      dimensions: '1200mm x 800mm x 144mm',
      loadCapacityKg: 1500
    }
  });

  const lDrums = await prisma.listing.create({
    data: {
      id: 'LIST-IN-103',
      title: 'Food-Grade 200L HDPE Polyethylene Drums',
      category: MaterialCategory.HDPE_PLASTICS,
      quantity: 120,
      unit: 'drums',
      weightPerUnitKg: 12.0,
      location: 'Sriperumbudur Auto Belt',
      cityState: 'Chennai, TN',
      distanceKm: 32.1,
      pricePerUnitInr: 850,
      condition: MaterialGrade.REFURBISHED,
      sellerId: cHyundai.id,
      image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
      verified: true,
      description: 'Triple-rinsed food grade high-density blue plastic drums. UN-certified for chemical and liquid storage.',
      compositionPercent: '100% High Density Polyethylene (HDPE-2)',
      dimensions: '580mm Dia x 930mm Height',
      loadCapacityKg: 200
    }
  });

  const lSteelDrums = await prisma.listing.create({
    data: {
      id: 'LIST-IN-104',
      title: 'Reconditioned 210L Steel Open-Head Drums',
      category: MaterialCategory.STEEL_DRUMS,
      quantity: 85,
      unit: 'drums',
      weightPerUnitKg: 18.0,
      location: 'Vatva GIDC Chemical Estate',
      cityState: 'Ahmedabad, GJ',
      distanceKm: 45.0,
      pricePerUnitInr: 1200,
      condition: MaterialGrade.REFURBISHED,
      sellerId: cGujarat.id,
      image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80',
      verified: true,
      description: 'Shot-blasted and re-coated 18-gauge steel drums with bolt ring clamp lids.',
      compositionPercent: '98% Recycled Structural Steel',
      dimensions: '600mm Dia x 880mm Height',
      loadCapacityKg: 250
    }
  });

  const lBioFoam = await prisma.listing.create({
    data: {
      id: 'LIST-IN-105',
      title: 'Mushroom Mycelium Bio-Foam Protective Trays',
      category: MaterialCategory.BIO_FOAM,
      quantity: 2500,
      unit: 'inserts',
      weightPerUnitKg: 0.4,
      location: 'Electronic City Phase 1',
      cityState: 'Bengaluru, KA',
      distanceKm: 12.4,
      pricePerUnitInr: 45,
      condition: MaterialGrade.GRADE_A_LIKE_NEW,
      sellerId: cBioPack.id,
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
      verified: true,
      description: 'Home compostable bio-packaging inserts made from agricultural waste and mycelium root structure.',
      compositionPercent: '70% Paddy Straw, 30% Mycelium Binder',
      dimensions: '200mm x 150mm x 60mm',
      loadCapacityKg: 30
    }
  });

  const lPlasticBales = await prisma.listing.create({
    data: {
      id: 'LIST-IN-106',
      title: 'Compacted LLDPE Clear Stretch Film Bales',
      category: MaterialCategory.HDPE_PLASTICS,
      quantity: 15,
      unit: 'bales',
      weightPerUnitKg: 250.0,
      location: 'Bhiwandi Freight Hub',
      cityState: 'Mumbai, MH',
      distanceKm: 38.0,
      pricePerUnitInr: 4500,
      condition: MaterialGrade.INDUSTRIAL_BULK,
      sellerId: cFlipkart.id,
      image: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
      verified: true,
      description: 'Clean post-industrial stretch film collected from pallet unpackaging. Compacted into 250 kg bales ready for re-pelletization.',
      compositionPercent: '99% LLDPE Film',
      dimensions: '1200mm x 800mm x 1000mm Bale',
      loadCapacityKg: 250
    }
  });

  console.log('✅ Material Listings created.');

  // 4. CREATE DIGITAL PASSPORTS & AUDIT LOGS
  const pass1 = await prisma.digitalPassport.create({
    data: {
      id: 'DMP-IN-101-99A',
      serialNumber: 'LP-2026-IN-CB-2000',
      listingId: lCardboard.id,
      materialName: 'Surplus Heavy Duty Double-Wall Corrugated Boxes',
      quantity: 2000,
      unit: 'boxes',
      originCompany: cTata.name,
      manufacturingLocation: 'Chakan Industrial Estate, Pune, MH',
      rawMaterialSource: 'Post-Consumer Unbleached Kraft Paper Fluting',
      recycledContentPercent: 92,
      virginContentPercent: 8,
      carbonFootprintKgPerKg: 0.20,
      netCo2SavedKg: 1350,
      aiMatchScorePercent: 96,
      recyclabilityRating: RecyclabilityRating.RECYCLABLE_100,
      certifications: [
        'ISO 14040 Lifecycle Assessment Verified',
        '92% Post-Consumer Kraft Pulp Certification',
        'Bureau of Indian Standards (BIS) Heavy Duty Container',
        'Non-Toxic Starch Adhesive Certification'
      ],
      qrData: 'https://looppack.in/passport/DMP-IN-101-99A?hash=0x9941bc377e4',
      movementHistory: {
        create: [
          {
            stage: 'Recycled Kraft Pulp Extrusion',
            actor: 'Western India Paper Mills',
            location: 'Vapi, GJ',
            verificationHash: '0x8f2a91b...4e10'
          },
          {
            stage: 'Corrugated Container Conversion',
            actor: 'Pune Packaging Works',
            location: 'Pune, MH',
            verificationHash: '0x3c71d4a...92f1'
          },
          {
            stage: 'Single-Trip Auto Parts Logistics',
            actor: 'Tata AutoComp Systems',
            location: 'Chakan, Pune',
            verificationHash: '0x7e8102c...11a9'
          },
          {
            stage: 'LoopPack Surplus Audit & AI Match Verification',
            actor: 'LoopPack Verification Node',
            location: 'Pune Hub, MH',
            verificationHash: '0x9941bc3...77e4'
          }
        ]
      }
    }
  });

  const pass2 = await prisma.digitalPassport.create({
    data: {
      id: 'DMP-IN-102-12B',
      serialNumber: 'LP-2026-IN-PAL-0350',
      listingId: lPallets.id,
      materialName: 'Standard ISPM-15 Heat-Treated Wooden Euro Pallets',
      quantity: 350,
      unit: 'pallets',
      originCompany: cBosch.name,
      manufacturingLocation: 'Peenya Industrial Area, Bengaluru, KA',
      rawMaterialSource: 'Certified Sustainable Pinus Sylvestris',
      recycledContentPercent: 85,
      virginContentPercent: 15,
      carbonFootprintKgPerKg: 0.30,
      netCo2SavedKg: 10450,
      aiMatchScorePercent: 94,
      recyclabilityRating: RecyclabilityRating.REUSABLE_CIRCULAR,
      certifications: [
        'ISPM-15 Phytosanitary Heat Treated',
        'FSC Chain-of-Custody Certification',
        'Green Logistics Standards India 2025'
      ],
      qrData: 'https://looppack.in/passport/DMP-IN-102-12B?hash=0xbb8910e66f2',
      movementHistory: {
        create: [
          {
            stage: 'Timber Kiln Drying & Heat Treatment',
            actor: 'Karnataka Timber Processing',
            location: 'Shivamogga, KA',
            verificationHash: '0x12a49f1...88b2'
          },
          {
            stage: 'Pallet Stamping & Assembly',
            actor: 'Bengaluru Wood Products',
            location: 'Bengaluru, KA',
            verificationHash: '0x55b11c9...33d0'
          },
          {
            stage: 'Surplus Claim Verification',
            actor: 'Bosch India Logistics',
            location: 'Peenya, Bengaluru',
            verificationHash: '0xbb8910e...66f2'
          }
        ]
      }
    }
  });

  console.log('✅ Digital Passports & Audit Logs created.');

  // 5. CREATE AI MATCHES
  await prisma.aiMatch.create({
    data: {
      id: 'MATCH-001',
      listingId: lCardboard.id,
      buyerId: cFlipkart.id,
      buyerName: cFlipkart.name,
      buyerType: 'Distribution Fulfillment Hub',
      distanceKm: 18.5,
      matchScorePercent: 96,
      materialCompatibilityScore: 98,
      carbonBenefitScore: 95,
      availabilityTimeScore: 94,
      quantityFitScore: 96,
      priceScore: 100,
      distanceScore: 92,
      co2SavingsTotalKg: 1350,
      costSavingsTotalInr: 90000,
      suggestedPricePerUnitInr: 0,
      status: MatchStatus.PENDING,
      logisticsMode: LogisticsMode.SHARED_BACKHAUL_LOOP,
      matchReasoning: [
        'Exact specification match for outbound eCommerce packing',
        'Minimal transport distance saving 1.35 tCO₂e',
        'Available immediately at zero unit price'
      ]
    }
  });

  await prisma.aiMatch.create({
    data: {
      id: 'MATCH-002',
      listingId: lPallets.id,
      buyerId: cMahindraFleet.id,
      buyerName: 'Mahindra EV Assembly Plant',
      buyerType: 'Automotive OEM',
      distanceKm: 24.0,
      matchScorePercent: 94,
      materialCompatibilityScore: 96,
      carbonBenefitScore: 98,
      availabilityTimeScore: 90,
      quantityFitScore: 92,
      priceScore: 90,
      distanceScore: 94,
      co2SavingsTotalKg: 10450,
      costSavingsTotalInr: 157500,
      suggestedPricePerUnitInr: 420,
      status: MatchStatus.ACCEPTED,
      logisticsMode: LogisticsMode.SHARED_BACKHAUL_LOOP,
      matchReasoning: [
        'ISPM-15 Heat-treated certification verified',
        'Direct fit for heavy component rack transport',
        'Reduces virgin timber demand by 7.0 Tons'
      ]
    }
  });

  console.log('✅ AI Matches created.');

  // 6. CREATE LOGISTICS ROUTES & NODES
  const rMH = await prisma.logisticsRoute.create({
    data: {
      id: 'ROUTE-MH-01',
      routeName: 'Pune-Mumbai Circular Eco-Backhaul #4',
      carrierId: cMahindraFleet.id,
      carrierName: cMahindraFleet.name,
      vehicleType: 'Heavy Commercial EV Freight Truck (250 kWh)',
      originHub: 'Chakan Industrial Hub, Pune',
      destinationHub: 'Bhiwandi Fulfillment Zone, Mumbai',
      totalDistanceKm: 145,
      linearRouteDistanceKm: 290,
      distanceSavedKm: 145,
      linearEmissionsKg: 420,
      loopEmissionsKg: 95,
      emissionsSavedKg: 325,
      estimatedCostSavedInr: 28500,
      backhaulOpportunityPercent: 92,
      vehicleCapacityPercent: 95,
      status: RouteStatus.OPTIMIZED_SCHEDULED,
      nodes: {
        create: [
          {
            name: 'Tata AutoComp Plant',
            type: NodeType.PICKUP_SUPPLIER,
            lat: 18.7606,
            lng: 73.8619,
            address: 'Chakan, Pune',
            demandQuantity: '2,000 Cardboard Boxes',
            sequenceOrder: 1
          },
          {
            name: 'Lonavala Micro-Staging Hub',
            type: NodeType.PROCESSING_HUB,
            lat: 18.7557,
            lng: 73.4091,
            address: 'Lonavala, MH',
            demandQuantity: 'Inspection & QR Tagging',
            sequenceOrder: 2
          },
          {
            name: 'Bajaj Electricals Unit',
            type: NodeType.PICKUP_SUPPLIER,
            lat: 18.9894,
            lng: 73.1175,
            address: 'Panvel, MH',
            demandQuantity: '350 Wooden Pallets',
            sequenceOrder: 3
          },
          {
            name: 'Flipkart Bhiwandi Depot',
            type: NodeType.DROPOFF_BUYER,
            lat: 19.2812,
            lng: 73.0482,
            address: 'Bhiwandi, Mumbai',
            demandQuantity: 'Consolidated Delivery',
            sequenceOrder: 4
          }
        ]
      }
    }
  });

  const rKA = await prisma.logisticsRoute.create({
    data: {
      id: 'ROUTE-KA-02',
      routeName: 'Bengaluru-Hosur Industrial Green Corridor',
      carrierId: cTvsFleet.id,
      carrierName: cTvsFleet.name,
      vehicleType: 'Class 6 Commercial EV Van',
      originHub: 'Peenya Industrial Estate, Bengaluru',
      destinationHub: 'Hosur Auto Cluster, TN',
      totalDistanceKm: 85,
      linearRouteDistanceKm: 170,
      distanceSavedKm: 85,
      linearEmissionsKg: 240,
      loopEmissionsKg: 52,
      emissionsSavedKg: 188,
      estimatedCostSavedInr: 16200,
      backhaulOpportunityPercent: 88,
      vehicleCapacityPercent: 89,
      status: RouteStatus.IN_TRANSIT,
      nodes: {
        create: [
          {
            name: 'Bosch Peenya Unit',
            type: NodeType.PICKUP_SUPPLIER,
            lat: 13.0285,
            lng: 77.5197,
            address: 'Peenya, Bengaluru',
            demandQuantity: '350 Wooden Pallets',
            sequenceOrder: 1
          },
          {
            name: 'Electronic City Eco Staging',
            type: NodeType.PROCESSING_HUB,
            lat: 12.8452,
            lng: 77.6602,
            address: 'Bengaluru, KA',
            demandQuantity: 'Compaction & QR Tagging',
            sequenceOrder: 2
          },
          {
            name: 'TVS Motor Components',
            type: NodeType.DROPOFF_BUYER,
            lat: 12.7409,
            lng: 77.8253,
            address: 'Hosur, TN',
            demandQuantity: 'Final Dropoff',
            sequenceOrder: 3
          }
        ]
      }
    }
  });

  console.log('✅ Logistics Routes & Nodes created.');

  // 7. CREATE CLAIM TRANSACTIONS
  await prisma.claimTransaction.create({
    data: {
      id: 'CLAIM-001',
      listingId: lCardboard.id,
      buyerId: cFlipkart.id,
      claimedQuantity: 2000,
      unit: 'boxes',
      logisticsMode: LogisticsMode.SHARED_BACKHAUL_LOOP,
      co2SavedKg: 1350,
      costSavingsInr: 90000,
      status: ClaimStatus.COMPLETED,
      routeId: rMH.id
    }
  });

  await prisma.claimTransaction.create({
    data: {
      id: 'CLAIM-002',
      listingId: lPallets.id,
      buyerId: cHyundai.id,
      claimedQuantity: 350,
      unit: 'pallets',
      logisticsMode: LogisticsMode.SHARED_BACKHAUL_LOOP,
      co2SavedKg: 10450,
      costSavingsInr: 157500,
      status: ClaimStatus.COMPLETED,
      routeId: rKA.id
    }
  });

  console.log('✅ Claim Transactions created.');

  // 8. CREATE NOTIFICATIONS
  await prisma.notification.createMany({
    data: [
      {
        id: 'notif-1',
        companyId: cTata.id,
        userId: uTata.id,
        title: 'AI Match Found',
        message: '94% match found for 2,000 kg Corrugated Cardboard.',
        unread: true,
        targetTab: 'aimatchmaker',
        type: NotificationType.MATCH
      },
      {
        id: 'notif-2',
        companyId: cMahindraFleet.id,
        userId: uFleet.id,
        title: 'Route Optimized',
        message: 'Backhaul route optimized. 38 km distance saved.',
        unread: true,
        targetTab: 'logistics',
        type: NotificationType.ROUTE
      },
      {
        id: 'notif-3',
        companyId: cBosch.id,
        userId: uBosch.id,
        title: 'Material Verified',
        message: 'Digital Material Passport LP-2026-IN-PAL-0350 has been verified.',
        unread: true,
        targetTab: 'passports',
        type: NotificationType.PASSPORT
      },
      {
        id: 'notif-4',
        companyId: cFlipkart.id,
        userId: uFlipkart.id,
        title: 'New Buyer Request',
        message: 'GreenMart Retail requested 1,800 kg Corrugated Cardboard.',
        unread: true,
        targetTab: 'marketplace',
        type: NotificationType.REQUEST
      },
      {
        id: 'notif-5',
        companyId: cTata.id,
        userId: uTata.id,
        title: 'Carbon Impact Updated',
        message: 'Estimated carbon savings increased by 1.2 tCO₂e.',
        unread: false,
        targetTab: 'dashboard',
        type: NotificationType.CARBON
      }
    ]
  });

  console.log('✅ Notifications created.');

  console.log('🎉 LoopPack Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed with error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
