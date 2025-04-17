import DynamicHeroIcon from "@/Components/elements/icons/DynamicHeroIcon";
import { Link, usePage } from "@inertiajs/react";
import React from "react";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function NavSingle({
    startWith,
    routeName,
    name,
    icon,
    count,
}: {
    startWith?: string;
    routeName?: any;
    name: any;
    icon: any;
    count: any;
}) {
    const { url } = usePage();

    function isActive(startWith?: string) {
        if (startWith == "/") {
            return url == startWith;
        } else {
            return url.startsWith(startWith ?? "");
        }
    }

    return (
        <div className="py-1">
            <Link
                href={routeName}
                className={classNames(
                    isActive(startWith)
                        ? "bg-blue-700 text-white font-semibold shadow-inner"
                        : "text-white hover:bg-blue-700 hover:shadow-sm",
                    "group mt-0 flex p-3 rounded-lg items-center text-sm font-medium duration-300 ease-in-out transition-all w-full"
                )}
                aria-current={isActive(startWith) ? "page" : undefined}
            >
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                        <DynamicHeroIcon
                            icon={icon}
                            className={classNames(
                                isActive(startWith)
                                    ? "text-white"
                                    : "text-white group-hover:text-white duration-300 ease-in-out transition-all",
                                "mr-4 h-4 w-4 flex-shrink-0"
                            )}
                            aria-hidden="true"
                        />
                        <span className="text">{name}</span>
                    </div>
                    {count > 0 && (
                        <div className="flex items-center justify-center w-5 h-5 text-xs text-blue-800 bg-white rounded-full P-4 font-bold">
                            {count}
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
}