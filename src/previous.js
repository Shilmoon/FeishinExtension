import { sendEvent } from "./util";

export default async () => {
  try {
    await sendEvent("previous");
  } catch (error) {
    console.error("Failed to send 'previous' event:", error);
  }
}