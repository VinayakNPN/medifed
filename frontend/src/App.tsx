import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const CoordinatorDashboard = lazy(() => import('@/pages/CoordinatorDashboard'));
const HospitalDashboard = lazy(() => import('@/pages/HospitalDashboard'));
const Training = lazy(() => import('@/pages/Training'));
const Prediction = lazy(() => import('@/pages/Prediction'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const BlockchainExplorer = lazy(() => import('@/pages/BlockchainExplorer'));
const About = lazy(() => import('@/pages/About'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// A simple loading fallback
const LoadingFallback = () => (
  <div className="flex h-full w-full items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes without Layout */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Dashboard Routes with Layout */}
          <Route element={<RootLayout />}>
            <Route path="/coordinator" element={<CoordinatorDashboard />} />
            <Route path="/hospital" element={<HospitalDashboard />} />
            <Route path="/training" element={<Training />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/blockchain" element={<BlockchainExplorer />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
