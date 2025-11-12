import { ApiResponse } from "@/types/api";
import { FetchFunctionWithPagination, PaginatedResponse } from "@/types/fetch";
import { Kanban } from "@/types/kanban";
import api from "@/utils/api";

interface FromData {
    code: string;
    balance?: number | null;
    description: string;
    specification: string;
    lead_time: number;
    machine_id: number | null;
    machine_area_id: number | null;
    max_quantity: number;
    min_quantity: number;
    rack_id: number | null;
    uom: string;
    maker_id: number | null;
    order_point: number;
    currency: string;
    rank: string;
}


type FilterExportBalance = {
  machine_id: number | null;
  machine_area_id: number | null;
  rack_id: number | null;
  keyword: string;
  status: string | null;
  js_balance_status: string;
};

const get: FetchFunctionWithPagination<Kanban> = async (
  page = 1,
  limit = 10,
  keyword = "",
  machine_id = null,
  machine_area_id = null,
  rack_id = null,
  status = null,
  completed_status = null,
  js_balance_status = null
): Promise<PaginatedResponse<Kanban>> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    page,
    limit,
    paginate: true,
  };

  if(machine_id) params.machine_id = machine_id;
  if(machine_area_id) params.machine_area_id = machine_area_id;
  if(rack_id) params.rack_id = rack_id;
  if(keyword) params.keyword = keyword;
  if(status) params.stock_status = status;
  if(completed_status) params.completed_status = completed_status ;
  if(js_balance_status) params.js_balance_status = js_balance_status ;

  const response = await api.get<PaginatedResponse<Kanban>>("kanbans", {params});
  return response.data;
};

const getTrash: FetchFunctionWithPagination<Kanban> = async (
  page = 1,
  limit = 10,
  keyword = ""
): Promise<PaginatedResponse<Kanban>> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    page,
    limit,
    paginate: true,
    is_deleted: true
  };

  if(keyword) params.keyword = keyword;
  const response = await api.get<PaginatedResponse<Kanban>>("kanbans", {params});
  return response.data;
};

const getWithoutPagination = async (
  keyword?: string,
): Promise<ApiResponse<Kanban[]>> => {
  const response = await api.get<ApiResponse<Kanban[]>>("kanbans", {
    params: { keyword},
  });
  return response.data;
  
};

const create = async (data: FromData) => {
    try {
        data.balance =  0;
        const response = await api.post("kanbans", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getById =  async (id: number) => {
    try {
        const response = await api.get(`kanbans/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const update = async (id: number, data: FromData) => {
    try {
        const responseKanban = await getById(id);
        data.balance = responseKanban.data.balance;
        const response = await api.put(`kanbans/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const remove = async (id: number) => {
    try {
        const response = await api.delete(`kanbans/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const exportUncompleted = async () => {
    const response = await api.get("kanbans/export/excel",{
            params: {
                completed_status: "uncompleted"
            },
            responseType: 'blob'
        }, 
    );
    return response.data;
};

const exportCompleted = async () => {
   const response = await api.get("kanbans/export/excel",{
            params: {
                completed_status: "completed"
            },
            responseType: 'blob'
        }, 
    );
    return response.data;
};

const exportAll = async () => {
   const response = await api.get("kanbans/export/excel",{
            params: {
                completed_status: "all"
            },
            responseType: 'blob'
        }, 
    );
    return response.data;
};



const exportBalance = async ({filter} : {filter: FilterExportBalance}) => {
    const {
      machine_id,
      machine_area_id,
      rack_id,
      keyword,
      status,
      js_balance_status,
    } = filter;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {};

    if (machine_id) params.machine_id = machine_id;
    if (machine_area_id) params.machine_area_id = machine_area_id;
    if (rack_id) params.rack_id = rack_id;
    if (keyword) params.keyword = keyword;
    if (status) params.stock_status = status;
    if (js_balance_status) params.js_balance_status = js_balance_status;


    const response = await api.get("/kanbans/export/excel/balance",{
                params,
                responseType: 'blob'
            }, 
        );
    return response.data;
};


const getUncompletedCount = async () => {
    const response = await api.get("kanbans",{
        params: {
            page: 1,
            limit: 10,
            paginate: true,
            completed_status: "Uncompleted"
        }
    });
    
    return response.data;
};

const restore = async (id: number) => {
    try {
        const response = await api.patch(`kanbans/${id}/restore`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


const KanbanService = {
    get,
    getWithoutPagination,
    create,
    getById,
    update,
    remove,
    exportUncompleted,
    getUncompletedCount,
    exportCompleted,
    exportAll,
    exportBalance,
    getTrash,
    restore
};

export default KanbanService;