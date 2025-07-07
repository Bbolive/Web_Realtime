import "@/styles/globals.css";
import "@/styles/responsive.css";

/**
 * Custom App component for Next.js
 * @param {import('next/app').AppProps} props
 */
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
