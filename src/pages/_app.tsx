import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../stores/index";
import { Provider } from "react-redux";
import { AuthProvider } from "@/contexts/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </AuthProvider>
  );
}
