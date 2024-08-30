import ClipLoader from "react-spinners/ClipLoader";

export default function Loading() {
	return (
		<div className="w-screen h-screen bg-white overflow-hidden flex justify-center items-center">
			<ClipLoader
				size={35}
				color="#cfcfcfd1"
			/>
		</div>
	);
}
