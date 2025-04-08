import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Desktop from "~/pages/Desktop";
import Login from "~/pages/Login";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "katex/dist/katex.min.css";
import "~/styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PrivateRoute from "./routes/PrivateRoute";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },

  {
    path: "/desktop",
    element: (
      <PrivateRoute>
        <Desktop />
      </PrivateRoute>
    )
  },
  {
    path: "*",
    element: (
      <div className="flex items-center justify-center h-[100vh]">
        <h1>Xatolik malumot topilmadi !</h1>
      </div>
    )
  }
]);

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);
const queryClinet = new QueryClient();
root.render(
  <QueryClientProvider client={queryClinet}>
    <Toaster position="top-right" richColors />
    <ReactQueryDevtools initialIsOpen={false} />
    <RouterProvider router={router} />
  </QueryClientProvider>
);
