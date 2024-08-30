import React, { useEffect, useRef, useState } from "react";

function useDraw(onDraw: ({ ctx, prevPoint, currentPoint }: Draw) => void) {
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const prevPoint = useRef<null | Point>(null);
	const [mouseDown, setMouseDown] = useState(false);
	const onMouseDown = () => setMouseDown(true);
	useEffect(() => {
		let currentRef = canvasRef.current;
		const handleMouseMove = (e: MouseEvent) => {
			if(!mouseDown) return
			console.log({ x: e.clientX, y: e.clientY });
			const currentPoint = computePointInCanvas(e);
			const ctx = currentRef?.getContext("2d");
			if (!ctx || !currentPoint) return;
			onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
			prevPoint.current = currentPoint;
		};

		const computePointInCanvas = (e: MouseEvent) => {
			const canvas = canvasRef.current;
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			return { x, y };
		};
		const mouseUpHandler = () => {
			setMouseDown(false);
			prevPoint.current = null;
		};
		// The event is already passed automatically either we put it like this or we removed it at all and just called the function callback handleMouseMove
		currentRef?.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", mouseUpHandler);
		return () => {
			currentRef?.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", mouseUpHandler);
		};
	}, [onDraw, mouseDown]);
	return {
		canvasRef,
		onMouseDown,
	};
}

export default useDraw;
