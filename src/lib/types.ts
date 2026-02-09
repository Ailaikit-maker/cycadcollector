export interface Collector {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
}

export interface CycadItem {
  id: string;
  collectorId: string;
  species: string;
  description: string;
  age?: string;
  height?: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  dateAdded: string;
}
