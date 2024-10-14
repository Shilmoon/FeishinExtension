import { showToast, ToastStyle } from "@raycast/api"; // Raycast API required for showing toast notifications
import { useState, useEffect } from "react"; // Use React-like hooks from Raycast
import { initializeCredentials } from "./util";

export default function InitializeCredentials(props) {
  // Local state to manage loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Arguments passed from the Raycast command prompt
  const { username, password } = props.arguments;

  // useEffect to handle asynchronous side effects after the component is first rendered
  useEffect(() => {
    async function authenticate() {
      try {
        setIsLoading(true);
        // Initialize the WebSocket connection using the credentials
        await initializeCredentials(username, password);
        showToast(ToastStyle.Success, "WebSocket Connected", "Credentials successfully set.");
      } catch (err) {
        setError(err.message || "Failed to initialize credentials");
        showToast(ToastStyle.Failure, "Error", err.message || "Failed to initialize credentials");
      } finally {
        setIsLoading(false);
      }
    }

    authenticate();
  }, [username, password]); // Effect depends on username and password from props

  if (isLoading) {
    return <div>Connecting to WebSocket...</div>; // Show a loading message
  }

  if (error) {
    return <div>Error: {error}</div>; // Render the error if occurred
  }

  // If everything is successful, return some success state or UI
  return <div>WebSocket initialized successfully.</div>;
}