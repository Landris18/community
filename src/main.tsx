import React from 'react'
import ReactDOM from 'react-dom/client'
import RouterCommunity from './router/Router.tsx'
import { QueryClient, QueryClientProvider } from 'react-query';
import './assets/styles/index.scss'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterCommunity />
    </QueryClientProvider>
  </React.StrictMode>
)
