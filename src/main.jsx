import React from 'react'
import {NextUIProvider} from "@nextui-org/react";
import ReactDOM from 'react-dom/client'
import App from './App.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
    {/* Don't forget to add dark class with btn in main tag */}
    <main className="light text-foreground">
        <App />
      </main>
    </NextUIProvider>
  </React.StrictMode>,
)
