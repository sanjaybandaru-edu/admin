export interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  website?: string;
  marketingStrategy: string;
  pricingModel: string;
  customerAcquisition: string;
  targetMarket: string;
  createdAt: number;
  updatedAt: number;
}

export interface Report {
  id: string;
  companyId: string;
  type: ReportType;
  content: string;
  createdAt: number;
  updatedAt: number;
  generatedBy: string;
  cached: boolean;
}

export type ReportType = 'business-overview' | 'market-research' | 'launch-strategy' | 'capital-raising' | "entreprenuer-learning";