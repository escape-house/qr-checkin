import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LanguageProvider } from "../i18n/LanguageContext.tsx"
import Router from "../Router.tsx"

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <LanguageProvider>
                <Router />
            </LanguageProvider>
        </QueryClientProvider>
    </StrictMode>,
)
