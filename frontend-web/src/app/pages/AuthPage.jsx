import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Truck,
  CheckCircle,
} from "lucide-react";

import api from "../../services/api";

export function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();

  //? ESTADO (FRONTEND): Controla o visual e os dados na tela
  const [isLogin, setIsLogin] = useState(location.pathname === "/login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); //Tela mostrando carregando...

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //* sincronização de url com o state
  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  //* Mudando na tela de login para registro
  const toggleMode = () => {
    const newMode = !isLogin;
    setIsLogin(newMode);
    navigate(newMode ? "/login" : "/register");

    setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" })); //? limpando
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //? LOGICA DO BACKEND -> vai enviar os dados para o servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        //* --- LOGIN --- (acessa o /api/token)
        const response = await api.post("/token/", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        // Configura o token padrão para as próximas requisições
        api.defaults.headers.Authorization = `Bearer ${response.data.access}`;

        navigate("/dashboard"); // Sucesso! Vai para a Home
      } else {
        //* --- REGISTRO --- (Acessa o /api/register)

        // VALIDAÇÂO do front antes de enviar
        if (formData.password !== formData.confirmPassword) {
          alert("As senhas não coicidem!");
          setIsLogin(false);
          return;
        }

        await api.post("/register/", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        alert("Conta criada com sucesso! Faça o Login");
        toggleMode();
      }
    } catch (error) {
      console.error("Erro na requisição:", error);

      // Tenta ler a mensagem de erro que o Django mandou
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.email?.[0] || // Erro de email duplicado
        error.response?.data?.password?.[0] || // Senha fraca
        "Ocorreu um erro. Verifique seus dados.";

      alert(errorMsg);
    } finally {
      setIsLoading(false); // Para o loading independente do resultado
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-card rounded-3xl shadow-2xl overflow-hidden border border-border min-h-[600px] flex relative">
        {/* --- LADO ESQUERDO/DIREITO (FORMULÁRIO) --- */}
        <motion.div
          className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center bg-card z-10"
          animate={{ x: isLogin ? "0%" : "100%" }} // Animação de deslize
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-2">
                {isLogin ? "Bem-vindo de volta" : "Criar nova conta"}
              </h2>
              <p className="text-muted-foreground">
                {isLogin
                  ? "Acesse para gerir suas entregas"
                  : "Preencha seus dados para começar"}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Nome Completo
                      </label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                          type="text"
                          name="name"
                          required={!isLogin}
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-input/50 border border-input rounded-xl py-3 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          placeholder="Seu nome"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-input/50 border border-input rounded-xl py-3 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Senha
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-input/50 border border-input rounded-xl py-3 pl-10 pr-12 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {/* Campo Confirmar Senha (Só no registro)*/}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Confirmar Senha
                    </label>
                    <div className="relative group">
                      <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        type="password"
                        name="confirmPassword"
                        required={!isLogin}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-input/50 border border-input rounded-xl py-3 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="Repita a senha"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="text-muted-foreground">Lembrar-me</span>
                  </label>
                  <a
                    href="#"
                    className="text-primary hover:underline font-medium"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 font-bold text-lg shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Processando..."
                  : isLogin
                    ? "Entrar"
                    : "Criar Conta"}
                {!isLoading && <ArrowRight size={20} />}
              </button>
            </form>
            {/* Link Mobile (Para telas pequenas)*/}
            <div className="mt-6 text-center md:hidden">
              <p className="text-muted-foreground">
                {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
                <button
                  onClick={toggleMode}
                  className="text-primary font-bold hover:underline"
                >
                  {isLogin ? "Cadastre-se" : "Entrar"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
        {/* --- LADO COLORIDO (PAINEL DECORATIVO) ---*/}
        <motion.div
          className="hidden md:flex absolute top-0 left-0 w-1/2 h-full bg-primary text-primary-foreground flex-col justify-center items-center p-12 text-center z-20"
          animate={{ x: isLogin ? "100%" : "0%" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          <div className="relative z-10 max-w-sm">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-8 mx-auto backdrop-blur-sm border-none">
              <Truck size={40} className="text-white" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login-msg" : "register-msg"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-4xl font-bold mb-4 text-white">
                  {isLogin ? "Novo por aqui?" : "Já é parceiro?"}
                </h2>
                <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
                  {isLogin
                    ? "Cadastre-se agora e comece a controlar seus ganhos e despesas de forma profissional."
                    : "Entre na sua conta para acessar seus relatórios e gerenciar sua frota."}
                </p>

                <button
                  onClick={toggleMode}
                  className="px-8 py-3 border-none text-white rounded-xl font-bold hover:bg-white hover:text-primary transition-all duration-300 uppercase tracking-wider"
                >
                  {isLogin ? "Cadastre-se" : "Fazer Login"}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
