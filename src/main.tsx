import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import { Suspense, lazy } from "react";

import NotFound from "./screens/notFound";
import Loader from './components/loader/loader.tsx';
import { AuthProvider, useAuth } from './screens/Auth/AuthContext.tsx';
import ProtectedRoute from './screens/Auth/ProtectedRoute.tsx';
import AdminRoute from './screens/Auth/AdminRoute.tsx';
import GuestRoute from './screens/Auth/GuestRoute.tsx';
import { getHomePath } from './screens/Auth/roles.ts';
import { ThemeProvider } from './components/theme-provider.tsx';

const Page1 = lazy(() =>
  wait(1300).then(() => import("./screens/page1.tsx"))
);

const Page2 = lazy(() =>
  wait(1300).then(() => import("./screens/page2.tsx"))
);

const Login = lazy(() => import("./screens/Auth/login.tsx"));
const Register = lazy(() => import("./screens/Auth/Register.tsx"));

// ── Admin pages ───────────────────────────────────────────────────────────
const AdminDashboard  = lazy(() => import("./screens/Admin/Dashboard.tsx"));
const AdminUsers      = lazy(() => import("./screens/Admin/UserPage.tsx"));
const AdminOffices    = lazy(() => import("./screens/Admin/OfficePage.tsx"));
const AdminDocuments  = lazy(() => import("./screens/Admin/DocumentPage.tsx"));
const AdminSettings   = lazy(() => import("./screens/Admin/Setting.tsx"));
const AdminProfile    = lazy(() => import("./screens/Admin/Profile.tsx"));

// ── User pages (acc_lvl !== 0) ────────────────────────────────────────────
const UserDashboard  = lazy(() => import("./screens/User/Dashboard.tsx"));
const UserDocuments  = lazy(() => import("./screens/User/Documents.tsx"));
const UserProfile    = lazy(() => import("./screens/User/Profile.tsx"));

// Legacy route kept for old links
const LegacyDashboard = lazy(() => import("./screens/Dashboard.tsx"));

// Sends "/" to the right place: role-based dashboard if logged in, login otherwise.
const Home = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Loader />;
  return (
    <Navigate
      to={isAuthenticated ? getHomePath(user) : "/react-vite-supreme/login"}
      replace
    />
  );
};

const router = createBrowserRouter([
  // ── Auth pages (no navbar) — redirect away if already logged in ────────
  {
    path: "/react-vite-supreme/login",
    element: (
      <GuestRoute>
        <Suspense fallback={<Loader />}>
          <Login />
        </Suspense>
      </GuestRoute>
    ),
  },
  {
    path: "/react-vite-supreme/register",
    element: (
      <GuestRoute>
        <Suspense fallback={<Loader />}>
          <Register />
        </Suspense>
      </GuestRoute>
    ),
  },

  // ── Admin pages — acc_lvl === 0 only ───────────────────
  {
    path: "/react-vite-supreme/admin/dashboard",
    element: <AdminRoute><Suspense fallback={<Loader />}><AdminDashboard /></Suspense></AdminRoute>,
  },
  {
    path: "/react-vite-supreme/admin/users",
    element: <AdminRoute><Suspense fallback={<Loader />}><AdminUsers /></Suspense></AdminRoute>,
  },
  {
    path: "/react-vite-supreme/admin/offices",
    element: <AdminRoute><Suspense fallback={<Loader />}><AdminOffices /></Suspense></AdminRoute>,
  },
  {
    path: "/react-vite-supreme/admin/documents",
    element: <AdminRoute><Suspense fallback={<Loader />}><AdminDocuments /></Suspense></AdminRoute>,
  },
  {
    path: "/react-vite-supreme/admin/settings",
    element: <AdminRoute><Suspense fallback={<Loader />}><AdminSettings /></Suspense></AdminRoute>,
  },
  {
    path: "/react-vite-supreme/admin/profile",
    element: <AdminRoute><Suspense fallback={<Loader />}><AdminProfile /></Suspense></AdminRoute>,
  },

  // ── User pages — any authenticated user ────────────────
  {
    path: "/react-vite-supreme/user/dashboard",
    element: <ProtectedRoute><Suspense fallback={<Loader />}><UserDashboard /></Suspense></ProtectedRoute>,
  },
  {
    path: "/react-vite-supreme/user/documents",
    element: <ProtectedRoute><Suspense fallback={<Loader />}><UserDocuments /></Suspense></ProtectedRoute>,
  },
  {
    path: "/react-vite-supreme/user/profile",
    element: <ProtectedRoute><Suspense fallback={<Loader />}><UserProfile /></Suspense></ProtectedRoute>,
  },

  // ── Legacy dashboard redirect ──────────────────────────
  {
    path: "/react-vite-supreme/dashboard",
    element: <Navigate to="/react-vite-supreme/admin/dashboard" replace />,
  },

  // ── Legacy standalone dashboard (kept as fallback) ────
  {
    path: "/react-vite-supreme/dashboard-old",
    element: <Suspense fallback={<Loader />}><LegacyDashboard /></Suspense>,
  },

  // ── Main app with navbar ──────────────────────────────
  {
    path: "/react-vite-supreme/",
    element: <App />,
    children: [
      {
        path: "/react-vite-supreme/",
        element: <Home />,
      },
      {
        path: "/react-vite-supreme/page1",
        element: (
          <Suspense fallback={<Loader />}>
            <Page1 />
          </Suspense>
        ),
      },
      {
        path: "/react-vite-supreme/page2",
        element: (
          <Suspense fallback={<Loader />}>
            <Page2 />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
