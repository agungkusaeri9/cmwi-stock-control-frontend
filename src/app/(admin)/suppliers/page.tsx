"use client";
import React, { Suspense } from "react";
import ButtonLink from "@/components/ui/button/ButtonLink";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useFetchData } from "@/hooks/useFetchData";
import { useDeleteData } from "@/hooks/useDeleteData";
import { confirmDelete } from "@/utils/confirm";
import Button from "@/components/ui/button/Button";
import DataTable from "@/components/common/DataTable";
import SupplierService from "@/services/SupplierService";
import { Supplier } from "@/types/supplier";
import Loading from "@/components/common/Loading";

function SupplierList() {
    const {
        data: suppliers,
        isLoading,
        setKeyword,
        setCurrentPage,
        setLimit,
        limit,
        keyword,
        pagination
    } = useFetchData(SupplierService.get, "suppliers");
    const { mutate: remove } = useDeleteData(SupplierService.remove, ["suppliers"]);

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            remove(id);
        }
    };

    const columns = [
        // {
        //     header: "#",
        //     accessorKey: "id",
        //     cell: (item: Supplier) => {
        //        return <div>{item.id}</div>
        //     },
        // },
        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "Action",
            accessorKey: "id",
            cell: (item: Supplier) => (
                <div className="flex items-center gap-2">
                    <ButtonLink
                        href={`/suppliers/${item.id}/edit`}
                        variant='info'
                        size='xs'
                    >
                        Edit
                    </ButtonLink>
                    <Button
                        onClick={() => handleDelete(Number(item.id))}
                        variant='danger'
                        size='xs'
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Suppliers', href: '/suppliers' }]} />
            <div className="space-y-6">
                <div className="flex justify-end mb-4">
                    <ButtonLink size='sm' href="/suppliers/create">Create Supplier</ButtonLink>
                </div>
                <DataTable
                    title="Supplier List"
                    columns={columns}
                    data={suppliers || []}
                    isLoading={isLoading}
                    pagination={{
                        currentPage: pagination?.curr_page || 1,
                        totalPages: pagination?.total_page || 1,
                        totalItems: pagination?.total || 0,
                        itemsPerPage: limit,
                        onPageChange: setCurrentPage,
                        onLimitChange: setLimit,
                    }}
                    search={{
                        value: keyword,
                        onChange: setKeyword,
                        placeholder: "Search suppliers...",
                    }}
                />
            </div>
        </div>
    );
}
export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <SupplierList />
        </Suspense>
    );
}
