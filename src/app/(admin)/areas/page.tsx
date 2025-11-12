"use client";
import React, { Suspense } from "react";
import ButtonLink from "@/components/ui/button/ButtonLink";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useFetchData } from "@/hooks/useFetchData";
import { useDeleteData } from "@/hooks/useDeleteData";
import { confirmDelete } from "@/utils/confirm";
import Button from "@/components/ui/button/Button";
import { Area } from "@/types/area";
import DataTable from "@/components/common/DataTable";
import AreaService from "@/services/AreaService";
import Loading from "@/components/common/Loading";

function AreaListPage() {
    const {
        data: areas,
        isLoading,
        setKeyword,
        setCurrentPage,
        setLimit,
        limit,
        keyword,
        pagination
    } = useFetchData(AreaService.get, "areas");
    const { mutate: remove } = useDeleteData(AreaService.remove, ["areas"]);

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
        //     cell: (item: Area) => {
        //         const index = areas?.findIndex((area: Area) => area.id === item.id) ?? 0;
        //         return index + 1;
        //     },
        // },
        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "Action",
            accessorKey: "id",
            cell: (item: Area) => (
                <div className="flex items-center gap-2">
                    <ButtonLink
                        href={`/areas/${item.id}/edit`}
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
            <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Areas', href: '/areas' }]} />
            <div className="space-y-6">
                <div className="flex justify-end mb-4">
                    <ButtonLink size='sm' href="/areas/create">Create Area</ButtonLink>
                </div>
                <DataTable
                    title="Area List"
                    columns={columns}
                    data={areas || []}
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
                        placeholder: "Search areas...",
                    }}
                />
            </div>
        </div>
    );
}
export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <AreaListPage />
        </Suspense>
    );
}
