import {
  TrendingDown,
  TrendingUp,
  BarChart3,
  LayoutDashboard,
  UserCog,
  FileText,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: TrendingDown,
    title: "Registrar Despesas",
    description:
      "Controle todas as suas despesas de forma simples e organizada.",
  },
  {
    icon: TrendingUp,
    title: "Registrar Ganhos",
    description: "Registre seus ganhos e acompanhe o crescimento financeiro.",
  },
  {
    icon: FileText,
    title: "Relatórios",
    description:
      "Gere relatórios detalhados para análise completa das finanças.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "Visualize todas as informações importantes em um só lugar.",
  },
  {
    icon: BarChart3,
    title: "Gráficos e Análises",
    description: "Entenda seus padrões financeiros com gráficos intuitivos.",
  },
  {
    icon: Smartphone,
    title: "Aplicativo Mobile",
    description: "Sistema financeiro na palma das suas maõs.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Recursos Completos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tudo que você precisa para gerenciar suas entregas num só lugar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-lg"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon
                    className="text-primary group-hover:text-primary-foreground"
                    size={28}
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
