'use client';

import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";

interface CanvasEditorProps {
    fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
    boardWidth: number;
    boardHeight: number;
    setBoardWidth: (w: number) => void;
    setBoardHeight: (h: number) => void;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
    fabricCanvasRef,
    boardWidth,
    boardHeight,
    setBoardWidth,
    setBoardHeight
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const boardRectRef = useRef<fabric.Rect | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            preserveObjectStacking: true,
            backgroundColor: "#eee"
        });

        fabricCanvasRef.current = canvas;

        // ایجاد مستطیل کنترل بورد
        const boardRect = new fabric.Rect({
            left: 0,
            top: 0,
            width: boardWidth,
            height: boardHeight,
            fill: "transparent",
            stroke: "#333",
            strokeWidth: 2,
            selectable: true,
            hasControls: true,
            lockRotation: true,
            objectCaching: false
        });

        canvas.add(boardRect);
        canvas.setActiveObject(boardRect);
        boardRectRef.current = boardRect;

        // هنگام تغییر اندازه مستطیل، اندازه بورد واقعی را آپدیت کن
        boardRect.on("scaling", () => {
            if (!boardRectRef.current) return;
            const rect = boardRectRef.current;
            const newWidth = rect.width! * rect.scaleX!;
            const newHeight = rect.height! * rect.scaleY!;
            setBoardWidth(newWidth);
            setBoardHeight(newHeight);
            rect.set({
                width: newWidth,
                height: newHeight,
                scaleX: 1,
                scaleY: 1
            });
            canvas.renderAll();
        });

        canvas.on('object:moving', (e) => {
            const target = e.target;
            if (target) target.setCoords();
        });

        return () => {
            canvas.dispose();
        };
    }, []);

    // Update canvas size when boardWidth/Height change externally
    useEffect(() => {
        if (!fabricCanvasRef.current || !boardRectRef.current) return;
        const canvas = fabricCanvasRef.current;
        const rect = boardRectRef.current;

        rect.set({
            width: boardWidth,
            height: boardHeight
        });
        canvas.renderAll();
    }, [boardWidth, boardHeight]);

    return (
        <div className="flex flex-col items-center gap-4">
            <canvas
                ref={canvasRef}
                width={Math.max(boardWidth + 50, 800)}
                height={Math.max(boardHeight + 50, 600)}
                className="border shadow-md"
            />
        </div>
    );
};

export default CanvasEditor;
