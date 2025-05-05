export const mockAirQualityData = [
  {
    id: 'co2',
    name: 'CO2',
    fullName: 'Carbon Dioxide',
    value: 400,
    unit: 'ppm',
    threshold: {
      good: 800,
      moderate: 1000,
      unhealthy: 1500
    },
    description: 'Carbon dioxide is a greenhouse gas that contributes to climate change.',
    color: '#ef4444'
  },
  {
    id: 'nh3',
    name: 'NH3',
    fullName: 'Ammonia',
    value: 25,
    unit: 'ppb',
    threshold: {
      good: 50,
      moderate: 100,
      unhealthy: 150
    },
    description: 'Ammonia is a colorless gas with a pungent odor, commonly used in fertilizers and cleaning products.',
    color: '#f59e0b'
  },
  {
    id: 'alcohol',
    name: 'Alcohol',
    fullName: 'Ethanol',
    value: 100,
    unit: 'ppb',
    threshold: {
      good: 200,
      moderate: 400,
      unhealthy: 600
    },
    description: 'Ethanol is a volatile organic compound that can contribute to air pollution.',
    color: '#9333ea'
  },
  {
    id: 'smoke',
    name: 'Smoke',
    fullName: 'Smoke',
    value: 15,
    unit: 'µg/m³',
    threshold: {
      good: 20,
      moderate: 40,
      unhealthy: 60
    },
    description: 'Smoke particles can cause respiratory problems and reduce visibility.',
    color: '#10b981'
  },
  {
    id: 'benzene',
    name: 'Benzene',
    fullName: 'Benzene',
    value: 2,
    unit: 'ppb',
    threshold: {
      good: 5,
      moderate: 10,
      unhealthy: 15
    },
    description: 'Benzene is a colorless, flammable liquid with a sweet odor, commonly found in vehicle emissions.',
    color: '#3b82f6'
  },
  {
    id: 'pm25',
    name: 'PM2.5',
    fullName: 'Fine Particulate Matter',
    value: 40,
    unit: 'μg/m³',
    threshold: {
      good: 30,
      moderate: 60,
      unhealthy: 90
    },
    description: 'Fine particulate matter (PM2.5) are tiny particles or droplets in the air that are 2.5 microns or less in width.',
    color: '#6366f1'
  }
];

export const historicalData = [
  { 
    time: '00:00', 
    CO2: 400,
    NH3: 25,
    Alcohol: 100,
    Smoke: 15,
    Benzene: 2,
    PM25: 40
  },
  { 
    time: '03:00', 
    CO2: 420,
    NH3: 28,
    Alcohol: 120,
    Smoke: 18,
    Benzene: 2.5,
    PM25: 45
  },
  { 
    time: '06:00', 
    CO2: 450,
    NH3: 32,
    Alcohol: 150,
    Smoke: 22,
    Benzene: 3,
    PM25: 50
  },
  { 
    time: '09:00', 
    CO2: 480,
    NH3: 35,
    Alcohol: 180,
    Smoke: 25,
    Benzene: 3.5,
    PM25: 55
  },
  { 
    time: '12:00', 
    CO2: 500,
    NH3: 38,
    Alcohol: 200,
    Smoke: 28,
    Benzene: 4,
    PM25: 60
  },
  { 
    time: '15:00', 
    CO2: 480,
    NH3: 35,
    Alcohol: 180,
    Smoke: 25,
    Benzene: 3.5,
    PM25: 55
  },
  { 
    time: '18:00', 
    CO2: 450,
    NH3: 32,
    Alcohol: 150,
    Smoke: 22,
    Benzene: 3,
    PM25: 50
  },
  { 
    time: '21:00', 
    CO2: 420,
    NH3: 28,
    Alcohol: 120,
    Smoke: 18,
    Benzene: 2.5,
    PM25: 45
  }
]; 