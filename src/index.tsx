import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider,  Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Desktop from "~/pages/Desktop";
import Login from "~/pages/Login";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "katex/dist/katex.min.css";
import "~/styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "react-auth-kit";

function Layout() {
  const [login, setLogin] = useState<boolean>(false);

  return <Outlet context={{ login, setLogin }} />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Login /> },

      { path: "/desktop", element: <Desktop /> },
      {
        path: "*",
        element: (
          <div className="flex items-center justify-center h-[100vh]">
            <h1>Xatolik malumot topilmadi !</h1>
          </div>
        )
      }
    ]
  }
]);

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);
const queryClinet = new QueryClient();
root.render(
  <AuthProvider
    authType="cookie"
    authName="register_auth_cookie"
    cookieDomain={window.location.hostname}
    cookieSecure={true}
  >
    <QueryClientProvider client={queryClinet}>
      <Toaster position="top-right" richColors />
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </AuthProvider>
);
