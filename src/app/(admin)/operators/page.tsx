"use client";
import React, { Suspense } from "react";
import ButtonLink from "@/components/ui/button/ButtonLink";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useFetchData } from "@/hooks/useFetchData";
import { useDeleteData } from "@/hooks/useDeleteData";
import { confirmDelete } from "@/utils/confirm";
import Button from "@/components/ui/button/Button";
import DataTable from "@/components/common/DataTable";
import OperatorService from "@/services/OperatorService";
import { Operator } from "@/types/operator";
import Loading from "@/components/common/Loading";

function OperatorListContent() {
    const {
        data: operators,
        isLoading,
        setKeyword,
        setCurrentPage,
        setLimit,
        limit,
        keyword,
        pagination
    } = useFetchData(OperatorService.get, "operators");
    const { mutate: remove } = useDeleteData(OperatorService.remove, ["operators"]);

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            remove(id);
        }
    };

    const columns = [
        {
            header: "NIK",
            accessorKey: "nik",
        },
        {
            header: "Username",
            accessorKey: "username",
        },
        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "Action",
            accessorKey: "id",
            cell: (item: Operator) => (
                <div className="flex items-center gap-2">
                    <ButtonLink
                        href={`/operators/${item.id}/edit`}
                        variant='info'
                        size='xs'
                    >
                        Edit
                    </ButtonLink>
                    <Button
                        onClick={() => handleDelete(item.id!)}
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
            <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Operators', href: '/operators' }]} />
            <div className="space-y-6">
                <div className="flex justify-end mb-4">
                    <ButtonLink size='sm' href="/operators/create">Create Operator</ButtonLink>
                </div>
                <DataTable
                    title="Operator List"
                    columns={columns}
                    data={operators || []}
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
                        placeholder: "Search operators...",
                    }}
                />
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <OperatorListContent />
        </Suspense>
    );
}
