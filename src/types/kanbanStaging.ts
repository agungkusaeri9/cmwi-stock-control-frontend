export type KanbanStaging = {
    id: number;
    kanban_code: string;
    description: string;
    incoming_order_stock?: number;
    is_active:boolean;
    createdAt: string;
    updatedAt: string;
}
