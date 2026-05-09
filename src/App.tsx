/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Components
import Sidebar from "./components/Sidebar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import AITutor from "./pages/AITutor";
import MockTests from "./pages/MockTests";
import TestEngine from "./pages/TestEngine";
import Results from "./pages/Results";
import Leaderboard from "./pages/Leaderboard";
import PYQs from "./pages/PYQs";
import StudyMaterial from "./pages/StudyMaterial";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white">Loading NEET Cracker AI...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white">Verifying credentials...</div>;
  if (!user || !isAdmin) return <Navigate to="/" />;
  return <>{children}</>;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/admin" element={
            <AdminRoute>
              <MainLayout>
                <Admin />
              </MainLayout>
            </AdminRoute>
          } />

          <Route path="/" element={
            <MainLayout>
              <Home />
            </MainLayout>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/ai-tutor" element={
            <ProtectedRoute>
              <MainLayout>
                <AITutor />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/tests" element={
            <ProtectedRoute>
              <MainLayout>
                <MockTests />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/test/:testId" element={
            <ProtectedRoute>
              <TestEngine />
            </ProtectedRoute>
          } />

          <Route path="/results/:testId" element={
            <ProtectedRoute>
              <MainLayout>
                <Results />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/leaderboard" element={
            <MainLayout>
              <Leaderboard />
            </MainLayout>
          } />

          <Route path="/pyq" element={
            <MainLayout>
              <PYQs />
            </MainLayout>
          } />

          <Route path="/study" element={
            <MainLayout>
              <StudyMaterial />
            </MainLayout>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
