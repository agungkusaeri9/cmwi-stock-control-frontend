"use client";
import React, { Suspense } from "react";
import ButtonLink from "@/components/ui/button/ButtonLink";
import Breadcrumb from "@/components/common/Breadcrumb";
import RackService from "@/services/RackService";
import { useFetchData } from "@/hooks/useFetchData";
import { useDeleteData } from "@/hooks/useDeleteData";
import { confirmDelete } from "@/utils/confirm";
import Button from "@/components/ui/button/Button";
import { Rack } from "@/types/rack";
import DataTable from "@/components/common/DataTable";
import Loading from "@/components/common/Loading";

function RackListPage() {
    const {
        data: racks,
        isLoading,
        setKeyword,
        setCurrentPage,
        setLimit,
        limit,
        keyword,
        pagination
    } = useFetchData(RackService.get, "racks");
    const { mutate: remove } = useDeleteData(RackService.remove, ["racks"]);

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
        //     cell: (item: Rack) => {
        //         const index = racks?.findIndex((rack: Rack) => rack.id === item.id) ?? 0;
        //         return index + 1;
        //     },
        // },
        {
            header: "Code",
            accessorKey: "code",
            isNoWrap: true
        },
        {
            header: "Action",
            accessorKey: "id",
            cell: (item: Rack) => (
                <div className="flex items-center gap-2">
                    <ButtonLink
                        href={`/racks/${item.id}/edit`}
                        variant='info'
                        size='xs'
                    >
                        Edit
                    </ButtonLink>
                    <Button
                        onClick={() => handleDelete(item.id)}
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
            <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Racks', href: '/racks' }]} />
            <div className="space-y-6">
                <div className="flex justify-end mb-4">
                    <ButtonLink size='sm' href="/racks/create">Create Rack</ButtonLink>
                </div>
                <DataTable
                    title="Rack List"
                    columns={columns}
                    data={racks || []}
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
                        placeholder: "Search racks...",
                    }}
                />
            </div>
        </div>
    );
}
export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <RackListPage />
        </Suspense>
    );
}
