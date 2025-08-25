'use client';

import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

interface CanvasEditorProps {
    fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
    boardWidth: number;
    boardHeight: number;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ fabricCanvasRef, boardWidth, boardHeight }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: boardWidth,
            height: boardHeight,
            preserveObjectStacking: true,
            backgroundColor: '#fff',
        });

        fabricCanvasRef.current = canvas;

        canvas.on('object:moving', (e) => {
            const target = e.target;
            if (target) target.setCoords();
        });

        return () => {
            canvas.dispose();
        };
    }, [fabricCanvasRef]);

    // وقتی اندازه بورد تغییر کنه، Canvas آپدیت بشه
    useEffect(() => {
        if (fabricCanvasRef.current) {
            fabricCanvasRef.current.setWidth(boardWidth);
            fabricCanvasRef.current.setHeight(boardHeight);
            fabricCanvasRef.current.renderAll();
        }
    }, [boardWidth, boardHeight]);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="border shadow-md" style={{ width: boardWidth, height: boardHeight }}>
                <canvas ref={canvasRef} width={boardWidth} height={boardHeight} />
            </div>
        </div>
    );
};

export default CanvasEditor;
