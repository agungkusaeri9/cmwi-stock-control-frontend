import { Area } from "./area";
import { Machine } from "./machine";
import { Maker } from "./maker";
import { Rack } from "./rack";
import { SameKanbanParents } from "./sameKanbanParents";
import { Supplier } from "./supplier";

export type Kanban = {
    id: number;
    code: string;
    balance: number;
    description: string;
    specification: string;
    lead_time: number;
    machine: Machine;
    machine_area: Area;
    max_quantity: number;
    min_quantity: number;
    rack: Rack;
    stock_in_quantity: number;
    js_ending_quantity?: number;
    uom: string;
    maker?: Maker;
    supplier: Supplier;
    stock_status: string;
    order_point: number;                    
    currency: string;
    rank: string;
    created_at: string;
    updated_at: string;
    price: number;
    safety_stock: number;
    is_completed: boolean;
    incoming_order_stock?: number;
    same_kanban_parents?: SameKanbanParents[];
}
