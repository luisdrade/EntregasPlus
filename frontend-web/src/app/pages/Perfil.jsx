import React from "react";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Truck,
  Save,
  Plus,
  Shield,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from '../../services/api'

export function Perfil() {
  const [activeTab, setActiveTab] = useState("dados");
  const [loading, serLoading] = useState(false); // 'dados', 'seguranca', 'veiculos'

  // Estados dos Dados Pessoais
  const [userData, setUserData] = useState({
    nome: "",
    email: "",
    emailVerificado: false,
  });

  // Estados de Segurança (Senha)
  const [password, setPassword] = useState({
    atual: "",
    nova: "",
    confirmar: "",
  });

  // Estados dos Veículos
  const [veiculos, setVeiculos] = useState([]);
  const [novoVeiculo, setNovoVeiculo] = useState({
    tipo: "moto",
    placa: "",
    modelo: "",
    cor: "",
  });
  const [showAddVeiculo, setShowAddVeiculo] = useState(false);

  //? Carregar dados iniciais (Mockados até arrumarmos o backend)
  useEffect(() => {
    async function carregarDados() {
      try {
        //*Puxar os dados do usuario atual
        const respUser = await api.get("/user/");
        setUserData({
          nome: respUser.data.nome || "Entregador Parceiro",
          email: respUser.data.email || "Carregando...",
          emailVerificado: true,
        });
        //*Puxar veiculos
        const respVeiculos = await api.get("/veiculos/");
        setVeiculos(respVeiculos.data.results);
      } catch (error) {
        console.error("Erro ao carregar Perfil:", error);
      }
    }
    carregarDados();
  }, []);

  const handleSalvarDados = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/user/", { nome: userData.nome });
      alert("Dados atualizados com sucesso !!");
    } catch (error) {
      alert("Error ao atualizar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleAlterarSenha = async (e) => {
    e.preventDefault();
    if (password.nova !== password.confirmar) {
      alert("As novas senhas não coicidem!");
      return;
    }
    setLoading(true);
    try {
      await api.post("/user/change-password/", password);
      alert("Senha alterada com sucesso!!");
      setPassword({ atual: "", nova: "", confirmar: "" });
    } catch (error) {
      alert("Erro ao alterar senha");
    } finally {
      setLoading(false);
    }
  };

  const handleCadastrarVeiculo = async (e) => {
    e.preventDefault();
    serLoading(true);
    try {
      await api.post("/veiculos/", novoVeiculo);
      alert("Veiculo cadastrado com sucesso");
      setShowAddVeiculo(false);
      // Recarregar veículos aqui
    } catch (error) {
      alert("Erro ao cadastrar Veiculo.");
    } finally {
      serLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações, segurança e frota.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* MENU LATERAL DE ABAS */}
        <div className="w-full md:w-64 space-y-2">
          <button
            onClick={() => setActiveTab("dados")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
              activeTab === "dados"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-card hover:shadow-sm border border-transparent"
            }`}
          >
            <User size={18} /> Dados Pessoais
          </button>

          <button
            onClick={() => setActiveTab("seguranca")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
              activeTab === "seguranca"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-card hover:shadow-sm border border-transparent"
            }`}
          >
            <Shield size={18} /> Segurança
          </button>

          <button
            onClick={() => setActiveTab("veiculos")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
              activeTab === "veiculos"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-card hover:shadow-sm border border-transparent"
            }`}
          >
            <Truck size={18} /> Meus Veículos
          </button>
        </div>

        {/* CONTEÚDO DAS ABAS */}
        <div className="flex-1 bg-card border border-border rounded-2xl p-6 shadow-sm min-h-[400px]">
          {/* ABA 1: DADOS PESSOAIS */}
          {activeTab === "dados" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6">
                <User className="text-primary" /> Informações Pessoais
              </h2>

              <form onSubmit={handleSalvarDados} className="space-y-4 max-w-md">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={userData.nome}
                    onChange={(e) =>
                      setUserData({ ...userData, nome: e.target.value })
                    }
                    className="w-full bg-input/50 border border-input rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    E-mail
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      disabled
                      value={userData.email}
                      className="w-full bg-input/30 border border-input rounded-lg p-2.5 outline-none text-muted-foreground cursor-not-allowed"
                    />
                    {userData.emailVerificado ? (
                      <span
                        title="E-mail Verificado"
                        className="p-2.5 bg-green-500/10 text-green-600 rounded-lg flex items-center gap-1 text-sm font-medium"
                      >
                        <CheckCircle size={18} /> Verificado
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="p-2.5 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
                      >
                        <AlertCircle size={18} /> Verificar
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    O e-mail é usado para o seu login e não pode ser alterado
                    aqui.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-primary-foreground font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity mt-4"
                >
                  {loading ? (
                    "Salvando..."
                  ) : (
                    <>
                      <Save size={18} /> Salvar Alterações
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* ABA 2: SEGURANÇA */}
          {activeTab === "seguranca" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6">
                <Lock className="text-primary" /> Alterar Senha
              </h2>

              <form
                onSubmit={handleAlterarSenha}
                className="space-y-4 max-w-md"
              >
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    required
                    value={passwords.atual}
                    onChange={(e) =>
                      setPasswords({ ...passwords, atual: e.target.value })
                    }
                    className="w-full bg-input/50 border border-input rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    required
                    value={passwords.nova}
                    onChange={(e) =>
                      setPasswords({ ...passwords, nova: e.target.value })
                    }
                    className="w-full bg-input/50 border border-input rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    required
                    value={passwords.confirmar}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirmar: e.target.value })
                    }
                    className="w-full bg-input/50 border border-input rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-foreground text-background font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity mt-4"
                >
                  {loading ? "Atualizando..." : "Atualizar Senha"}
                </button>
              </form>
            </motion.div>
          )}

          {/* ABA 3: VEÍCULOS */}
          {activeTab === "veiculos" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Truck className="text-primary" /> Minha Frota
                </h2>
                <button
                  onClick={() => setShowAddVeiculo(!showAddVeiculo)}
                  className="bg-primary/10 text-primary hover:bg-primary/20 font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus size={18} /> Adicionar Veículo
                </button>
              </div>

              {/* Formulário de Adicionar Veículo */}
              <AnimatePresence>
                {showAddVeiculo && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleCadastrarVeiculo}
                    className="bg-accent/30 border border-border rounded-xl p-5 space-y-4 overflow-hidden mb-6"
                  >
                    <h3 className="font-semibold text-foreground mb-2">
                      Novo Veículo
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground block mb-1">
                          Tipo
                        </label>
                        <select
                          className="w-full bg-card border border-input rounded-lg p-2 outline-none"
                          value={novoVeiculo.tipo}
                          onChange={(e) =>
                            setNovoVeiculo({
                              ...novoVeiculo,
                              tipo: e.target.value,
                            })
                          }
                        >
                          <option value="moto">Moto</option>
                          <option value="carro">Carro</option>
                          <option value="bicicleta">Bicicleta</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground block mb-1">
                          Placa
                        </label>
                        <input
                          type="text"
                          placeholder="ABC-1234"
                          required
                          className="w-full bg-card border border-input rounded-lg p-2 outline-none uppercase"
                          value={novoVeiculo.placa}
                          onChange={(e) =>
                            setNovoVeiculo({
                              ...novoVeiculo,
                              placa: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground block mb-1">
                          Modelo
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Honda CG 160"
                          required
                          className="w-full bg-card border border-input rounded-lg p-2 outline-none"
                          value={novoVeiculo.modelo}
                          onChange={(e) =>
                            setNovoVeiculo({
                              ...novoVeiculo,
                              modelo: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground block mb-1">
                          Cor
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Vermelha"
                          className="w-full bg-card border border-input rounded-lg p-2 outline-none"
                          value={novoVeiculo.cor}
                          onChange={(e) =>
                            setNovoVeiculo({
                              ...novoVeiculo,
                              cor: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddVeiculo(false)}
                        className="px-4 py-2 text-muted-foreground hover:bg-accent rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Salvar Veículo
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Lista de Veículos */}
              <div className="space-y-3">
                {veiculos.length > 0 ? (
                  veiculos.map((v, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-background border border-border rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Truck className="text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground capitalize">
                            {v.modelo} ({v.cor})
                          </p>
                          <p className="text-sm text-muted-foreground uppercase">
                            {v.tipo} • Placa: {v.placa}
                          </p>
                        </div>
                      </div>
                      <button
                        title="Remover"
                        className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 border-2 border-dashed border-border rounded-xl text-muted-foreground">
                    <Truck size={40} className="mx-auto mb-3 opacity-20" />
                    <p>Você ainda não tem veículos cadastrados.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
