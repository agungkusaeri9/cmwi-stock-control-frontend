import { z } from "zod";
const selectOptionSchema = z.object({
    value: z.number(),
    label: z.string()
}).nullable();

export const createKanbanStagingValidator = z.object({
  // kanban_stagging_id: z.number(),
  kanban_id: selectOptionSchema,
});


export const promoteKanbanStagingValidator = z.object({
    // kanban_staging_id: z.number(),
    code: z.string().min(1, "Code is required"),
    description: z.string().min(1, "Description Time is required"),
    specification: z.string().min(1, "Specification Part is required"),
    min_quantity: z.number().min(1, "Min Quantity is required"),
    max_quantity: z.number().min(1, "Max Quantity is required"),
    uom: z.string().min(1, "Uom is required"),
    machine_area_id: selectOptionSchema,
    machine_id: selectOptionSchema,
    rack_id: selectOptionSchema,
    lead_time: z.number().min(1, "Lead Time is required"),
    price: z.number().min(1, "Price is required"),
    safety_stock: z.number().min(0, "Quantity must be at least 0"),
    maker_id: selectOptionSchema,
    order_point: z.number().min(1, "Order Point is required"),
    currency: z.string().min(1, "Currency is required"),
    rank: z.string().max(1, "Rank Must be 1 character"),
    
});