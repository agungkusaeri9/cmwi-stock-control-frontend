import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { PaginatedResponse } from "@/types/fetch";
import { useDebounce } from "./useDebounce";

type Filter = {
    machine_id: number | null;
    machine_area_id: number | null;
    rack_id: number | null;
    keyword: string;
    status: string | null;
    completed_status?: string | null;
    js_balance_status: string;
    processed_status?: string | null;
};

export type FetchFunctionWithPagination<T> = (
    page?: number,
    limit?: number,
    keyword?: string,
    machine_id?: number | null,
    machine_area_id?: number | null,
    rack_id?: number | null,
    status?: string | null,
    completed_status?: string | null,
    js_balance_status?: string,
    processed_status?: string | null
) => Promise<PaginatedResponse<T>>;

export const useFetchDataBalance = <T>(
    fetchFunction: FetchFunctionWithPagination<T>,
    queryKey: string,
    usePagination: boolean = true,
    filter: Filter
) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(
        usePagination ? Number(searchParams.get("page")) || 1 : 1
    );
    const [limit, setLimit] = useState(
        usePagination ? Number(searchParams.get("limit")) || 10 : 50
    );
    const [pagination, setPagination] = useState<PaginatedResponse<T>["pagination"] | null>(null);

    // 🔑 debounce keyword dari filter
    const debouncedSearch = useDebounce(filter.keyword, 500);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const tableElement = document.querySelector(".overflow-x-auto");
        if (tableElement) {
            tableElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    useEffect(() => {
        if (!usePagination) return;

        const newParams = new URLSearchParams(searchParams.toString());

        newParams.set("limit", limit.toString());
        newParams.set("page", currentPage.toString());

        if (filter.keyword) newParams.set("keyword", filter.keyword);
        else newParams.delete("keyword");

        if (filter.machine_id) newParams.set("machine_id", filter.machine_id.toString());
        else newParams.delete("machine_id");

        if (filter.machine_area_id) newParams.set("machine_area_id", filter.machine_area_id.toString());
        else newParams.delete("machine_area_id");

        if (filter.rack_id) newParams.set("rack_id", filter.rack_id.toString());
        else newParams.delete("rack_id");

        if (filter.status) newParams.set("status", filter.status);
        else newParams.delete("status");

        if (filter.js_balance_status) newParams.set("js_balance_status", filter.js_balance_status);
        else newParams.delete("js_balance_status");

        if (filter.processed_status) newParams.set("processed_status", filter.processed_status);
        else newParams.delete("processed_status");

        router.push(`?${newParams.toString()}`, { scroll: false });
    }, [filter, currentPage, limit, usePagination, router, searchParams]);

    const fetchData = async (): Promise<T[]> => {
        const res = await fetchFunction(
            currentPage,
            limit,
            debouncedSearch, // pake debounce di sini
            filter.machine_id,
            filter.machine_area_id,
            filter.rack_id,
            filter.status,
            filter.completed_status ?? null,
            filter.js_balance_status,
            filter.processed_status ?? null
        );
        setPagination(res.pagination);
        return res.data;
    };

    const { data, isLoading, refetch } = useQuery<T[]>({
        queryKey: usePagination
            ? [
                  queryKey,
                  currentPage,
                  limit,
                  debouncedSearch,
                  filter.machine_id,
                  filter.machine_area_id,
                  filter.rack_id,
                  filter.status,
                  filter.completed_status ?? null,
                  filter.js_balance_status,
                  filter.processed_status ?? null,
              ]
            : [queryKey],
        queryFn: fetchData,
    });

    return {
        data,
        isLoading,
        pagination,
        currentPage,
        limit,
        keyword: filter.keyword,
        setCurrentPage: handlePageChange,
        setLimit,
        refetch,
        fetchData,
    };
};
