"use client";
import React from "react";
import Link from "next/link";
import { ArrowRightIcon, BoxIconLine } from "@/icons";

export interface CardDashboardProps {
    title: string;
    value?: number;
    icon?: React.ReactNode;
    href?: string;
    variant?: "danger" | "warning" | "purple" | "info" | "default";
}

const variantStyles: Record<
    NonNullable<CardDashboardProps["variant"]>,
    { iconBg: string; iconColor: string; hoverBorder: string }
> = {
    danger: {
        iconBg: "bg-red-50 dark:bg-red-500/10",
        iconColor: "text-red-600 dark:text-red-400",
        hoverBorder: "hover:border-red-300 dark:hover:border-red-800",
    },
    warning: {
        iconBg: "bg-amber-50 dark:bg-amber-500/10",
        iconColor: "text-amber-600 dark:text-amber-400",
        hoverBorder: "hover:border-amber-300 dark:hover:border-amber-800",
    },
    purple: {
        iconBg: "bg-purple-50 dark:bg-purple-500/10",
        iconColor: "text-purple-600 dark:text-purple-400",
        hoverBorder: "hover:border-purple-300 dark:hover:border-purple-800",
    },
    info: {
        iconBg: "bg-blue-50 dark:bg-blue-500/10",
        iconColor: "text-blue-600 dark:text-blue-400",
        hoverBorder: "hover:border-blue-300 dark:hover:border-blue-800",
    },
    default: {
        iconBg: "bg-gray-100 dark:bg-gray-800",
        iconColor: "text-gray-800 dark:text-white/90",
        hoverBorder: "hover:border-brand-500 dark:hover:border-brand-500",
    },
};

export const CardDashboard = ({
    title,
    value,
    icon,
    href,
    variant = "default",
}: CardDashboardProps) => {
    const style = variantStyles[variant] || variantStyles.default;

    const content = (
        <div
            className={`group relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-all duration-200 ${
                href
                    ? `cursor-pointer ${style.hoverBorder} hover:shadow-lg hover:-translate-y-0.5`
                    : ""
            }`}
        >
            <div className="flex items-center justify-between">
                <div
                    className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-200 ${style.iconBg} ${style.iconColor}`}
                >
                    {icon || <BoxIconLine className="w-6 h-6" />}
                </div>
                {href && (
                    <div className="flex items-center justify-center w-7 h-7 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all duration-200 bg-gray-50 dark:bg-gray-800">
                        <ArrowRightIcon className="w-4 h-4" />
                    </div>
                )}
            </div>
            <div className="flex items-end justify-between mt-5">
                <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {title}
                    </span>
                    <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                        {value ?? 0}
                    </h4>
                </div>
            </div>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block">
                {content}
            </Link>
        );
    }

    return content;
};
