import App from "./App";
import { createRoot } from "react-dom/client";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/content");

import "../style.scss";

const root = document.createElement("div");
root.id = "chrome-extension-zfy-search-content-view-root";
document.body.append(root);

createRoot(root).render(<App />);
