import React from 'react'
import ReactDOM from 'react-dom/client'
import RouterCommunity from './router/Router.tsx'
import './assets/styles/index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterCommunity />
  </React.StrictMode>,
)
