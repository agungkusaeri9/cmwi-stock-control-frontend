import { FetchFunctionWithPagination, PaginatedResponse } from "@/types/fetch";
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
  start_date?: string,
  end_date?: string,
): Promise<PaginatedResponse<PurchaseOrder>> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    page,
    limit,
    paginate: true,
  };

  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;
  if (keyword) params.keyword = keyword;
  const response = await api.get<PaginatedResponse<PurchaseOrder>>("purchase-orders", { params });
  return response.data;
};


const getById = async (
  id:number
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const response = await api.get<PaginatedResponse<PurchaseOrder>>(`purchase-orders/${id}`);
  return response.data;
};

const create = async (data: Form) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await api.post<any>("purchase-orders", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const update = async (id: number, data: Form) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await api.put<any>(`purchase-orders/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const PurchaseOrderService = { get,getById, create, update };
export default PurchaseOrderService;