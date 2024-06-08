import React from 'react'
import ReactDOM from 'react-dom/client'
import RouterCommunity from './router/Router.tsx'
import { QueryClient, QueryClientProvider } from 'react-query';
import UserProvider from './contexts/user/UserProvider.tsx';
import MembresProvider from './contexts/membres/MembresProvider.tsx';
import './assets/styles/index.scss'
import DettesProvider from './contexts/dettes/DettesProvider.tsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <MembresProvider>
          <DettesProvider>
            <RouterCommunity />
          </DettesProvider>
        </MembresProvider>
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>
)