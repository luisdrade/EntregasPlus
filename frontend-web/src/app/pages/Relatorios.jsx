import { useEffect, useState } from "react";
import React from "react";
import api from "../../services/api";
import { Calendar, Trash2, Edit2, TrendingUp, TrendingDown } from "lucide-react";

export function Relatorios() {
  const [periodo, setPeriodo] = useState("mes");
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(null);

  const [historicoGanhos, setHistoricoGanhos] = useState([]);
  const [historicoDespesas, setHistoricoDespesas] = useState([]);

  //States para o POP-UP
  const [isModalOpen, setIsModalOpen] = useState (false);
  const [tipoEdicao, setTipoEdicao] = useState(""); // 'ganho' ou 'despesa'
  const [itemEmEdicao, setItemEmEdicao] = useState(null); // Guarda os dados do form
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  const carregarDados = async () => {

    try{
      setLoading(true);

      //Busca lista geral
      const responseStates = await api.get(`/api/relatorios/estatisticas/?periodo=${periodo}`);
      setDados(responseStates.data);

      // usca a lista de ganhos
      // Nota: Se o teu backend suportar filtro aqui, podes usar /api/financeiro/trabalho/?periodo=${periodo}
      const respGanhos = await api.get("/api/financeiro/trabalho/");
      const arrayGanhos = Array.isArray(respGanhos.data) ? respGanhos.data : (respGanhos.data?.results || []);
      setHistoricoGanhos(arrayGanhos);

      // Busca a lista de despesas
      const respDespesas = await api.get("/api/financeiro/despesa/");
      const arrayDespesas = Array.isArray(respDespesas.data) ? respDespesas.data : (respDespesas.data?.results || []);
      setHistoricoDespesas(arrayDespesas);
    } catch (error){
      console.error("erro ao Buscar dados", error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [periodo]); // Recarrega sempre que o período mudar

  //Formatar moeda
  const formatarMoeda = (valor) => {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  //Formatar Data
  const formatarData = (dataString) => {
    if (!dataString) return "";
    return new Date(dataString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  //Excluir item
  const excluirItem = async (id, tipo) =>{
    if (!window.confirm("Tem a certeza que deseja excluir este registo? Esta ação não pode ser desfeita.")) return;  

    try {
      if (tipo === 'ganho'){
        await api.delete(`/api/financeiro/trabalho/${id}/`)
      }else{
        await api.delete(`/api/financeiro/trabalho/${id}/`)
      }
      alert("Registro Excluido com sucesso!");
      carregarDados(); //Recarrega a lista 
    } catch (error){
      console.error("Erro ao excluir", error);
      alert("Erro ao excluir o registro.");
    }
  };

  //Função Editar
  const editarItem = (item, tipo) => {
    console.log("Quer editar:", item);
    alert("Botão de editar clicado! Vamos fazer um pop-up para isto a seguir.");  
  };


  //?FUnções do POP-UP
  
  //abre o pop-up
  const abrirModalEdicao = (item, tipo) => {
    setTipoEdicao(tipo);
    //isso faz uma copia dos dados, e não altera até ser salvo
    setItemEmEdicao({ ...item});
    setIsModalOpen(true);
  };

  const handleSalvarEdicao = async (e) =>{
    e.preventDefault();
    serSalvarEdicao(true);
    try{
      if (tipoEdicao === 'ganho') {
        await api.put(`/api/financeiro/trabalho/${itemEmEdicao.id}/`, itemEmEdicao);
      } else {
        await api.put(`/api/financeiro/despesa/${itemEmEdicao.id}`, itemEmEdicao);
      }
      alert("Atualizado com sucesso!");
      setIsModalOpen(False); // fecha
      carregarDados(); //Recarrega os dados 
    } catch(error){
      console.error("Erro ao atualizar", error);
      alert("Erro ao salvar as alterações.");
    } finally{
      serSalvandoEdicao(false);
    }
  };

return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">Resumo e extrato detalhado das suas finanças.</p>
        </div>
        <select
          className="bg-card border border-border p-2 rounded-lg text-foreground outline-none cursor-pointer shadow-sm"
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
          A carregar dados financeiros...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-primary p-6 rounded-2xl shadow-lg border border-primary">
              <p className="text-sm text-primary-foreground/80 mb-1">Lucro Líquido</p>
              <h3 className="text-3xl font-bold text-white">{formatarMoeda(dados?.lucroLiquido)}</h3>
            </div>
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
              <p className="text-sm text-muted-foreground mb-1">Total de Ganhos</p>
              <h3 className="text-2xl font-bold text-green-500">{formatarMoeda(dados?.totalGanhos)}</h3>
            </div>
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
              <p className="text-sm text-muted-foreground mb-1">Total de Despesas</p>
              <h3 className="text-2xl font-bold text-red-500">{formatarMoeda(dados?.totalDespesas)}</h3>
            </div>
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
              <p className="text-sm text-muted-foreground mb-1">Entregas Realizadas</p>
              <h3 className="text-2xl font-bold text-foreground">{dados?.totalEntregas || 0} pacotes</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                <TrendingUp size={20} className="text-green-500" /> Histórico de Ganhos
              </h3>
              <div className="space-y-3">
                {historicoGanhos.length > 0 ? historicoGanhos.map((ganho) => (
                  <div key={ganho.id} className="flex justify-between items-center p-3 bg-input/20 hover:bg-input/40 transition-colors rounded-lg border border-border/50">
                    <div>
                      <p className="font-bold text-sm text-foreground">{formatarData(ganho.data)}</p>
                      <p className="text-xs text-muted-foreground">{ganho.quantidade_entregues || 0} entregas</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-green-500">+{formatarMoeda(ganho.valor)}</span>
                      <div className="flex gap-2">
                        <button onClick={() => abrirModalEdicao(ganho, 'ganho')} className="p-1.5 bg-card border border-border rounded-md text-blue-500 hover:bg-blue-500 hover:text-white transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => excluirItem(ganho.id, 'ganho')} className="p-1.5 bg-card border border-border rounded-md text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground text-center py-4">Nenhum ganho registado.</p>}
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                <TrendingDown size={20} className="text-red-500" /> Histórico de Despesas
              </h3>
              <div className="space-y-3">
                {historicoDespesas.length > 0 ? historicoDespesas.map((despesa) => (
                  <div key={despesa.id} className="flex justify-between items-center p-3 bg-input/20 hover:bg-input/40 transition-colors rounded-lg border border-border/50">
                    <div>
                      <p className="font-bold text-sm text-foreground">{formatarData(despesa.data)}</p>
                      <p className="text-xs text-muted-foreground">{despesa.descricao || despesa.tipo_despesa}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-red-500">-{formatarMoeda(despesa.valor)}</span>
                      <div className="flex gap-2">
                        <button onClick={() => abrirModalEdicao(despesa, 'despesa')} className="p-1.5 bg-card border border-border rounded-md text-blue-500 hover:bg-blue-500 hover:text-white transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => excluirItem(despesa.id, 'despesa')} className="p-1.5 bg-card border border-border rounded-md text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground text-center py-4">Nenhuma despesa registada.</p>}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================== */}
      {/* O NOSSO POP-UP MODERNO DE EDIÇÃO */}
      {/* ========================================== */}
      {isModalOpen && itemEmEdicao && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Botão Fechar (X) */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-muted-foreground hover:bg-input/50 hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
              {tipoEdicao === 'ganho' ? <TrendingUp className="text-green-500"/> : <TrendingDown className="text-red-500"/>}
              Editar {tipoEdicao === 'ganho' ? 'Ganho' : 'Despesa'}
            </h2>

            <form onSubmit={handleSalvarEdicao} className="space-y-4">
              
              {/* CAMPO: DATA (Comum aos dois) */}
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Data</label>
                <input
                  type="date"
                  required
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none text-foreground"
                  value={itemEmEdicao.data}
                  onChange={(e) => setItemEmEdicao({...itemEmEdicao, data: e.target.value})}
                />
              </div>

              {/* CAMPOS ESPECÍFICOS DE GANHO */}
              {tipoEdicao === 'ganho' && (
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Entregas Sucesso</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-input border border-border rounded-lg p-2.5 outline-none text-foreground"
                    value={itemEmEdicao.quantidade_entregues}
                    onChange={(e) => setItemEmEdicao({...itemEmEdicao, quantidade_entregues: e.target.value})}
                  />
                </div>
              )}

              {/* CAMPOS ESPECÍFICOS DE DESPESA */}
              {tipoEdicao === 'despesa' && (
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Descrição</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-input border border-border rounded-lg p-2.5 outline-none text-foreground"
                    value={itemEmEdicao.descricao}
                    onChange={(e) => setItemEmEdicao({...itemEmEdicao, descricao: e.target.value})}
                  />
                </div>
              )}

              {/* CAMPO: VALOR (Comum aos dois, mas muda a cor da borda!) */}
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Valor Total (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className={`w-full bg-input border-2 rounded-lg p-3 text-lg font-bold outline-none text-foreground ${tipoEdicao === 'ganho' ? 'border-green-500/50 focus:border-green-500' : 'border-red-500/50 focus:border-red-500'}`}
                  value={itemEmEdicao.valor}
                  onChange={(e) => setItemEmEdicao({...itemEmEdicao, valor: e.target.value})}
                />
              </div>

              {/* BOTÃO SALVAR */}
              <button
                type="submit"
                disabled={salvandoEdicao}
                className={`w-full font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 text-white ${tipoEdicao === 'ganho' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} disabled:opacity-50`}
              >
                {salvandoEdicao ? "A guardar..." : <><Save size={20}/> Salvar Alterações</>}
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
