import { Menu } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/_button";
import { Link } from "react-router-dom";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-primary"
          >
            Entregas Plus
          </motion.div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Início
            </a>
            <a
              href="#features"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Recursos
            </a>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" className="px-6 py-2">Entrar</Button>
              </Link>
              <Button className="px-6 py-2">Cadastrar</Button>
            </div>
          </nav>

          {/* Mobile botões */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
