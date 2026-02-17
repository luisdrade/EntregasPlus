import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./app/pages/LandingPage";
import { AuthPage } from "./app/pages/AuthPage";

//import { RegisterPage } from "./app/pages/RegisterPage";
//import { Login } from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* A rota "/" agora é a Landing Page bonita */}
        <Route path="/" element={<LandingPage />} />

        {/* A rota de login separada <Route path="/login" element={<Login />} /> */}
        
        <Route path="/login" element={<AuthPage/>}/>
        <Route path="/register" element={<AuthPage/>}/>
        {/* Futuramente: <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
