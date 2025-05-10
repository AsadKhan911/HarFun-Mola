import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard/Dashboard';
import MainPage from './components/Users/MainPage';
import ServiceProvider from './components/Providers/MainPageSP';
import Categories from './components/Categories/MainScreen'
import CategoryDetails from './components/Categories/categoryDetails';
import Listings from './components/Listings/MainPage'
import Bookings from './components/Bookings/MainScreen'
import Payments from './components/Payments/MainScreen'
import Settings from './components/Settings/MainScreen'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<MainPage />} />
        <Route path="/providers" element={<ServiceProvider />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category-details" element={<CategoryDetails />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;