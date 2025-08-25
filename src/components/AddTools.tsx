'use client';

import React from 'react';

// ------------------- AddTools Component -------------------
interface AddToolsProps {
    icon: React.ReactNode;
    label: string;
    onAdd: () => void;
}

const AddTools: React.FC<AddToolsProps> = ({ icon, label, onAdd }) => {
    return (
        <button
            onClick={onAdd}
            className="p-2 bg-gray-900 rounded-md cursor-pointer flex items-center space-x-2 hover:bg-gray-700 transition-colors w-full text-left"
        >
            {icon}
            <span className="text-sm">{label}</span>
        </button>
    );
};
export default AddTools;