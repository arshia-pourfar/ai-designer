'use client';
import { ChatBubbleLeftRightIcon, CircleStackIcon, CursorArrowRaysIcon, TrashIcon } from "@heroicons/react/24/outline";
import AddTools from "./AddTools";
import { Square2StackIcon } from "@heroicons/react/16/solid";
import * as fabric from 'fabric';

interface AddSidebarProps {
    fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}

const AddSidebar: React.FC<AddSidebarProps> = ({ fabricCanvasRef }) => {
    const addRect = () => {
        if (!fabricCanvasRef.current) return;
        fabricCanvasRef.current.add(
            new fabric.Rect({
                left: 100,
                top: 100,
                width: 120,
                height: 80,
                fill: "#f87171",
                rx: 8,
                ry: 8,
            })
        );
    };

    const addCircle = () => {
        if (!fabricCanvasRef.current) return;
        fabricCanvasRef.current.add(
            new fabric.Circle({
                left: 150,
                top: 150,
                radius: 50,
                fill: "#60a5fa",
            })
        );
    };

    const addText = () => {
        if (!fabricCanvasRef.current) return;
        fabricCanvasRef.current.add(
            new fabric.Textbox("Editable Text", {
                left: 200,
                top: 200,
                fontSize: 20,
                fill: "#fff",
                fontFamily: "Arial",
                editable: true,
            })
        );
    };

    const clearCanvas = () => {
        fabricCanvasRef.current?.clear();
    };

    return (
        <aside className="bg-gray-800 text-gray-200 w-64 p-4 flex flex-col space-y-6 overflow-y-auto">
            <div className="space-y-2">
                <AddTools icon={<CursorArrowRaysIcon className="h-5 w-5 text-white" />} label="Select" onAdd={() => { }} />
                <AddTools icon={<TrashIcon className="h-5 w-5 text-gray-400" />} label="Clear" onAdd={clearCanvas} />
            </div>

            <div className="w-full h-px bg-gray-700" />

            <div className="grid grid-cols-1 gap-2">
                <AddTools onAdd={addRect} icon={<Square2StackIcon className="h-5 w-5 text-gray-400" />} label="Square" />
                <AddTools onAdd={addCircle} icon={<CircleStackIcon className="h-5 w-5 text-gray-400" />} label="Circle" />
                <AddTools onAdd={addText} icon={<ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />} label="Text" />
            </div>
        </aside>
    );
};

export default AddSidebar;