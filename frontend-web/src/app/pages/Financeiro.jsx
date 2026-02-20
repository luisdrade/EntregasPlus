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

  const [ganhoForm, setGanhoform] = useState({
    data: new Date().toISOString().split("T")[0],
    hora_inicio: "08:00",
    hora_fim: "18:00",
    quantidade_entregues: "",
    quantidade_nao_entregues: "0",
    valor: "",
    tipo_pagamento: "por_entrega", // ou 'diaria', 'fixo'
  });

  const[despesaForm, setDespesaForm] = useState({
    data: new Date().toISOString().split('T')[0],
    tipo_despesa: 'combustivel',
    descricao: '',
    valor: ''
  });

  // Enviar Ganho (Trabalho)
  const handleGanhoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ajuste o endpoint conforme o teu backend (ex: /registro-trabalho/)
      await api.post('/registro/api/registro-trabalho/', ganhoForm);
      alert('Dia de trabalho registrado com sucesso! 🚀');
      setGanhoForm({ ...ganhoForm, valor: '', quantidade_entregues: '' }); // Limpa campos principais
    } catch (error) {
      console.error(error);
      alert('Erro ao registrar ganho. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  // Enviar Despesa
  const handleDespesaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/registro/api/registro-despesa/', despesaForm);
      alert('Despesa registrada com sucesso! 💸');
      setDespesaForm({ ...despesaForm, valor: '', descricao: '' });
    } catch (error) {
      console.error(error);
      alert('Erro ao registrar despesa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground">Registe seus ganhos e controle suas despesas.</p>
        </div>
      </div>

      {/* TABS DE SELEÇÃO */}
      <div className="flex gap-4 p-1 bg-card border border-border rounded-xl w-full md:w-fit">
        <button
          onClick={() => setActiveTab('ganho')}
          className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'ganho' 
              ? 'bg-green-500 text-white shadow-md' 
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <DollarSign size={18} /> Registrar Ganho
        </button>
        <button
          onClick={() => setActiveTab('despesa')}
          className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'despesa' 
              ? 'bg-red-500 text-white shadow-md' 
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <TrendingDown size={18} /> Registrar Despesa
        </button>
      </div>

      {/* FORMULÁRIO DE GANHO */}
      {activeTab === 'ganho' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm max-w-2xl"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-green-600">
            <DollarSign /> Novo Dia de Trabalho
          </h2>
          
          <form onSubmit={handleGanhoSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Data</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
                  <input 
                    type="date" 
                    required
                    className="w-full bg-input/50 border border-input rounded-lg pl-10 p-2.5 text-foreground focus:ring-2 focus:ring-green-500/20 outline-none"
                    value={ganhoForm.data}
                    onChange={e => setGanhoForm({...ganhoForm, data: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Tipo de Pagamento</label>
                <select 
                  className="w-full bg-input/50 border border-input rounded-lg p-2.5 text-foreground outline-none"
                  value={ganhoForm.tipo_pagamento}
                  onChange={e => setGanhoForm({...ganhoForm, tipo_pagamento: e.target.value})}
                >
                  <option value="por_entrega">Por Entrega</option>
                  <option value="diaria">Diária Fixa</option>
                  <option value="por_hora">Por Hora</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Início</label>
                <input 
                  type="time" 
                  required
                  className="w-full bg-input/50 border border-input rounded-lg p-2.5 text-foreground outline-none"
                  value={ganhoForm.hora_inicio}
                  onChange={e => setGanhoForm({...ganhoForm, hora_inicio: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Fim</label>
                <input 
                  type="time" 
                  required
                  className="w-full bg-input/50 border border-input rounded-lg p-2.5 text-foreground outline-none"
                  value={ganhoForm.hora_fim}
                  onChange={e => setGanhoForm({...ganhoForm, hora_fim: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Entregas Feitas</label>
                <div className="relative">
                  <Package className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
                  <input 
                    type="number" 
                    placeholder="0"
                    required
                    className="w-full bg-input/50 border border-input rounded-lg pl-10 p-2.5 text-foreground outline-none"
                    value={ganhoForm.quantidade_entregues}
                    onChange={e => setGanhoForm({...ganhoForm, quantidade_entregues: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Não Entregues</label>
                <div className="relative">
                  <AlertCircle className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
                  <input 
                    type="number" 
                    placeholder="0"
                    className="w-full bg-input/50 border border-input rounded-lg pl-10 p-2.5 text-foreground outline-none"
                    value={ganhoForm.quantidade_nao_entregues}
                    onChange={e => setGanhoForm({...ganhoForm, quantidade_nao_entregues: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Valor Total Recebido (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-green-600 font-bold">R$</span>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0,00"
                  required
                  className="w-full bg-input/50 border border-green-500/30 rounded-lg pl-10 p-2.5 text-foreground font-bold text-lg focus:ring-2 focus:ring-green-500/20 outline-none"
                  value={ganhoForm.valor}
                  onChange={e => setGanhoForm({...ganhoForm, valor: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Salvando...' : <><Save size={20} /> Registrar Ganho</>}
            </button>
          </form>
        </motion.div>
      )}

      {/* FORMULÁRIO DE DESPESA */}
      {activeTab === 'despesa' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm max-w-2xl"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-500">
            <TrendingDown /> Nova Despesa
          </h2>
          
          <form onSubmit={handleDespesaSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Data</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
                  <input 
                    type="date" 
                    required
                    className="w-full bg-input/50 border border-input rounded-lg pl-10 p-2.5 text-foreground outline-none"
                    value={despesaForm.data}
                    onChange={e => setDespesaForm({...despesaForm, data: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Categoria</label>
                <select 
                  className="w-full bg-input/50 border border-input rounded-lg p-2.5 text-foreground outline-none"
                  value={despesaForm.tipo_despesa}
                  onChange={e => setDespesaForm({...despesaForm, tipo_despesa: e.target.value})}
                >
                  <option value="combustivel">⛽ Combustível</option>
                  <option value="alimentacao">🍔 Alimentação</option>
                  <option value="manutencao">🔧 Manutenção</option>
                  <option value="pedagio">🚧 Pedágio</option>
                  <option value="seguro">🛡️ Seguro</option>
                  <option value="outros">📝 Outros</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Descrição</label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Ex: Abastecimento Posto X"
                  required
                  className="w-full bg-input/50 border border-input rounded-lg pl-10 p-2.5 text-foreground outline-none"
                  value={despesaForm.descricao}
                  onChange={e => setDespesaForm({...despesaForm, descricao: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Valor da Despesa (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-red-500 font-bold">R$</span>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0,00"
                  required
                  className="w-full bg-input/50 border border-red-500/30 rounded-lg pl-10 p-2.5 text-foreground font-bold text-lg focus:ring-2 focus:ring-red-500/20 outline-none"
                  value={despesaForm.valor}
                  onChange={e => setDespesaForm({...despesaForm, valor: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Salvando...' : <><Save size={20} /> Registrar Despesa</>}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
