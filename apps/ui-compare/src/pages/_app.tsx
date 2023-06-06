import { ClerkProvider } from "@clerk/nextjs";

export default function App({ Component, pageProps }) {
  console.log("Loading app");
  return (
    <ClerkProvider {...pageProps}>
      <div></div>
    </ClerkProvider>
  );
}
