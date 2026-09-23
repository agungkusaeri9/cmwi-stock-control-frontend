"use client"
import React from "react";
import { CardDashboard } from "@/components/Dashboard/CardDashboard";
import DashboardService from "@/services/DashboardService";
import { useQuery } from "@tanstack/react-query";
import StockInStockOutStatistic from "@/components/Dashboard/StockInStockOutStatistic";
import { ArrowUpIcon, ArrowDownIcon, BalanceIcon, TimeIcon } from "@/icons";

export default function Dashboard() {
    const { data: dashboard } = useQuery({
        queryKey: ["dashboard"],
        queryFn: async () => {
            const response = await DashboardService.getDashboard();
            return response.data;
        },
    });

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                <CardDashboard
                    title="Overstock"
                    value={dashboard?.overStock || 0}
                    icon={<ArrowUpIcon className="w-6 h-6" />}
                    href="/balance?status=Overstock"
                    variant="danger"
                />
                <CardDashboard
                    title="Understock"
                    value={dashboard?.underStock || 0}
                    icon={<ArrowDownIcon className="w-6 h-6" />}
                    href="/balance?status=Understock"
                    variant="warning"
                />
                <CardDashboard
                    title="Unbalanced"
                    value={dashboard?.unBalanced || 0}
                    icon={<BalanceIcon className="w-6 h-6" />}
                    href="/balance?js_balance_status=unbalance"
                    variant="purple"
                />
                <CardDashboard
                    title="Unprocessed"
                    value={dashboard?.unProcessed || 0}
                    icon={<TimeIcon className="w-6 h-6" />}
                    href="/balance?processed_status=unprocessed"
                    variant="info"
                />
            </div>

            <div className="col-span-12">
                <StockInStockOutStatistic data={dashboard} />
            </div>
        </div>
    );
}
