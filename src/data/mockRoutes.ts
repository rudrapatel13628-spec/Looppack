import type { LogisticsRoute } from '../types';

export const MOCK_LOGISTICS_ROUTES: LogisticsRoute[] = [
  {
    id: 'ROUTE-MH-01',
    routeName: 'Pune-Mumbai Circular Eco-Backhaul #4',
    carrierName: 'Mahindra Electric Logistics Fleet',
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
    status: 'Optimized & Scheduled',
    nodes: [
      { id: 'N1', name: 'Tata AutoComp Plant', type: 'Pickup (Supplier)', lat: 18.7606, lng: 73.8619, address: 'Chakan, Pune', demandQuantity: '2,000 Cardboard Boxes' },
      { id: 'N2', name: 'Lonavala Micro-Staging Hub', type: 'Processing Hub', lat: 18.7557, lng: 73.4091, address: 'Lonavala, MH', demandQuantity: 'Inspection & QR Tagging' },
      { id: 'N3', name: 'Bajaj Electricals Unit', type: 'Pickup (Supplier)', lat: 18.9894, lng: 73.1175, address: 'Panvel, MH', demandQuantity: '350 Wooden Pallets' },
      { id: 'N4', name: 'Flipkart Bhiwandi Depot', type: 'Dropoff (Buyer)', lat: 19.2812, lng: 73.0482, address: 'Bhiwandi, Mumbai', demandQuantity: 'Consolidated Delivery' }
    ]
  },
  {
    id: 'ROUTE-KA-02',
    routeName: 'Bengaluru-Hosur Industrial Green Corridor',
    carrierName: 'TVS Electric Logistics Fleet',
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
    status: 'In Transit',
    nodes: [
      { id: 'N10', name: 'Bosch Peenya Unit', type: 'Pickup (Supplier)', lat: 13.0285, lng: 77.5197, address: 'Peenya, Bengaluru', demandQuantity: '350 Wooden Pallets' },
      { id: 'N11', name: 'Electronic City Eco Staging', type: 'Processing Hub', lat: 12.8452, lng: 77.6602, address: 'Bengaluru, KA', demandQuantity: 'Compaction & QR Tagging' },
      { id: 'N12', name: 'TVS Motor Components', type: 'Dropoff (Buyer)', lat: 12.7409, lng: 77.8253, address: 'Hosur, TN', demandQuantity: 'Final Dropoff' }
    ]
  }
];
