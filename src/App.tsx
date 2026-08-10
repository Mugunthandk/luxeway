import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CompareBar } from './components/CompareBar';

import { HomePage } from './pages/HomePage';
import { StaysPage } from './pages/StaysPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { ExperienceDetailPage } from './pages/ExperienceDetailPage';
import { TripPlannerPage } from './pages/TripPlannerPage';
import { MapExplorerPage } from './pages/MapExplorerPage';
import { ComparePage } from './pages/ComparePage';
import { WishlistPage } from './pages/WishlistPage';
import { CompleteBookingPage } from './pages/CompleteBookingPage';
import { BookingSuccessPage } from './pages/BookingSuccessPage';
import { TripsPage } from './pages/TripsPage';
import { TravelWalletPage } from './pages/TravelWalletPage';
import { DashboardPage } from './pages/DashboardPage';
import { HostDashboardPage } from './pages/HostDashboardPage';
import { AdminGovernancePage } from './pages/AdminGovernancePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { JournalPage } from './pages/JournalPage';

export function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-transparent text-[#1c1815] antialiased selection:bg-[#ebd3a2] selection:text-[#1c160c] relative overflow-x-hidden">
          {/* Ambient Decorative Lighting */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#fceec9]/40 blur-3xl opacity-70 animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-[#ebdcc8]/35 blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '11s' }} />
            <div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full bg-[#f7e3ba]/30 blur-3xl opacity-50 animate-pulse" style={{ animationDuration: '9s' }} />
          </div>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stays" element={<StaysPage />} />
                <Route path="/stays/:id" element={<PropertyDetailPage />} />
                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
                <Route path="/experiences" element={<ExperiencesPage />} />
                <Route path="/experiences/:id" element={<ExperienceDetailPage />} />
                <Route path="/trip-planner" element={<TripPlannerPage />} />
                <Route path="/map-explorer" element={<MapExplorerPage />} />
                <Route path="/explore" element={<MapExplorerPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/booking/:propertyId" element={<CompleteBookingPage />} />
                <Route path="/booking/success/:id" element={<BookingSuccessPage />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/wallet" element={<TravelWalletPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/host-dashboard" element={<HostDashboardPage />} />
                <Route path="/admin" element={<AdminGovernancePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/journal" element={<JournalPage />} />
              </Routes>
            </main>
            <CompareBar />
            <Footer />
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
