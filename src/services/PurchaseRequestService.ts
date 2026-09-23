import { FetchFunctionWithPagination, PaginatedResponse } from "@/types/fetch";
import { PurchaseRequest } from "@/types/purchaseRequest";
import api from "@/utils/api";

export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// const get = async (
//   page?: number,
//   limit?: number,
//   keyword?: string,
// ): Promise<{ data: PurchaseRequest[]; pagination: { curr_page: number; total_page: number; limit: number; total: number } }> => {
//   const response = await api.get<ApiResponse<PurchaseRequest[]>>("purchase-requests", {
//     params: { limit, keyword, page, paginate:true },
//   });
//   return {
//     data: response.data.data,
//     pagination: {
//       curr_page: response.data.pagination?.current_page || 1,
//       total_page: response.data.pagination?.last_page || 1,
//       limit: response.data.pagination?.per_page || 10,
//       total: response.data.pagination?.total || 0
//     }
//   };
// };


const get: FetchFunctionWithPagination<PurchaseRequest> = async (
  page = 1,
  limit = 10,
  keyword?: string,
  start_date?: string,
  end_date?: string,
): Promise<PaginatedResponse<PurchaseRequest>> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    page,
    limit,
    paginate: true,
  };

  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;
  if (keyword) params.keyword = keyword;

  const response = await api.get<PaginatedResponse<PurchaseRequest>>("purchase-requests", { params });
  return response.data;
};

const getById = async (id: number) => {
  try {
    const response = await api.get(`purchase-requests/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

interface Form {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const create = async (data: Form) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await api.post<any>("purchase-requests", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const update = async (id: number, data: Form) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await api.put<any>(`purchase-requests/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const PurchaseRequestService = { get, getById, create, update };
export default PurchaseRequestService;