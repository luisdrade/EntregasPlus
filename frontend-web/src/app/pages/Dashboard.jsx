import React from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";

export function Dashboard() {
  const stats = [
    {
      title: "Ganhos Hoje",
      value: "R$ 124,50",
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Ganhos Mês",
      value: "R$ 3.450,00",
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Despesas Mês",
      value: "R$ 890,00",
      icon: TrendingDown,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      title: "Entregas Realizadas",
      value: "142",
      icon: Package,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Visão Geral</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta! Aqui está o resumo da sua frota.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-lg border border-border">
          <Calendar size={16} />
          <span>
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Grid de Cartões (Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-xs font-medium text-muted-foreground bg-accent px-2 py-1 rounded-full">
                  +2.5%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {stat.value}
              </h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Área de Gráficos e Listas (Placeholder) */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Gráfico Grande */}
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-border h-80 flex items-center justify-center text-muted-foreground">
          [Gráfico de Ganhos x Despesas será inserido aqui]
        </div>

        {/* Lista Recente */}
        <div className="bg-card p-6 rounded-2xl border border-border">
          <h3 className="font-bold text-lg mb-4 text-foreground">
            Últimas Entregas
          </h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-input rounded-full flex items-center justify-center">
                    <Package size={18} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      Entrega iFood #{1020 + i}
                    </p>
                    <p className="text-xs text-muted-foreground">Hoje, 14:30</p>
                  </div>
                </div>
                <span className="font-bold text-green-600">+R$ 12,50</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
