import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  DollarSign,
  TrendingDown,
  Calendar,
  Clock,
  Package,
  AlertCircle,
  FileText,
} from "lucide-react";
import api from "../../services/api";

export function Financeiro() {
  const [activeTab, setActiveTab] = useState("ganho");
  const [loading, setLoading] = useState(false);

  const [ganhoForm, setGanhoForm] = useState({
    data: new Date().toISOString().split("T")[0],
    hora_inicio: "08:00",
    hora_fim: "18:00",
    quantidade_entregues:"",
    quantidade_nao_entregues:"0",
    valor:"",
    tipo_pagamento:"por_entrega", // ou 'diaria', 'fixo'
  });

  const [despesaForm, setDespesaForm] = useState({
    data: new Date().toISOString().split("T")[0],
    tipo_despesa: "combustivel",
    descricao: "",
    valor: "",
  });

  // Enviar Ganho (Trabalho)
  const handleGanhoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ajuste o endpoint conforme o teu backend (ex: /registro-trabalho/)
      await api.post("financeiro/trabalho/", ganhoForm);
      alert("Dia de trabalho registrado com sucesso! 🚀");

      //Limpa os campos
      setGanhoForm({ ...ganhoForm, valor:"", quantidade_entregues:"", quantidade_nao_entregues:"" }); // Limpa campos principais
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar ganho. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  // Enviar Despesa
  const handleDespesaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/financeiro/despesa/", despesaForm);
      alert("Despesa registrada com sucesso! 💸");

      // Limpa os campos
      setDespesaForm({ ...despesaForm, valor: "", descricao: "" });
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar despesa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
        <p className="text-muted-foreground">
          Registre seus ganhos e despesas diárias.
        </p>
      </div>

      {/* Botões de Seleção */}
      <div className="flex gap-4 p-1 bg-card border border-border rounded-xl w-full md:w-fit">
        <button
          onClick={() => setActiveTab("ganho")}
          className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === "ganho"
              ? "bg-green-500 text-white shadow-md"
              : "text-muted-foreground hover:bg-accent"
          }`}
        >
          <DollarSign size={18} /> Registrar Ganho
        </button>
        <button
          onClick={() => setActiveTab("despesa")}
          className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === "despesa"
              ? "bg-red-500 text-white shadow-md"
              : "text-muted-foreground hover:bg-accent"
          }`}
        >
          <TrendingDown size={18} /> Registrar Despesa
        </button>
      </div>

      {/* FORMULÁRIO DE GANHOS */}
      {activeTab === "ganho" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 max-w-2xl"
        >
          <form onSubmit={handleGanhoSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Data
                </label>
                <input
                  type="date"
                  required
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none"
                  value={ganhoForm.data}
                  onChange={(e) =>
                    setGanhoForm({ ...ganhoForm, data: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Pagamento
                </label>
                <select
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none"
                  value={ganhoForm.tipo_pagamento}
                  onChange={(e) =>
                    setGanhoForm({
                      ...ganhoForm,
                      tipo_pagamento: e.target.value,
                    })
                  }
                >
                  <option value="por_entrega">Por Entrega</option>
                  <option value="diaria">Diária Fixa</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Entregas Sucesso
                </label>
                <input
                  type="number"
                  required
                  placeholder="Ex: 15"
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none"
                  value={ganhoForm.quantidade_entregues}
                  onChange={(e) =>
                    setGanhoForm({
                      ...ganhoForm,
                      quantidade_entregues: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Devoluções/Falhas
                </label>
                <input
                  type="number"
                  required
                  placeholder="Ex: 0"
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none"
                  value={ganhoForm.quantidade_nao_entregues}
                  onChange={(e) =>
                    setGanhoForm({
                      ...ganhoForm,
                      quantidade_nao_entregues: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Valor Total do Dia (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="150.50"
                className="w-full bg-input border-green-500/50 border-2 rounded-lg p-3 text-lg font-bold outline-none"
                value={ganhoForm.valor}
                onChange={(e) =>
                  setGanhoForm({ ...ganhoForm, valor: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all"
            >
              {loading ? "Salvando..." : "Salvar Ganho"}
            </button>
          </form>
        </motion.div>
      )}

      {/* FORMULÁRIO DE DESPESAS */}
      {activeTab === "despesa" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 max-w-2xl"
        >
          <form onSubmit={handleDespesaSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Data
                </label>
                <input
                  type="date"
                  required
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none"
                  value={despesaForm.data}
                  onChange={(e) =>
                    setDespesaForm({ ...despesaForm, data: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Categoria
                </label>
                <select
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none"
                  value={despesaForm.tipo_despesa}
                  onChange={(e) =>
                    setDespesaForm({
                      ...despesaForm,
                      tipo_despesa: e.target.value,
                    })
                  }
                >
                  <option value="combustivel">Combustível</option>
                  <option value="alimentacao">Alimentação</option>
                  <option value="manutencao">Manutenção</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Descrição (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Abastecimento Posto BR"
                className="w-full bg-input border border-border rounded-lg p-2.5 outline-none"
                value={despesaForm.descricao}
                onChange={(e) =>
                  setDespesaForm({ ...despesaForm, descricao: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Valor da Despesa (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="50.00"
                className="w-full bg-input border-red-500/50 border-2 rounded-lg p-3 text-lg font-bold outline-none"
                value={despesaForm.valor}
                onChange={(e) =>
                  setDespesaForm({ ...despesaForm, valor: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all"
            >
              {loading ? "Salvando..." : "Salvar Despesa"}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
