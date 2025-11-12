"use client";
import React, { Suspense, useEffect } from "react";
import ButtonLink from "@/components/ui/button/ButtonLink";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useDeleteData } from "@/hooks/useDeleteData";
import { confirmDelete } from "@/utils/confirm";
import Button from "@/components/ui/button/Button";
import DataTable from "@/components/common/DataTable";
import Loading from "@/components/common/Loading";
import { useRouter, useSearchParams } from "next/navigation";
import SubMachineService from "@/services/SubMachineService";
import { useFetchDataSubMachine } from "@/hooks/useFetchDataSubMachine";
import { SubMachine } from "@/types/subMachine";
import { useFetchById } from "@/hooks/useFetchDetailData";
import MachineService from "@/services/MachineService";

function SubMachineList() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const machineId = Number(searchParams.get("machineId"));
    const { data: machine, isLoading: isMachineLoading } = useFetchById(
        MachineService.getById,
        machineId,
        "machine"
    );

    const {
        data: subMachines,
        isLoading,
        setKeyword,
        setCurrentPage,
        setLimit,
        limit,
        keyword,
        pagination
    } = useFetchDataSubMachine(SubMachineService.get, "subMachines");

    useEffect(() => {

        if (!machineId || Number.isNaN(machineId)) {
            router.push("/machines");
        }
        if (!isMachineLoading && !machine) {
            router.push("/machines");
        }
        // if (machine) {
        //     setMachineId(machineId);
        // }
    }, [machineId, machine, isMachineLoading, router]);

    const { mutate: remove } = useDeleteData(SubMachineService.remove, ["subMachines"]);

    const handleDelete = async (id: number) => {
        const confirmed = await confirmDelete();
        if (confirmed) {
            remove(id);
        }
    };

    if (isMachineLoading) {
        return (
            <div>
                <Loading />
            </div>
        );
    }

    const columns = [
        // {
        //     header: "#",
        //     accessorKey: "id",
        //     cell: (item: Machine) => {
        //         const index = machines?.findIndex((machine: Machine) => machine.id === item.id) ?? 0;
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
            cell: (item: SubMachine) => (
                <div className="flex items-center gap-2">
                    <ButtonLink
                        href={`/sub-machines/${item.id}/edit`}
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
            <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Machines', href: '/machines' }, { label: 'Sub Machines', href: '/sub-machines' }]} />
            <div className="space-y-6">
                <div className="flex justify-end mb-4">
                    <ButtonLink size='sm' href={`/sub-machines/create?machineId=${machineId}`}>Create Sub Machine</ButtonLink>
                </div>
                <DataTable
                    title="Sub Machine List"
                    columns={columns}
                    data={subMachines || []}
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
                        placeholder: "Search sub machines...",
                    }}
                />
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <SubMachineList />
        </Suspense>
    );
}
