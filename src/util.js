import { getPreferenceValues } from "@raycast/api";
import WebSocket from "ws";

let ws;
const url = "ws://localhost:4333";

export async function sendEvent(eventType) {
  const preferences = getPreferenceValues();

  const username = preferences.username;
  const password = preferences.password;

  if (!username || !password) {
    throw new Error("Username and password are required in Raycast preferences.");
  }

  try {
    return new Promise((resolve, reject) => {
      const authToken = Buffer.from(`${username}:${password}`).toString("base64");

      if (!ws || ws.readyState === WebSocket.CLOSED) {
        ws = new WebSocket(url, {
          headers: {
            Authorization: `Basic ${authToken}`,
            Origin: "http://localhost",
          },
        });

        ws.on("open", () => {
          console.log("Connected to WebSocket server");

          // Send authentication message (only on initial connection)
          const authMessage = { event: "authenticate", header: `Basic ${authToken}` };
          ws.send(JSON.stringify(authMessage));

          const commandMessage = { event: eventType };
          ws.send(JSON.stringify(commandMessage));
          console.log(`Sent '${eventType}' event`);

          resolve();
        });

        ws.on("message", (data) => {
          console.log("Received message:", data.toString());
        });

        ws.on("error", (error) => {
          console.error("WebSocket error:", error);
          ws.close();
          reject(error);
        });

        ws.on("close", () => {
          console.log("WebSocket connection closed.");
          ws = null;
        });
      } else if (ws.readyState === WebSocket.OPEN) {
        const commandMessage = { event: eventType };
        ws.send(JSON.stringify(commandMessage));
        console.log(`Sent '${eventType}' event`);
        resolve();
      } else {
        ws.on("open", () => {
          const commandMessage = { event: eventType };
          ws.send(JSON.stringify(commandMessage));
          console.log(`Sent '${eventType}' event`);
          resolve();
        });
      }
    });
  } catch (error) {
    console.error("Error occurred while sending event:", error);
  }
}