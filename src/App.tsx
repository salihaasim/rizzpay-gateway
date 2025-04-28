
import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"

// Page imports
import Index from './pages/Index'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import WalletPage from './pages/WalletPage'
import WebhookPayment from './pages/WebhookPayment'
import Security from './pages/Security'
import Settings from './pages/Settings'
import Features from './pages/Features'
import Features2 from './pages/Features2'
import HowItWorksTechnical from './pages/HowItWorksTechnical'
import TermsAndConditions from './pages/TermsAndConditions'
import UpiPaymentPage from './pages/UpiPaymentPage'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'
import MerchantWhitelist from './pages/MerchantWhitelist'

// Admin pages
import AdminDashboard from './pages/AdminDashboard'
import AdminActivityLog from './pages/AdminActivityLog'
import AdminTransactionLog from './pages/AdminTransactionLog'
import AdminMonitoring from './pages/AdminMonitoring'
import AdminWhitelist from './pages/AdminWhitelist'
import AdminSettings from './pages/AdminSettings'

// Merchant onboarding
import MerchantOnboarding from './pages/merchant-onboarding'
import RegisterMerchant from './pages/register-merchant'

// Developer Integration page
import DeveloperIntegration from './pages/DeveloperIntegration'

// Supabase integration
import { supabase } from './integrations/supabase/client'

function App() {
  useEffect(() => {
    // set session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      // setSession(session)
    })
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/security" element={<Security />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/developer" element={<DeveloperIntegration />} />
        <Route path="/webhook" element={<WebhookPayment />} />
        <Route path="/features" element={<Features />} />
        <Route path="/features2" element={<Features2 />} />
        <Route path="/technical" element={<HowItWorksTechnical />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/activity" element={<AdminActivityLog />} />
        <Route path="/admin/transactions" element={<AdminTransactionLog />} />
        <Route path="/admin/monitoring" element={<AdminMonitoring />} />
        <Route path="/admin/whitelist" element={<AdminWhitelist />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/merchant-onboarding" element={<MerchantOnboarding />} />
        <Route path="/register-merchant" element={<RegisterMerchant />} />
        <Route path="/merchant-whitelist" element={<MerchantWhitelist />} />
        <Route path="/payment/:id" element={<UpiPaymentPage />} />
        <Route path="/webhook-payment" element={<WebhookPayment />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
