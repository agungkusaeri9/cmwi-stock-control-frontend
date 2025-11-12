import { FetchFunctionWithPagination, PaginatedResponse } from "@/types/fetch";
import { ManualPurchaseOrder } from "@/types/manualPurchaseOrder";
import { PurchaseOrder } from "@/types/purchaseOrder";
import api from "@/utils/api";

export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

interface Form {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const get: FetchFunctionWithPagination<PurchaseOrder> = async (
  page = 1,
  limit = 10,
  keyword?: string,
  pr_number?: string,
  po_number?: string,
  start_date?: string,
  end_date?: string,
  kanban?: string
): Promise<PaginatedResponse<PurchaseOrder>> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    page,
    limit,
    paginate: true,
  };
  

  if (start_date)  params.start_date = start_date;
  if (pr_number)  params.pr_number = pr_number;
  if (po_number)  params.po_number = po_number;
  if (end_date) params.end_date = end_date;
  if (kanban) params.kanban = kanban;
  if (keyword) params.keyword = keyword;
  const response = await api.get<PaginatedResponse<PurchaseOrder>>("manual-purchase-orders", { params });
  return response.data;
};


const getById = async (
  id:number
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const response = await api.get<PaginatedResponse<ManualPurchaseOrder>>(`manual-purchase-orders/${id}`);
  return response.data;
};

const create = async (data: Form) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await api.post<any>("manual-purchase-orders", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


const ManualPurchaseOrderService = { get,getById, create };
export default ManualPurchaseOrderService;