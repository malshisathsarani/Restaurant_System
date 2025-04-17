import React from "react";

export default function NavSeparator({ name }: { name: any }){
    return (
        <div className={" mt-4 border-t border-white border-opacity-30 pt-[5px] pl-[20px]"}>
            <span className="uppercase text-[9px] font-[500] tracking-[0.5px] text-white opacity-80">
                {name}
            </span>
        </div>
    );
};