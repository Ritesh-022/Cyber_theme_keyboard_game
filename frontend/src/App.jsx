import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { ThemeProvider, useTheme } from "./hooks/useTheme";
import Nav from "./components/Nav";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import GamePage from "./pages/GamePage";
import SocialPage from "./pages/SocialPage";
import AboutPage from "./pages/AboutPage";
import SupportPage from "./pages/SupportPage";
import StatsPage from "./pages/StatsPage";
import ProfilePage from "./pages/ProfilePage";
import FriendProfilePage from "./pages/FriendProfilePage";

function AppRoutes() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) return (
    <div style={{ background: theme.bg, minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: theme.primary, fontFamily: "monospace", letterSpacing: 4 }}>
        LOADING...
      </span>
    </div>
  );

  return (
    <div
      className={`theme-${theme.name} theme-transition${theme.scanline ? " scanlines" : ""}`}
      style={{ background: theme.bg, minHeight: "100vh",
        fontFamily: theme.font, transition: "background 0.5s" }}>
      <Nav />
      <Routes>
        <Route path="/"                  element={<HomePage theme={theme} />} />
        <Route path="/play"              element={<GamePage theme={theme} />} />
        <Route path="/about"             element={<AboutPage theme={theme} />} />
        <Route path="/support"           element={<SupportPage theme={theme} />} />
        <Route path="/stats"             element={<StatsPage theme={theme} />} />
        <Route path="/profile"           element={user ? <ProfilePage theme={theme} /> : <Navigate to="/auth" />} />
        <Route path="/social"            element={user ? <SocialPage theme={theme} /> : <Navigate to="/auth" />} />
        <Route path="/social/:uniqueId"  element={user ? <FriendProfilePage theme={theme} /> : <Navigate to="/auth" />} />
        <Route path="/auth"              element={!user ? <AuthPage theme={theme} /> : <Navigate to="/" />} />
        <Route path="*"                  element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
