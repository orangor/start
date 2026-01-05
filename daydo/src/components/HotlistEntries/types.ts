import type { HotlistEntry, HotlistEntryListParams } from '../../api';

export interface PlatformOption {
  label: string;
  value: string;
}

export interface TablePagination {
  current: number;
  pageSize: number;
  total: number;
}

export interface HotlistEntriesSearchProps {
  platformOptions: PlatformOption[];
  onSearch: (params: HotlistEntryListParams) => void;
  onReset: () => void;
  onAdd: () => void;
}

export interface HotlistEntriesTableProps {
  data: HotlistEntry[];
  loading: boolean;
  pagination: TablePagination;
  onChange: (newPagination: any, filters: any, sorter: any) => void;
  onEdit: (record: HotlistEntry) => void;
  onDelete: (id: number) => void;
}

export interface HotlistEntriesFormProps {
  visible: boolean;
  record: HotlistEntry | null;
  platformOptions: PlatformOption[];
  onSubmit: (values: any) => void;
  onCancel: () => void;
}