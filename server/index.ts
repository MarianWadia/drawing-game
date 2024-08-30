import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
	},
});

type Point = {
	x: number;
	y: number;
};

type DrawLine = {
	prevPoint: Point | null;
	currentPoint: Point;
	colorPicker: string;
};

io.on("connection", (socket) => {
	console.log("connection");
	socket.on("client-ready", () => {
		socket.broadcast.emit("get-canvas-state");
	});
	socket.on("canvas-state", (state) => {
        socket.broadcast.emit('canvas-state-from-server', state);
    });
	// those parameters are sent from the client will be listening to that event to the server
	socket.on(
		"draw-line",
		({ prevPoint, currentPoint, colorPicker }: DrawLine) => {
			// this will emit the data to all clients connected but not the sender
			socket.broadcast.emit("draw-line", {
				prevPoint,
				currentPoint,
				colorPicker,
			});
		}
	);
	socket.on("clear", () => {
		// here the io.emit will emit the event to everyone who is connected including the sender
		io.emit("clear");
	});
});

server.listen(3001, "localhost", () => {
	console.log("✔ Server listening on port 3001");
});
