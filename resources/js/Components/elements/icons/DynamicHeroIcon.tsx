import * as HeroIcons from '@heroicons/react/24/outline'; // Adjust the import path as necessary
import React from 'react';

interface DynamicHeroIconProps {
    icon: string; // The name of the icon to render
    className?: string; // Optional class for styling
}

const DynamicHeroIcon: React.FC<DynamicHeroIconProps> = ({ icon, className = 'h-6 w-6' }) => {
    const IconComponent = (HeroIcons as any)[icon]; // Dynamically get the icon component

    if (!IconComponent) {
        console.error(`HeroIcon "${icon}" does not exist.`);
        return null;
    }

    return <IconComponent className={className} />;
};

export default DynamicHeroIcon;