import NavItem from '@/Components/AdminSidebar/partials/NavItem';
import { usePage } from '@inertiajs/react';
import React from 'react';  // Import React

const SideNavLinks: React.FC = () => {
    const { openTicketCount }: any = usePage().props;

const navigationLinks = [
    {
        name: "Business",
        link: true,
        border: false,
        startWith: "/dashboard/business",
        route: "dashboard.business",
        icon: "BriefcaseIcon", // Replace with the appropriate Heroicon name
        count: 0,
    },
    {
        name: "Collections",
        link: true,
        border: false,
        startWith: "/dashboard/collection",
        route: "dashboard.collection",
        icon: "BriefcaseIcon", // Replace with the appropriate Heroicon name
        count: 0,
    },
    {
        name: "Items",
        link: true,
        border: false,
        startWith: "/dashboard/item",
        route: "dashboard.item",
        icon: "BriefcaseIcon", // Replace with the appropriate Heroicon name
        count: 0,
    },
    {
        name: "Users",
        link: true,
        border: false,
        startWith: "/dashboard/users",
        route: "dashboard.users",
        icon: "UserGroupIcon", // Using UserGroupIcon for users
        count: 0,
    },
    

];
return (
    <div>
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
