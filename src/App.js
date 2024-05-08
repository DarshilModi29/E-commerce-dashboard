import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Brands from './pages/Brands';
import Categories from './pages/Categories';
import SubCategories from './pages/SubCategories';
import Product from './pages/Product';
import Order from './pages/Order';
import OrderDetails from './pages/OrderDetails';
import User from './pages/User';
import Variation from './pages/Variation';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/categories' element={<Categories />} />
          <Route path='/subcategory' element={<SubCategories />} />
          <Route path='/brands' element={<Brands />} />
          <Route path='/variation' element={<Variation />} />
          <Route path='/products' element={<Product />} />
          <Route path='/orders' element={<Order />} />
          <Route path='/orderDetails' element={<OrderDetails />} />
          <Route path='/changepassword' element={<ChangePassword />} />
          <Route path='/forgotpassword' element={<ForgotPassword />} />
          <Route path='/users' element={<User />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
