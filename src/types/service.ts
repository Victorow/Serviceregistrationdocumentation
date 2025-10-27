export type TimeUnit = 'Minutos' | 'Horas' | 'Dias';

export interface ServiceProcess {
  id: string;
  processId: string;
  processName: string;
  quantity: number;
  cost: number;
  totalCost: number;
}

export interface ServiceMaterial {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  price: number;
  totalCost: number;
}

export interface Service {
  id: string;
  name: string;
  abbreviation?: string;
  serviceClass: string;
  control?: string;
  timeUnit: TimeUnit;
  duration?: number;
  durationForecast?: number;
  deliveryDays: number;
  standardQuantity?: number;
  radiationExposure: boolean;
  value?: number;
  processes: ServiceProcess[];
  materials: ServiceMaterial[];
  processCost: number;
  materialCost: number;
  totalCost: number;
  createdAt: string;
  createdBy: string;
}

export interface ServiceClass {
  id: string;
  name: string;
}

export interface Process {
  id: string;
  name: string;
  baseCost: number;
}

export interface Material {
  id: string;
  name: string;
  basePrice: number;
}
