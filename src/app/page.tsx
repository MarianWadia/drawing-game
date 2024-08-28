import useDraw from "@/hooks/useDraw";
import Image from "next/image";

export default function Home() {
	const { canvasRef } = useDraw();
	return (
		<main className="w-screen h-screen overflow-hidden">
			<div className="h-full w-full flex flex-row items-center justify-center gap-x-32">
				<button type="button">Reset board</button>
				<canvas
					width={750}
					height={750}
					className="border border-black rounded-md"
				/>
			</div>
		</main>
	);
}
