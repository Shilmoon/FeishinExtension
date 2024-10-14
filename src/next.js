import { sendEvent } from "./util";

export default async () => {
  try {
    await sendEvent("next");
  } catch (error) {
    console.error("Failed to send 'next' event:", error);
  }
}