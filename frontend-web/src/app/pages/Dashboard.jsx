import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Package,
  Receipt
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";

export function Dashboard() {
  const [statsData, setStatsData] = useState(null);
  const [ultimasEntregas, setUltimasEntregas] = useState([]);
  const [ultimasDespesas, setUltimasDespesas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Função para formatar dinheiro (Reais)
  const formatarMoeda = (valor) => {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Função para formatar a data de forma amigável
  const formatarData = (dataString) => {
    if (!dataString) return "";
    return new Date(dataString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short"
    });
  };

  useEffect(() => {
    async function carregarDashboard(params) {
      try {
        setLoading(true);

        const respStas = await api.get("/api/relatorios/estatisticas/?periodo=mes");
        setStatsData(respStas.data);

        // 2. Pega os trabalhos/entregas com verificação de segurança
        const respTrabalhos = await api.get("/api/financeiro/trabalho/");
        // Descobre se é uma lista direta ou se está dentro de ".results"
        const arrayEntregas = Array.isArray(respTrabalhos.data) 
          ? respTrabalhos.data 
          : (respTrabalhos.data?.results || []);        
        setUltimasEntregas(arrayEntregas.slice(0, 4));

        // 3. Pega as despesas com verificação de segurança
        const respDespesas = await api.get("/api/financeiro/despesa/");
        const arrayDespesas = Array.isArray(respDespesas.data) 
          ? respDespesas.data 
          : (respDespesas.data?.results || []);
        setUltimasDespesas(arrayDespesas.slice(0,4));

      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
      } finally {
        setLoading(false);
      }
    }
    carregarDashboard();
  }, []);

  const stats = [
    {
      title: "Lucro Líquido (Mês)",
      value: formatarMoeda(statsData?.lucroLiquido),
      icon: DollarSign,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Ganhos (Mês)",
      value: formatarMoeda(statsData?.totalGanhos),
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Despesas (Mês)",
      value: formatarMoeda(statsData?.totalDespesas),
      icon: TrendingDown,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      title: "Total de Pacotes (Mês)",
      value: statsData?.totalEntregas || 0,
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
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {stat.value}
              </h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Área de Gráficos e Listas */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Gráfico Grande (Ocupa 2 colunas) */}
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-border h-80 flex items-center justify-center text-muted-foreground">
          [Gráfico de Ganhos x Despesas será inserido aqui]
        </div>

        {/* Listas Recentes (Ocupa 1 coluna, empilhadas) */}
        <div className="space-y-6">
          
          {/* ÚLTIMAS ENTREGAS */}
          <div className="bg-card p-6 rounded-2xl border border-border">
            <h3 className="font-bold text-lg mb-4 text-foreground">
              Últimas Entregas
            </h3>
            <div className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground text-center py-4">A carregar...</p>
              ) : ultimasEntregas.length > 0 ? (
                ultimasEntregas.map((entrega) => (
                  <div key={entrega.id} className="flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                        <Package size={18} className="text-green-600" />
                      </div>
                      <div>
                        {/* Assumindo que o teu modelo de Trabalho tem "descricao" e "data" */}
                        <p className="font-medium text-sm text-foreground line-clamp-1">
                          {entrega.descricao || 'Entrega'}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatarData(entrega.data)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-green-600">+{formatarMoeda(entrega.valor)}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-input/20 rounded-xl">
                  <p className="text-sm text-muted-foreground">Ainda sem entregas registadas.</p>
                </div>
              )}
            </div>
          </div>

          {/* ÚLTIMAS DESPESAS */}
          <div className="bg-card p-6 rounded-2xl border border-border">
            <h3 className="font-bold text-lg mb-4 text-foreground">
              Últimas Despesas
            </h3>
            <div className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground text-center py-4">A carregar...</p>
              ) : ultimasDespesas.length > 0 ? (
                ultimasDespesas.map((despesa) => (
                  <div key={despesa.id} className="flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                        <TrendingDown size={18} className="text-red-600" />
                      </div>
                      <div>
                        {/* Assumindo que o teu modelo de Despesa tem "descricao" e "data" */}
                        <p className="font-medium text-sm text-foreground line-clamp-1">
                          {despesa.descricao || 'Despesa'}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatarData(despesa.data)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-red-600">-{formatarMoeda(despesa.valor)}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-input/20 rounded-xl">
                  <p className="text-sm text-muted-foreground">Ainda sem despesas registadas.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
