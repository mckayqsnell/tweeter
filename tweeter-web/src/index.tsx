import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import UserInfoProvider from "./components/userInfo/UserInfoProvider";
import ToastProvider from "./components/toaster/ToastProvider";

library.add(fab);

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  // <React.StrictMode>  --> Turned this off because it was causing a bug with loading items in the story / feed (loading 1st 10 items twice)
  <UserInfoProvider>
    {" "}
    {/* This is the top-level context provider --> where I'll add hooks for users --> user context */}
    <ToastProvider>
      {" "}
      {/* toast context*/}
      <App />
    </ToastProvider>
  </UserInfoProvider>
  // </React.StrictMode>
);
