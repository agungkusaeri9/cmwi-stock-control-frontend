
import { FetchFunctionWithPagination, PaginatedResponse } from "@/types/fetch";
import { KanbanStaging } from "@/types/kanbanStaging";
import api from "@/utils/api";

const get: FetchFunctionWithPagination<KanbanStaging> = async (
  page = 1,
  limit = 10,
  keyword = ""
): Promise<PaginatedResponse<KanbanStaging>> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    page,
    limit,
    paginate: true,
  };

  if(keyword) params.keyword = keyword;

  const response = await api.get<PaginatedResponse<KanbanStaging>>("kanban-staggings", {params});
  return response.data;
};

const getById = async (id: number) => {
    try {
        const response = await api.get(`kanban-staggings/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const assign = async (data: {
    kanban_stagging_id: number;
    parent_kanban_code: string;
}) => {
    try {
        const response = await api.post("kanban-staggings/assign-to-parent", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

interface FromData {
    kanban_stagging_id: number;
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


const promote = async (data : FromData) => {
    try {
        const response = await api.post("kanban-staggings/forward-to-master", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};


const KanbanStagingService = {
    get,
    assign,
    promote,
    getById
};

export default KanbanStagingService;