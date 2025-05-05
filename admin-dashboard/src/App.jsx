import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard/Dashboard';
import MainPage from './components/Users/MainPage';
import MainPageSP from './components/Providers/MainPageSP';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<MainPage />} />
        <Route path="/providers" element={<MainPageSP />} />
      </Routes>
    </Router>
  );
}

export default App;