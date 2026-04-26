export interface EnergyCategory {
  id: string;
  title: string;
  groupId: string;
  color: string;
}

export interface EnergyRecord {
  id: string;
  datetime: string;
  value: number;
  percentage: number;
  category: EnergyCategory;
}

export interface EnergyBalanceResponse {
  data: {
    categories: EnergyCategory[];
    groups: EnergyCategory[];
    records: EnergyRecord[];
  };
  count: number;
}
