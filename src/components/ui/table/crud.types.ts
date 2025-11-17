// components/crud/types/crud.types.ts
export interface CrudColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'badge' | 'custom';
  width?: string;
  formatter?: (value: any) => string;
}

export interface CrudAction {
  name: string;
  icon: string;
  color: string;
  condition?: (item: any) => boolean;
  handler: (item: any) => void;
}

export interface CrudConfig {
  title: string;
  description: string;
  columns: CrudColumn[];
  actions: CrudAction[];
  filters?: any[];
  formFields?: any[];
}

export interface CrudProps {
  config: CrudConfig;
  data: any[];
  loading: boolean;
  store: any; // Pinia store
}