import { Head, Html, Main, NextScript } from "next/document";

function MyDocument() {
  return (
    <Html className="dark h-full">
      <Head />
      <body className="desktop-transparent h-full antialiased dark:text-gray-100">
        <Main />
        <NextScript />
        <div id="main-modal"></div>
      </body>
    </Html>
  );
}

export default MyDocument;
