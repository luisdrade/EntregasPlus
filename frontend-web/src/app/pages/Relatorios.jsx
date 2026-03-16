import { useEffect, useState } from "react";
import React from "react";
import api from "../../services/api";
import { Calendar } from "lucide-react";

export function Relatorios() {
  const [periodo, setPeriodo] = useState("mes");
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    async function fetchEstatisticas() {
      try {
        setLoading(true);
        //
        const response = await api.get(
          `/api/relatorios/estatisticas/?periodo=${periodo}`,
        );
        setDados(response.data);
      } catch (error) {
        console.error("Erro ao buscar estatisticas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEstatisticas();
  }, [periodo]); // Recarrega sempre que o período mudar

  const formatarMoeda = (valor) => {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Resumo das suas finanças.</p>
        </div>

        {/* Filtro */}
        <select
          className="bg-card border border-border p-2 rounded-lg text-foreground outline-none cursor-pointer"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
        >
          <option value="semana">Últimos 7 dias</option>
          <option value="mes">Últimos 30 dias</option>
          <option value="ano">Este Ano</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground animate-pulse">
          Carregando dados financeiros...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card Lucro Líquido */}
          <div className="bg-primary p-6 rounded-2xl shadow-lg border border-primary">
            <p className="text-sm text-primary-foreground/80 mb-1">
              Lucro Líquido
            </p>
            <h3 className="text-3xl font-bold text-white">
              {formatarMoeda(dados?.lucroLiquido)}
            </h3>
          </div>

          {/* Card Ganhos */}
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <p className="text-sm text-muted-foreground mb-1">
              Total de Ganhos
            </p>
            <h3 className="text-2xl font-bold text-green-500">
              {formatarMoeda(dados?.totalGanhos)}
            </h3>
          </div>

          {/* Card Despesas */}
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <p className="text-sm text-muted-foreground mb-1">
              Total de Despesas
            </p>
            <h3 className="text-2xl font-bold text-red-500">
              {formatarMoeda(dados?.totalDespesas)}
            </h3>
          </div>

          {/* Card Entregas */}
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <p className="text-sm text-muted-foreground mb-1">
              Entregas Realizadas
            </p>
            <h3 className="text-2xl font-bold text-foreground">
              {dados?.totalEntregas || 0} pacotes
            </h3>
          </div>
        </div>
      )}

      {/* Mais tarde podemos adicionar aqui os Gráficos com Recharts! */}
      {!loading && dados && (
        <div className="bg-card p-6 rounded-2xl border border-border mt-8">
          <h3 className="font-bold text-lg mb-2">Informações Extras</h3>
          <p className="text-muted-foreground">
            Você já trabalhou <strong>{dados.diasTrabalhados} dias</strong>{" "}
            neste período selecionado.
          </p>
        </div>
      )}
    </div>
  );
}
