import CountryList from './components/CountryList'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🌍 Apollo Client Demo</h1>
        <p>Explore countries around the world using GraphQL and Apollo Client</p>
      </header>
      <main>
        <CountryList />
      </main>
    </div>
  )
}

export default App
