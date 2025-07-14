import { RouterProvider } from "react-router";
import { router } from "./router";
import { useEffect } from "react";
import { authStateChange } from "./stores/auth.slice";
import { store } from "./stores/store";

export default function App() {
  useEffect(() => {
    const unsubscribe = authStateChange(store.dispatch);
    return () => unsubscribe();
  }, []);

  return <RouterProvider router={router} />;
}
