"use client"
import React, { Suspense, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PurchaseOrderService from "@/services/PurchaseOrderService";
import ButtonLink from "@/components/ui/button/ButtonLink";
import { useFetchDataPurchaseOrder } from "@/hooks/useFetchDataPO";
import FilterPurchaseOrder from "@/components/pages/purchase-orders/Filter";
import { dateFormat } from "@/utils/dateFormat";
import DataTable from "@/components/common/DataTable";
import { PurchaseOrder } from "@/types/purchaseOrder";
import Loading from "@/components/common/Loading";

function PoList() {
    const [filter, setFilter] = useState({
        start_date: '',
        end_date: '',
        keyword: ''
    });

    const {
        data: purchaseOrders,
        isLoading,
        setCurrentPage,
        setLimit,
        limit,
        pagination
    } = useFetchDataPurchaseOrder(PurchaseOrderService.get, "purchaseOrders", true, filter);

    const columns = [
        {
            header: 'Date',
            accessorKey: 'po_date',
            cell: (item: PurchaseOrder) => dateFormat(item.po_date)
        },
        {
            header: 'PO. Number',
            accessorKey: 'po_number'
        },
        {
            header: 'PO.Date',
            accessorKey: 'po_date',
            cell: (item: PurchaseOrder) => dateFormat(item.po_date)
        },
        {
            header: 'PR. Date',
            accessorKey: 'pr_date',
            cell: (item: PurchaseOrder) => dateFormat(item.pr_date)
        },
        {
            header: 'Supplier',
            accessorKey: 'supplier_name',
            cell: (item: PurchaseOrder) => item.supplier?.name
        },
        {
            header: 'Action',
            accessorKey: 'id',
            cell: (item: PurchaseOrder) => (
                <ButtonLink
                    href={`/purchase-orders/${item.id}`}
                    variant='secondary'
                    size='xs'
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    Show
                </ButtonLink>
            )
        }
    ];

    return (
        <div>
            <PageBreadcrumb pageTitle="Purchase Order" />
            <div className="space-y-6">
                <DataTable
                    title="Purchase Order History"
                    columns={columns}
                    headerRight={<FilterPurchaseOrder filter={filter} setFilter={setFilter} />}
                    data={purchaseOrders || []}
                    isLoading={isLoading}
                    pagination={pagination ? {
                        currentPage: pagination.curr_page,
                        totalPages: pagination.total_page,
                        totalItems: pagination.total,
                        itemsPerPage: limit,
                        onPageChange: setCurrentPage,
                        onLimitChange: setLimit
                    } : undefined}
                />
            </div>
        </div>
    );
}
export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <PoList />
        </Suspense>
    );
}
