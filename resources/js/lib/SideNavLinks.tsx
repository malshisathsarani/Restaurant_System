import NavItem from '@/Components/AdminSidebar/partials/NavItem';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { usePage } from '@inertiajs/react';
import React from 'react';

const SideNavLinks: React.FC = () => {
    const { openTicketCount }: any = usePage().props;

    // Add icons that better represent each section
    const navigationLinks = [
        {
            name: "Business",
            link: true,
            border: false,
            startWith: "/dashboard/business",
            route: "dashboard.business",
            icon: "BuildingOffice2Icon", // Better icon for business
            count: 0,
        },
        {
            name: "Collections",
            link: true,
            border: false,
            startWith: "/dashboard/collection",
            route: "dashboard.collection",
            icon: "FolderIcon", // Better icon for collections
            count: 0,
        },
        {
            name: "Items",
            link: true,
            border: false,
            startWith: "/dashboard/item",
            route: "dashboard.item",
            icon: "ShoppingBagIcon", // Better icon for items
            count: 0,
        },
        {
            name: "Users",
            link: true,
            border: false,
            startWith: "/dashboard/users",
            route: "dashboard.users",
            icon: "UserGroupIcon", // Already has a good icon
            count: 0,
        },
    ];

    return (
        // Using rounded-b-lg to only round bottom corners
        <div className="h-full min-h-screen space-y-1 px-2 bg-[#2563eb] py-2 rounded-b-lg">
            {/* Logo at the top */}
            <div className="flex justify-center items-center pt-6 pb-4">
                <ApplicationLogo className="w-20 h-20 fill-white" />
            </div>
            
            {/* Divider under logo */}
            <div className="border-b border-white border-opacity-20 mb-4"></div>



            {navigationLinks.map((item: any, index: number) => (
                <NavItem
                    key={item.name + index}
                    name={item.name}
                    routeName={route(item.route)}
                    startWith={item.startWith}
                    icon={item.icon}
                    link={item.link}
                    count={item.count}
                    border={item.border}
                    children={item.children}
                />
            ))}
        </div>
    );
};

export default SideNavLinks;