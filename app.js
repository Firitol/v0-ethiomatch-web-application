// app.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Matches from './components/Matches';
import Chat from './components/Chat';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { getCurrentUser } from './lib/auth';
import './styles/globals.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <p className="text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Navbar user={user} />
        <main className="flex-1 p-4 sm:p-8">
          <Routes>
            <Route
              path="/"
              element={user ? <Home user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/matches"
              element={user ? <Matches user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/chat/:matchId"
              element={user ? <Chat user={user} /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<Login onLogin={setUser} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
