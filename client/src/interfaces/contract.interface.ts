interface Risk {
  risk: string;
  explanation: string;
  severity: "low" | "medium" | "high";
  suggestedAlternative?: string;
  _id: string;
}

interface Opportunity {
  opportunity: string;
  explanation: string;
  impact: "low" | "medium" | "high";
  suggestedAlternative?: string;
  _id: string;
}

interface CompensationStructure {
  baseSalary: string;
  bonuses: string;
  equity: string;
  otherBenefits: string;
}

export interface ContractAnalysis {
  userId: string;
  contractText: string;
  risks: Risk[];
  opportunities: Opportunity[];
  summary: string;
  recommendations: string[];
  keyClauses: string[];
  legalCompliance: string;
  negotiationPoints: string[];
  contractDuration: string;
  terminationConditions: string;
  overallScore: number;
  compensationStructure: CompensationStructure;
  performanceMetrics: string[];
  contractType: string;
  intellectualPropertyClauses: string;
  financialTerms?: {
    description: string;
    details: string[];
  };
  version: number;
  expirationDate: string | null;
  language: string;
  aiModel: string;
  _id: string;
  createdAt: string;
  __v: number;
}
