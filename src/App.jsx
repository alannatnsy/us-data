import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home.jsx';
import Data from './components/Data.jsx';
import LineChart from './components/Line.jsx';
import PieChart from './components/Pie.jsx';
import './App.css'

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data" element={<Data />} />
        <Route path="/line-chart" element={<LineChart />} />
        <Route path="/pie-chart" element={<PieChart />} />
      </Routes>
    </div>
  )
  
}

export default App
