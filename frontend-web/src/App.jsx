import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./app/pages/LandingPage";
import { AuthPage } from "./app/pages/AuthPage";
import { Dashboard } from "./app/pages/Dashboard";
import { DashboardLayout } from "./layouts/DashboardLayouts";

//import { RegisterPage } from "./app/pages/RegisterPage";
//import { Login } from "./pages/Login";

// Componente simples para proteger rotas (Se não tiver token, manda pro login)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* A rota "/" agora é a Landing Page bonita */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* O "index" significa que /dashboard carrega este componente por padrão */}
          <Route path="dashboard" element={<Dashboard />} />

         {/* <Route path="financeiro" element={<Financeiro />} />*/}
          {/*<Route path="relatorios" element={<Relatorios />} />*/}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
