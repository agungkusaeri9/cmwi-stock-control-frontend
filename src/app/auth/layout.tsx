import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">

          <div className="lg:w-1/2 w-full h-full bg-[#0A2A6B] lg:grid items-center hidden">

            <div className="relative items-center justify-center flex z-1">
              <div className="flex flex-col items-center max-w-xs">

                <Link href="/" className="block mb-4">
                  <Image
                    width={231}
                    height={48}
                    src="/images/logo/cmwi-logo.png"
                    alt="Logo"
                  />
                </Link>

                <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
                  Stock Control
                </h1>
                <p className="text-sm text-gray-300 mb-6">
                  Manage your inventory with confidence.
                </p>


                <p className="text-center text-gray-300 dark:text-white/60">
                  © 2025 All rights reserved
                </p>
              </div>
            </div>
          </div>

          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>

          {children}
        </div>
      </ThemeProvider>
    </div>
  );
}
