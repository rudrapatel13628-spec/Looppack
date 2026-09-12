import type { DigitalPassport } from '../types';

export const MOCK_DIGITAL_PASSPORTS: Record<string, DigitalPassport> = {
  'LIST-IN-101': {
    id: 'DMP-IN-101-99A',
    serialNumber: 'LP-2026-IN-CB-2000',
    listingId: 'LIST-IN-101',
    materialName: 'Surplus Heavy Duty Double-Wall Corrugated Boxes',
    quantity: 2000,
    unit: 'boxes',
    originCompany: 'Tata AutoComp Systems Ltd',
    manufacturingLocation: 'Chakan Industrial Estate, Pune, MH',
    rawMaterialSource: 'Post-Consumer Unbleached Kraft Paper Fluting',
    recycledContentPercent: 92,
    virginContentPercent: 8,
    carbonFootprintKgPerKg: 0.20,
    netCo2SavedKg: 1350,
    aiMatchScorePercent: 96,
    recyclabilityRating: '100% Recyclable',
    certifications: [
      'ISO 14040 Lifecycle Assessment Verified',
      '92% Post-Consumer Kraft Pulp Certification',
      'Bureau of Indian Standards (BIS) Heavy Duty Container',
      'Non-Toxic Starch Adhesive Certification'
    ],
    movementHistory: [
      {
        timestamp: '2026-02-15 09:30 IST',
        stage: 'Recycled Kraft Pulp Extrusion',
        actor: 'Western India Paper Mills',
        location: 'Vapi, GJ',
        verificationHash: '0x8f2a91b...4e10'
      },
      {
        timestamp: '2026-02-20 14:00 IST',
        stage: 'Corrugated Container Conversion',
        actor: 'Pune Packaging Works',
        location: 'Pune, MH',
        verificationHash: '0x3c71d4a...92f1'
      },
      {
        timestamp: '2026-03-01 11:15 IST',
        stage: 'Single-Trip Auto Parts Logistics',
        actor: 'Tata AutoComp Systems',
        location: 'Chakan, Pune',
        verificationHash: '0x7e8102c...11a9'
      },
      {
        timestamp: '2026-03-12 03:00 IST',
        stage: 'LoopPack Surplus Audit & AI Match Verification',
        actor: 'LoopPack Verification Node',
        location: 'Pune Hub, MH',
        verificationHash: '0x9941bc3...77e4'
      }
    ],
    qrData: 'https://looppack.in/passport/DMP-IN-101-99A?hash=0x9941bc377e4'
  },
  'LIST-IN-102': {
    id: 'DMP-IN-102-12B',
    serialNumber: 'LP-2026-IN-PAL-0350',
    listingId: 'LIST-IN-102',
    materialName: 'Standard ISPM-15 Heat-Treated Wooden Euro Pallets',
    quantity: 350,
    unit: 'pallets',
    originCompany: 'Bosch India Hardware Logistics',
    manufacturingLocation: 'Peenya Industrial Area, Bengaluru, KA',
    rawMaterialSource: 'Certified Sustainable Pinus Sylvestris',
    recycledContentPercent: 85,
    virginContentPercent: 15,
    carbonFootprintKgPerKg: 0.30,
    netCo2SavedKg: 10450,
    aiMatchScorePercent: 94,
    recyclabilityRating: 'Reusable Circular',
    certifications: [
      'ISPM-15 Phytosanitary Heat Treated',
      'FSC Chain-of-Custody Certification',
      'Green Logistics Standards India 2025'
    ],
    movementHistory: [
      {
        timestamp: '2026-01-10 10:00 IST',
        stage: 'Timber Kiln Drying & Heat Treatment',
        actor: 'Karnataka Timber Processing',
        location: 'Shivamogga, KA',
        verificationHash: '0x12a49f1...88b2'
      },
      {
        timestamp: '2026-01-18 15:20 IST',
        stage: 'Pallet Stamping & Assembly',
        actor: 'Bengaluru Wood Products',
        location: 'Bengaluru, KA',
        verificationHash: '0x55b11c9...33d0'
      },
      {
        timestamp: '2026-03-10 12:45 IST',
        stage: 'Surplus Claim Verification',
        actor: 'Bosch India Logistics',
        location: 'Peenya, Bengaluru',
        verificationHash: '0xbb8910e...66f2'
      }
    ],
    qrData: 'https://looppack.in/passport/DMP-IN-102-12B?hash=0xbb8910e66f2'
  }
};
