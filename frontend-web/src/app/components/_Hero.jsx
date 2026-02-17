import { ArrowRight, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/_button";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Texto à Esquerda */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 border border-primary/20">
              <Smartphone className="text-primary" size={18} />
              <span className="text-sm text-primary font-medium">
                Em breve: App Mobile
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground tracking-tight">
              Entregas <span className="text-primary">Plus</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Gerencie suas finanças de entrega de forma simples. Controle
              despesas, ganhos e tenha relatórios detalhados na palma da mão.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/">
                <Button size="lg" className="gap-2 text-lg h-12 px-8">
                  Começar Agora <ArrowRight size={20} />
                </Button>
              </Link>
              <a href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg h-12 px-8"
                >
                  Saiba Mais
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Animação à Direita */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] w-full hidden lg:block"
          >
            {/* Fundo Decorativo */}
            <div className="absolute top-10 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-10"></div>

            {/* Cartão Flutuante 1 */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-20 w-64 p-4 bg-card rounded-2xl border border-border shadow-xl z-20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                  $
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Ganhos Hoje
                  </div>
                  <div className="font-bold text-foreground">R$ 342,50</div>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[70%]"></div>
              </div>
            </motion.div>

            {/* Cartão Flutuante 2 */}
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-20 left-10 w-64 p-4 bg-card rounded-2xl border border-border shadow-xl z-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">
                  ↓
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Despesas</div>
                  <div className="font-bold text-foreground">R$ 85,00</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-muted rounded w-full"></div>
                <div className="h-2 bg-muted rounded w-2/3"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
