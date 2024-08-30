"use client";
import useDraw from "@/hooks/useDraw";
import { drawLine } from "@/utils/drawLine";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

type DrawLineProps = Draw & {
	colorPicker: string;
};
export default function Canvas() {
	const { canvasRef, onMouseDown, handleClearCanvas, canvasSize } =
		useDraw(createLine);
	const [colorPicker, setColorPicker] = useState<string>("#00000");

	useEffect(() => {
		const ctx = canvasRef.current?.getContext("2d");
		socket.emit("client-ready");
		socket.on("get-canvas-state", () => {
			if (!canvasRef.current?.toDataURL()) return;
			socket.emit("canvas-state", canvasRef.current.toDataURL());
		});
		socket.on("canvas-state-from-server", (state: string) => {
			const img = new Image();
			img.src = state;
			img.onload = () => {
				ctx?.drawImage(img, 0, 0);
			};
		});
		socket.on(
			"draw-line",
			({ currentPoint, prevPoint, colorPicker }: DrawLineProps) => {
				if (!ctx) return;
				drawLine({ currentPoint, prevPoint, colorPicker, ctx });
			}
		);
		socket.on("clear", handleClearCanvas);
		return () => {
			socket.off("draw-line");
			socket.off("get-canvas-state");
			socket.off("canvas-state-from-server");
			socket.off("clear");
		};
	}, [canvasRef, handleClearCanvas]);

	function createLine({ prevPoint, currentPoint, ctx }: Draw) {
		socket.emit("draw-line", {
			prevPoint,
			currentPoint,
			colorPicker,
		});
		drawLine({ prevPoint, currentPoint, ctx, colorPicker });
	}
	return (
		<div className="w-full h-4/5 md:h-3/4 md:w-3/4 flex flex-col lg:flex-row items-center justify-center gap-y-8 md:gap-x-16 p-6 bg-white shadow-lg rounded-lg">
			<div className="flex flex-col items-center">
				<HexColorPicker color={colorPicker} onChange={setColorPicker} />
				<button
					type="button"
					onClick={() => socket.emit("clear")}
					className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition-colors"
				>
					Clear Canvas
				</button>
			</div>
			<canvas
				ref={canvasRef}
				width={canvasSize.width}
				height={canvasSize.height}
				className="border border-gray-300 rounded-lg shadow-md"
				onMouseDown={onMouseDown}
				onTouchStart={onMouseDown}
			/>
		</div>
	);
}
