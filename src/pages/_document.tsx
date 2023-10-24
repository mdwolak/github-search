import { Head, Html, Main, NextScript } from "next/document";

function MyDocument() {
  return (
    <Html className="h-full bg-gray-50">
      <Head />
      <body className="desktop-transparent h-full antialiased">
        <Main />
        <NextScript />
        <div id="main-modal"></div>
      </body>
    </Html>
  );
}

export default MyDocument;
