import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Settings, HelpCircle } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="app-name">FernandoGravity</h1>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          <p className="nav-label">Menu</p>
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <CheckSquare size={20} />
            <span>Minhas Tarefas</span>
          </NavLink>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="footer-links">
          <button className="footer-link">
            <Settings size={18} />
            <span>Configurações</span>
          </button>
          <button className="footer-link">
            <HelpCircle size={18} />
            <span>Ajuda & Suporte</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
