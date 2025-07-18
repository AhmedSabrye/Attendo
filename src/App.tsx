import { RouterProvider } from "react-router";
import { router } from "./router";

import { authStateChange, useGetMeQuery } from "./stores/auth.slice";
import { useEffect } from "react";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./stores/store";

export default function App() {
  const { refetch } = useGetMeQuery();
  useEffect(() => {
    // Get initial session
    refetch();
  }, [refetch]);

  useEffect(() => {
    const unsubscribe = authStateChange(store.dispatch);
    return () => unsubscribe();
  }, []);
  return (
    <div className="">
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        stacked
      />
    </div>
  );
}
