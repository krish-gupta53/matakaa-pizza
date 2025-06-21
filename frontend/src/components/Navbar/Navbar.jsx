import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    setToken("");
    navigate('/');
    setMobileMenuOpen(false);
  }

  const handleMenuClick = (menuItem) => {
    setMenu(menuItem);
    setMobileMenuOpen(false);
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  return (
    <div className='navbar'>
      <Link to='/home' className="navbar-logo">
        <img src={assets.logo} alt="logo" className="logo-img" />
        <h6>Matakaa Pizza</h6>
      </Link>
      
      {/* Desktop Menu */}
      <ul className="navbar-menu">
        <Link to="/home" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>home</Link>
        <a href='#food-display' onClick={() => setMenu("menu")} className={`${menu === "menu" ? "active" : ""}`}>menu</a>
        <a href='#footer' onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>contact us</a>
      </ul>
      
      {/* Mobile Menu Toggle */}
      <div className="navbar-mobile-toggle" onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      {/* Mobile Menu */}
      <ul className={`navbar-mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="navbar-mobile-close" onClick={toggleMobileMenu}>×</div>
        <li onClick={() => handleMenuClick("home")} className={`${menu === "home" ? "active" : ""}`}>
          <Link to="/home">Home</Link>
        </li>
        <li onClick={() => handleMenuClick("menu")} className={`${menu === "menu" ? "active" : ""}`}>
          <a href='#food-display'>Menu</a>
        </li>
        <li onClick={() => handleMenuClick("contact")} className={`${menu === "contact" ? "active" : ""}`}>
          <a href='#footer'>Contact Us</a>
        </li>
        <li onClick={() => navigate('/myorders')}>
          <Link to='/myorders'>My Orders</Link>
        </li>
        <li onClick={logout}>
          Logout
        </li>
      </ul>
      
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <Link to='/cart' className='navbar-search-icon'>
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>
        <div className='navbar-profile'>
          <img src={assets.profile_icon} alt="" />
          <ul className='navbar-profile-dropdown'>
            <li onClick={() => navigate('/myorders')}>
              <img src={assets.bag_icon} alt="" />
              <p>My Orders</p>
            </li>
            <hr />
            <li onClick={logout}>
              <img src={assets.logout_icon} alt="" />
              <p>Logout</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
