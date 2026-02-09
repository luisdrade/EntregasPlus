function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-dark-900">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-primary-500">
          Entregas Plus <span className="text-white">SaaS</span>
        </h1>
        <p className="text-gray-400 text-xl">
          O teu sistema profissional está pronto para começar. 🚀
        </p>
        
        <div className="p-6 bg-dark-800 rounded-lg border border-dark-700 mt-8">
          <p className="text-sm text-gray-300">
            Backend: <span className="text-green-400 font-mono">Conectado (em breve)</span>
          </p>
          <p className="text-sm text-gray-300">
            Frontend: <span className="text-blue-400 font-mono">Vite + React + Tailwind</span>
          </p>
        </div>

        <button className="px-6 py-3 bg-primary-500 hover:bg-violet-700 transition-colors rounded-full font-bold mt-4">
          Entrar no Sistema
        </button>
      </div>
    </div>
  )
}

export default App