import React from "react";

export default function NavTitle({name}: {name: string;}) {
    return (
        <div className="pl-[20px] uppercase text-[9px] font-[500] tracking-[0.5px] text-white opacity-80">
            {name}
        </div>
    );
};