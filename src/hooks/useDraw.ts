import React, { useEffect, useRef, useState } from "react";

function useDraw(onDraw: ({ ctx, prevPoint, currentPoint }: Draw) => void) {
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const prevPoint = useRef<null | Point>(null);
	const [mouseDown, setMouseDown] = useState(false);
	const [canvasSize, setCanvasSize] = useState({ width: 200, height: 200 });

	const onMouseDown = () => setMouseDown(true);

	useEffect(() => {
		let currentRef = canvasRef.current;
		const handleMouseMove = (e: MouseEvent | TouchEvent) => {
			if (!mouseDown) return;
			// console.log({ x: e.clientX, y: e.clientY });
			const currentPoint = computePointInCanvas(e);
			const ctx = currentRef?.getContext("2d");
			if (!ctx || !currentPoint) return;
			onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
			prevPoint.current = currentPoint;
		};
		const computePointInCanvas = (e: MouseEvent | TouchEvent) => {
			const canvas = canvasRef.current;
			if (!canvas) return;
			if ((e as TouchEvent).touches) {
				return {
					x:
						(e as TouchEvent).touches[0].clientX -
						canvasRef.current.getBoundingClientRect().left,
					y:
						(e as TouchEvent).touches[0].clientY -
						canvasRef.current.getBoundingClientRect().top,
				};
			} else {
				const rect = canvas.getBoundingClientRect();
				return {
					x: (e as MouseEvent).clientX - rect.left,
					y: (e as MouseEvent).clientY - rect.top,
				};
			}
		};
		const mouseUpHandler = () => {
			setMouseDown(false);
			prevPoint.current = null;
		};

		// The event is already passed automatically either we put it like this or we removed it at all and just called the function callback handleMouseMove
		currentRef?.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", mouseUpHandler);
		currentRef?.addEventListener("touchmove", handleMouseMove);
		currentRef?.addEventListener("touchend", mouseUpHandler);

		return () => {
			currentRef?.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", mouseUpHandler);
			currentRef?.removeEventListener("mousemove", handleMouseMove);
			currentRef?.removeEventListener("touchend", mouseUpHandler);
		};
	}, [onDraw, mouseDown]);

	useEffect(() => {
		const resizeCanvas = () => {
			const canvas = canvasRef.current;
			if (canvas) {
				let newWidth = window.innerWidth - 100;
				let newHeight = window.innerHeight / 4;
				if (window.innerWidth >= 1024) {
					newWidth = window.innerWidth - window.innerWidth / 4 - 350;
					newHeight = window.innerHeight / 1.5;
				} else if (window.innerWidth >=768) {
					newWidth = window.innerWidth - window.innerWidth / 4 - 100;
					newHeight = window.innerHeight / 4;
				}

				setCanvasSize({ width: newWidth, height: newHeight });

				const ctx = canvas.getContext("2d");
				if (ctx) {
					// Save the current canvas content
					const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

					// Resize the canvas
					canvas.width = newWidth;
					canvas.height = newHeight;

					// Redraw the content
					ctx.putImageData(imageData, 0, 0);
				}
			}
		};

		resizeCanvas();

		window.addEventListener("resize", resizeCanvas);

		return () => {
			window.removeEventListener("resize", resizeCanvas);
		};
	}, []);
	const handleClearCanvas = () => {
		if (!canvasRef.current) return;
		const ctx = canvasRef.current?.getContext("2d");
		if (!ctx) return;
		ctx.clearRect(0, 0, canvasRef.current?.width, canvasRef.current?.height);
	};
	return {
		canvasRef,
		onMouseDown,
		handleClearCanvas,
		canvasSize,
	};
}

export default useDraw;
