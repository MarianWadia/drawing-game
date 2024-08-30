"use client";
import useDraw from "@/hooks/useDraw";
import { useState } from "react";
import { HexColorPicker  } from "react-colorful";

export default function Home() {
	const { canvasRef, onMouseDown, handleClearCanvas, canvasSize } = useDraw(drawLine);
	const [colorPicker, setColorPicker] = useState<string>("#00000");

	function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
		const lineColor = colorPicker;
		const lineWidth = 5;
		let startPoint = prevPoint ?? currentPoint;
		ctx.beginPath();
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = lineColor;
		ctx.moveTo(startPoint.x, startPoint.y);
		ctx.lineTo(currentPoint.x, currentPoint.y);
		ctx.stroke();
		ctx.fillStyle = lineColor;
		ctx.beginPath();
		ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
		ctx.fill();
	}
	return (
		<main className="w-screen h-screen overflow-hidden flex items-center justify-center bg-gray-100">
			<div className="w-full h-4/5 md:h-3/4 md:w-3/4 flex flex-col lg:flex-row items-center justify-center gap-y-8 md:gap-x-16 p-6 bg-white shadow-lg rounded-lg">
				<div className="flex flex-col items-center">
					<HexColorPicker
						color={colorPicker}
						onChange={setColorPicker}
					/>
					<button
						type="button"
						onClick={handleClearCanvas}
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
		</main>
	);
}
