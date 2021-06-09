import express = require("express");
import WebSocket = require("ws");
import getopts = require("getopts");
import path = require("path");
import { log } from "./logger";
import html from "./html";
import { web_socket_port, http_port } from "./common/constants";
import chalk = require("chalk");
import { WebSocket_Message } from "./common/types";

let main = () => {
    // First we set up the regular HTTP server.
    const app: express.Application = express();

    // The root will return the default html, which contains the logic to fetch modules and
    // start rendering the package.
    app.get("/", function (req, res) {
        res.type("html");
        res.send(html);
    });

    app.use(express.static(path.join("build", "client")));

    // Ready to go!
    app.listen(http_port, function () {
        log(`listening at ${chalk.bold(`http://localhost:${http_port}/`)}`);
    });

    // Next up we set up the WebSocker server. The client will connect to it as standard.
    const wss = new WebSocket.Server({ port: web_socket_port });
    const ws_clients: { [key: string]: WebSocket } = {};

    // We'll keep track of all our clients and send updates to all of them. Ex. people might
    // open different tabs, set up their app into different states, and iterate on the code to
    // see the impact in both tabs.
    let next_wd_id = 1;

    wss.on("connection", (ws) => {
        const id = "" + next_wd_id++;
        log(`websocket[${id}]: connected`);
        ws_clients[id] = ws;
        ws.on("close", () => {
            log(`websocket[${id}]: disconnected`);
            delete ws_clients[id];
        });
    });

    // Mention it in the log.
    wss.on("listening", () => {
        log(`listening at ${chalk.bold(`ws://localhost:${web_socket_port}/`)}`);
    });

    // Utility function to send a message to our clients.
    const send_to_ws = (message: WebSocket_Message) => {
        const str = JSON.stringify(message);
        for (const ws of Object.values(ws_clients)) {
            ws.send(str);
        }
    };
};

// Helper to crash hard in case of unknown exceptions. We don't want to keep going if an error
// happened that we don't fully understand, because some state somewhere might be corrupted.
function crash_with(error: Error) {
    // This escapes any promise we might be in and throws in the top-level context, causing
    // the app the print the stack and exit.
    process.nextTick(() => {
        throw error;
    });
}

main();
