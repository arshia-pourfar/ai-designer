import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
    return (
        <nav className="bg-white shadow-md p-4 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center space-x-6">
                <h1 className="text-xl font-semibold text-gray-800">File Canvas Editor</h1>
                <Link href="#" className="text-sm text-gray-500 hover:underline">
                    Help
                </Link>
            </div>

            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-6">
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        File
                    </Link>
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        Edit
                    </Link>
                    <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        View
                    </Link>
                </div>

                <button className="bg-blue-600 text-white font-medium py-2 px-5 rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform transform hover:scale-105">
                    Share
                </button>
            </div>
        </nav>
    );
};

export default Navbar;