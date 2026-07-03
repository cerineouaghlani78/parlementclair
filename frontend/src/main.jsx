import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import frFR from 'antd/locale/fr_FR'
import App from './App'
import { antdTheme } from './theme/tokens'
import './theme/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={antdTheme} locale={frFR}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
