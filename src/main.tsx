import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// this function starts our fake backend (MSW) before the app loads

async function startApp() {
  // this app has no real backend, so we run the mock server
  // in every environment, including the deployed demo
  const { worker } = await import("./mocks/browser");

  // bypass means: ignore requests we don't have a handler for
  // (like the browser's own page load request)
  await worker.start({
    onUnhandledRequest: "bypass",
  });

  const rootElement = document.getElementById("root");

  createRoot(rootElement!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

startApp();