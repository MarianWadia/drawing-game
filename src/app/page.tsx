"use client";
import useDraw from "@/hooks/useDraw";

export default function Home() {
	const { canvasRef, onMouseDown } = useDraw(drawLine);

	function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
		const lineColor = "#00000";
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
		<main className="w-screen h-screen overflow-hidden bg-white text-black">
			<div className="h-full w-full flex flex-row items-center justify-center gap-x-32">
				<button type="button">Reset board</button>
				<canvas
					ref={canvasRef}
					width={500}
					height={500}
					className="border border-black rounded-md"
					onMouseDown={onMouseDown}
				/>
			</div>
		</main>
	);
}
