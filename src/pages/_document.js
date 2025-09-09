// This _document.js file is required by next-pwa plugin
// even though this project uses App Router (src/app/layout.tsx)
// This is a minimal _document for PWA compatibility only

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}