'use client';

import AddSidebar from "@/components/AddItemSidbar";
import AiBot from "@/components/AiBot";
import CanvasEditor from "@/components/CanvasEditor";
import EditSidbar from "@/components/EditItemSidbar";
import Navbar from "@/components/Navbar";
import { useRef, useState } from "react";
import { Canvas } from "fabric";

export default function Home() {
  const fabricCanvasRef = useRef<Canvas | null>(null) as React.MutableRefObject<Canvas | null>;


  // State برای اندازه بورد
  const [boardWidth, setBoardWidth] = useState(800);
  const [boardHeight, setBoardHeight] = useState(600);

  return (
    <div className="bg-gray-100 min-h-screen w-screen flex flex-col">
      <Navbar />
      <main className="flex flex-1 overflow-hidden w-full justify-between">
        <AddSidebar fabricCanvasRef={fabricCanvasRef} />
        <AiBot fabricCanvasRef={fabricCanvasRef} />
        <CanvasEditor
          fabricCanvasRef={fabricCanvasRef}
          boardWidth={boardWidth}
          boardHeight={boardHeight}
        />
        <EditSidbar
          fabricCanvasRef={fabricCanvasRef}
          boardWidth={boardWidth}
          boardHeight={boardHeight}
          setBoardWidth={setBoardWidth}
          setBoardHeight={setBoardHeight}
        />
      </main>
    </div>
  );
}
