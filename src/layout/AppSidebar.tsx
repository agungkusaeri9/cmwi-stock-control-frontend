"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BalanceIcon,
  ChevronDownIcon,
  DatabaseIcon,
  GridIcon,
  HistoryIcon,
  HorizontaLDots,
  PurchaseOrderIcon,
  PurchaseRequestIcon,
  ReminderIcon,
  TrashIcon
} from "../icons/index";
import { getCookie } from "cookies-next";
import { useQuery } from "@tanstack/react-query";
import ReminderService from "@/services/ReminderService";
import KanbanService from "@/services/KanbanService";
import KanbanStagingService from "@/services/KanbanStagingService";
import { KanbanIcon } from "lucide-react";
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  count?: number;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    count?: number;
  }[];
  roles?: string[];
  requiresAuth?: boolean;
};



const othersItems: NavItem[] = [
  // {
  //   icon: <BoxCubeIcon />,
  //   name: "Master Data",
  //   subItems: [
  //     { name: "Users", path: "/users", pro: false }
  //   ],
  // }
];
// const role = typeof window !== "undefined" ? localStorage.getItem("role") : "guest";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuKanbanCount, setMenuKanbanCount] = useState(0);
  const { data: remindersCount } = useQuery({
    queryKey: ["reminders-count"],
    queryFn: ReminderService.getCount,
    staleTime: 240000,
    gcTime: 360000,
    refetchInterval: 300000,
  });
  const { data: uncompletedKanbansCount } = useQuery({
    queryKey: ["uncompleted-kanbans-count"],
    queryFn: async () => {
      const response = await KanbanService.getUncompletedCount();
      const total = response.pagination.total;
      return total;
    },
    staleTime: 240000,
    gcTime: 360000,
    refetchInterval: 300000,
  });

  const { data: kanbanStagingCount } = useQuery({
    queryKey: ["kanban-staging-count"],
    queryFn: async () => {
      const response = await KanbanStagingService.get();
      const total = response.pagination.total;
      return total;
    },
    staleTime: 240000,
    gcTime: 360000,
    refetchInterval: 300000,
  });

  useEffect(() => {
    setMenuKanbanCount(uncompletedKanbansCount + kanbanStagingCount);
  }, [uncompletedKanbansCount, kanbanStagingCount]);


  const navItems: NavItem[] = [
    {
      icon: <GridIcon />,
      name: "Dashboard",
      path: "/dashboard",
      requiresAuth: false
    },
    {
      icon: <BalanceIcon />,
      name: "Balance",
      path: "/balance",
      requiresAuth: false
    },
    {
      icon: <PurchaseOrderIcon />,
      name: "Purchase Order",
      subItems: [
        { name: "All PO", path: "/purchase-orders", pro: false },
        { name: "Manual PO", path: "/manual-purchase-orders", pro: false },
      ],
      requiresAuth: true
    },
    // {
    //   icon: <PurchaseOrderIcon />,
    //   name: "Purchase Order",
    //   path: "/purchase-orders",
    //   requiresAuth: false
    // },
    {
      icon: <PurchaseRequestIcon />,
      name: "Purchase Request",
      path: "/purchase-requests",
      requiresAuth: false
    },
    {
      icon: <HistoryIcon />,
      name: "Stock",
      subItems: [
        { name: "In", path: "/stock-ins", pro: false },
        { name: "Out", path: "/stock-outs", pro: false }
      ],
      requiresAuth: false
    },
    {
      icon: <KanbanIcon />,
      name: "Kanban",
      subItems: [
        { name: "Kanban", path: "/kanbans", pro: false, count: (uncompletedKanbansCount ?? 0) > 0 ? uncompletedKanbansCount : undefined },
        {
          name: "Kanban Staging", path: "/kanban-stagings", pro: false, count: (kanbanStagingCount ?? 0) > 0 ? kanbanStagingCount : undefined,
        },
      ],
      count: menuKanbanCount > 0 ? menuKanbanCount : undefined,
      requiresAuth: true
    },
    {
      icon: <DatabaseIcon />,
      name: "Master Data",
      subItems: [
        { name: "Operator", path: "/operators", pro: false },
        { name: "Area", path: "/areas", pro: false },
        { name: "Machine", path: "/machines", pro: false },
        { name: "Rack", path: "/racks", pro: false },
        { name: "Makers", path: "/makers", pro: false },
        { name: "Suppliers", path: "/suppliers", pro: false },
        { name: "Group", path: "/groups", pro: false },
        { name: "Requester", path: "/requesters", pro: false },

      ],
      requiresAuth: true
    },
    {
      icon: <TrashIcon />,
      name: "Trash",
      subItems: [
        { name: "Kanban", path: "/trash/kanbans", pro: false },

      ],
      requiresAuth: true
    },
    {
      icon: <ReminderIcon />,
      name: "Reminder",
      path: "/reminder",
      count: remindersCount,
      requiresAuth: false
    },
  ];

  useEffect(() => {
    const token = getCookie('token');
    setIsAuthenticated(!!token);
  }, [navItems]);


  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems?.map((nav, index) => {
        if (nav.requiresAuth && !isAuthenticated) {
          return null;
        }

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
                  } cursor-pointer ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                  }`}
              >
                <span
                  className={` ${openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className={`menu-item-text`}>{nav.name}</span>
                    {nav.count && nav.count > 0 && (
                      <div className="bg-red-500 px-2 relative rounded-sm h-5 flex items-center justify-center animate-blink">
                        <span className="menu-item-text text-[11px] text-white">
                          {nav.count}
                        </span>
                      </div>
                    )}
                  </>)}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                      }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                    }`}
                >
                  <span
                    className={`${isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                      }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <>
                      <span className={`menu-item-text`}>{nav.name}</span>
                      {nav.count && nav.count > 0 && (
                        <div className="bg-red-500 px-2 relative rounded-sm h-5 flex items-center justify-center animate-blink">
                          <span className="menu-item-text text-[11px] text-white">
                            {nav.count}
                          </span>
                        </div>
                      )}

                    </>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? `${subMenuHeight[`${menuType}-${index}`]}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`menu-dropdown-item ${isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                          }`}
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.count && subItem.count > 0 && (
                            <div className="bg-red-500 px-2 relative rounded-sm h-5 flex items-center justify-center animate-blink">
                              <span className="menu-item-text text-[11px] text-white">
                                {subItem.count}
                              </span>
                            </div>
                          )}
                          {subItem.new && (
                            <span
                              className={`ml-auto ${isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge `}
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={`ml-auto ${isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge `}
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 bg-white 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-center"
          }`}
      >
        <Link href="/dashboard">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex flex-col align-center items-center" >
              <Image
                className="dark:hidden"
                src="/images/logo/cmwi-logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/cmwi-logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <h2 className="text-gray-700 uppercase font-semibold text-sm ml-2">
                Stock Control System
              </h2>
            </div>
          ) : (
            <Image
              src="/images/logo/cmwi-logo.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar ">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  ""
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            {/* <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div> */}
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
