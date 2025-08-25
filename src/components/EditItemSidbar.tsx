'use client';

import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import * as fabric from "fabric";

interface EditSidebarProps {
    fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
    boardWidth: number;
    boardHeight: number;
    setBoardWidth: (w: number) => void;
    setBoardHeight: (h: number) => void;
}

const EditSidbar: React.FC<EditSidebarProps> = ({
    fabricCanvasRef,
    boardWidth,
    boardHeight,
    setBoardWidth,
    setBoardHeight
}) => {
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
    const [fill, setFill] = useState("#ffffff");
    const [stroke, setStroke] = useState("#000000");
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(50);
    const [fontSize, setFontSize] = useState(16);
    const [opacity, setOpacity] = useState(1);

    // Update selected object
    useEffect(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const updateSelection = () => {
            const obj = canvas.getActiveObject();
            setSelectedObject(obj || null);
            if (obj) {
                if ("fill" in obj) setFill(obj.fill as string || "#ffffff");
                if ("stroke" in obj) setStroke(obj.stroke as string || "#000000");
                setWidth(obj.width ? obj.width * obj.scaleX! : 100);
                setHeight(obj.height ? obj.height * obj.scaleY! : 50);
                if (obj instanceof fabric.Text) setFontSize(obj.fontSize || 16);
                setOpacity(obj.opacity ?? 1);
            }
        };

        canvas.on("selection:created", updateSelection);
        canvas.on("selection:updated", updateSelection);
        canvas.on("selection:cleared", () => setSelectedObject(null));

        return () => {
            canvas.off("selection:created", updateSelection);
            canvas.off("selection:updated", updateSelection);
            canvas.off("selection:cleared", () => setSelectedObject(null));
        };
    }, [fabricCanvasRef]);

    // Update object properties
    useEffect(() => {
        if (!selectedObject) return;
        selectedObject.set({
            fill,
            stroke,
            width: width / (selectedObject.scaleX || 1),
            height: height / (selectedObject.scaleY || 1),
            fontSize: selectedObject instanceof fabric.Text ? fontSize : undefined,
            opacity,
        });
        selectedObject.canvas?.requestRenderAll();
    }, [fill, stroke, width, height, fontSize, opacity, selectedObject]);

    // Update board size
    useEffect(() => {
        if (fabricCanvasRef.current) {
            fabricCanvasRef.current.setWidth(boardWidth);
            fabricCanvasRef.current.setHeight(boardHeight);
            fabricCanvasRef.current.renderAll();
        }
    }, [boardWidth, boardHeight, fabricCanvasRef]);

    if (!selectedObject) {
        return (
            <aside className="bg-gray-800 w-80 p-4 text-gray-200 flex flex-col items-center gap-4">
                <Section title="Board Size">
                    <div className="flex space-x-2">
                        <Input value={boardWidth.toString()} onChange={(v) => setBoardWidth(parseInt(v) || 0)} />
                        <Input value={boardHeight.toString()} onChange={(v) => setBoardHeight(parseInt(v) || 0)} />
                    </div>
                </Section>
                <p className="text-gray-400 text-sm">Select an object to edit</p>
            </aside>
        );
    }

    return (
        <aside className="bg-gray-800 w-80 p-4 text-gray-200 overflow-y-auto flex flex-col gap-4">
            {/* Board Size */}
            <Section title="Board Size">
                <div className="flex space-x-2">
                    <Input value={boardWidth.toString()} onChange={(v) => setBoardWidth(parseInt(v) || 0)} />
                    <Input value={boardHeight.toString()} onChange={(v) => setBoardHeight(parseInt(v) || 0)} />
                </div>
            </Section>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Properties</h3>
                <XMarkIcon className="h-4 w-4 text-gray-400 cursor-pointer" />
            </div>

            {/* Fill Color */}
            <Section title="Fill Color">
                <input
                    type="color"
                    value={fill}
                    onChange={(e) => setFill(e.target.value)}
                    className="w-full h-10 cursor-pointer"
                />
            </Section>

            {/* Stroke Color */}
            <Section title="Stroke Color">
                <input
                    type="color"
                    value={stroke}
                    onChange={(e) => setStroke(e.target.value)}
                    className="w-full h-10 cursor-pointer"
                />
            </Section>

            {/* Dimensions */}
            <Section title="Dimensions">
                <div className="flex space-x-2">
                    <Input value={width.toString()} onChange={(v) => setWidth(parseInt(v) || 0)} />
                    <Input value={height.toString()} onChange={(v) => setHeight(parseInt(v) || 0)} />
                </div>
            </Section>

            {/* Font Size */}
            {selectedObject instanceof fabric.Text && (
                <Section title="Font Size">
                    <Input value={fontSize.toString()} onChange={(v) => setFontSize(parseInt(v) || 0)} />
                </Section>
            )}

            {/* Opacity */}
            <Section title="Opacity">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
            </Section>
        </aside>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-400">{title}</p>
        {children}
    </div>
);

const Input: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => (
    <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xs bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
);

export default EditSidbar;
