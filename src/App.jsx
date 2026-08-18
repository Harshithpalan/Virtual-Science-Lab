import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ChemistryLab from './pages/ChemistryLab'
import PhysicsLab from './pages/PhysicsLab'
import BiologyLab from './pages/BiologyLab'
import AILab from './pages/AILab'
import './App.css'

function App() {
  const [aiMessages, setAiMessages] = useState([])

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chemistry" element={<ChemistryLab />} />
            <Route path="/physics" element={<PhysicsLab />} />
            <Route path="/biology" element={<BiologyLab />} />
            <Route path="/ai" element={<AILab messages={aiMessages} setMessages={setAiMessages} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
