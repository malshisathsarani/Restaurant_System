import { Link, usePage } from "@inertiajs/react";
import NavMulti from "./NavMulti";
import React from "react";
import NavSingle from "./NavSingle";
import NavSeparator from "./NavSeparator";
import NavTitle from "./NavTitle";


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const NavItem = ({
    startWith,
    routeName,
    name,
    link,
    border,
    icon,
    count,
    children,
}: {
    startWith?: string;
    routeName?: any;
    name: any;
    link: boolean;
    border: boolean;
    icon: any;
    count: number;
    children: any;
}) => {
    const { url, component } = usePage();

    function isActive(startWith?: string) {
        if (startWith == "/") {
            return url == startWith;
        } else {
            return url.startsWith(startWith ?? "");
        }
    }

    return (
        <>
            {link ? (
                children?.length > 0 ? (
                    <NavMulti
                        name={name}
                        startWith={startWith}
                        icon={icon}
                        children={children}
                    />
                ) : (
                    <NavSingle
                        name={name}
                        startWith={startWith}
                        routeName={routeName}
                        icon={icon}
                        count={count}
                    />
                )
            ) : border ? (
                <NavSeparator name={name} />
            ) : (
                <NavTitle name={name} />
            )}
        </>
    );
};
export default NavItem;
