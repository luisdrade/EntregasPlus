import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  DollarSign,
  FileText,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "../app/components/ui/_button";

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Visão Geral", path: "/dashboard" },
    { icon: DollarSign, label: "Financeiro", path: "/financeiro" },
    { icon: FileText, label: "Relatórios", path: "/relatorios" },
    { icon: User, label: "Perfil", path: "/perfil" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* --- SIDEBAR (Barra Lateral - Desktop) --- */}
      <aside className="hidden md:flex w-64 flex-col bg-card border-r border-border h-screen fixed left-0 top-0 z-20">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Truck className="w-8 h-8" />
            Entregas Plus
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Header Mobile (Só aparece no celular) */}
        <header className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-10">
          <div className="font-bold text-primary text-lg">Entregas Plus</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu />
          </Button>
        </header>

        {/* Menu Mobile (Dropdown) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-card border-b border-border p-4 absolute top-16 left-0 right-0 z-20 shadow-xl">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg">
                    <item.icon size={20} />
                    {item.label}
                  </div>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-red-500 w-full text-left"
              >
                <LogOut size={20} /> Sair
              </button>
            </nav>
          </div>
        )}

        {/* A PÁGINA ESPECÍFICA ENTRA AQUI */}
        <div className="p-6 md:p-10 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
