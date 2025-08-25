'use client';

import React, { FormEvent, useState } from 'react';
import * as fabric from 'fabric';
import { DesignObject } from '@/types/designObject';

interface AiBotProps {
    fabricCanvasRef: React.MutableRefObject<fabric.Canvas | null>;
}

const AiBot: React.FC<AiBotProps> = ({ fabricCanvasRef }) => {
    const [prompt, setPrompt] = useState('');

    const handleGenerate = async (prompt: string) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            const data: DesignObject[] = await response.json();
            data.forEach(renderObject);
        } catch (err) {
            console.error(err);
        }
    };

    const renderObject = (obj: DesignObject) => {
        if (!fabricCanvasRef.current) return;
        const canvas = fabricCanvasRef.current;

        const left = obj.left ?? 50;
        const top = obj.top ?? 50;
        const width = obj.width ?? 100;
        const height = obj.height ?? 50;

        switch (obj.type) {
            case 'rect':
                canvas.add(new fabric.Rect({ left, top, width, height, fill: obj.fill || '#f0f4f8', rx: obj.rx || 8, ry: obj.ry || 8 }));
                break;
            case 'circle':
                canvas.add(new fabric.Circle({ left, top, radius: width / 2, fill: obj.fill || '#60a5fa' }));
                break;
            case 'text':
                canvas.add(new fabric.Text(obj.text || '', { left, top, fontSize: obj.fontSize ?? 16, fill: obj.fill || '#333', fontFamily: obj.fontFamily || 'Arial' }));
                break;
            case 'button':
                const rect = new fabric.Rect({ left, top, width, height, fill: obj.fill || '#4CAF50', rx: obj.rx || 8, ry: obj.ry || 8 });
                const text = new fabric.Text(obj.text || 'Button', { left: left + width / 2, top: top + height / 2, fontSize: obj.fontSize ?? 18, fill: obj.textColor || '#fff', originX: 'center', originY: 'center', selectable: false });
                canvas.add(new fabric.Group([rect, text], { left, top }));
                break;
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (prompt.trim()) handleGenerate(prompt.trim());
        setPrompt('');
    };

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-50">
            <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700 p-4 rounded-3xl shadow-2xl flex flex-col items-center gap-4 transition-all duration-300">
                <h2 className="text-gray-300 text-lg sm:text-xl font-semibold -mt-1 text-center">What should I create for you?</h2>

                <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row items-center gap-3">
                    <input
                        name="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. Create a landing page for a coffee shop"
                        className="w-full bg-gray-700 text-gray-200 border border-transparent p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder-gray-400"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-2xl shadow-xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
                    >
                        Generate
                    </button>
                </form>
            </div>
        </div>
    );
};
export default AiBot;
