import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Package, Shield, LayoutDashboard, PlusCircle, ChevronRight, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'add-product', label: 'Add Product', icon: PlusCircle, path: '/admin/product/add' },
  ];

  const getCurrentPageTitle = () => {
    if (location.pathname === '/admin/dashboard') return 'Products';
    if (location.pathname === '/admin/product/add') return 'Add Product';
    if (location.pathname.startsWith('/admin/product/edit/')) return 'Edit Product';
    return 'Admin';
  };

  const isNavItemActive = (item) => {
    if (location.pathname === item.path) return true;
    if (item.id === 'dashboard' && location.pathname === '/admin/dashboard') return true;
    if (item.id === 'add-product' && location.pathname === '/admin/product/add') return true;
    if (item.id === 'add-product' && location.pathname.startsWith('/admin/product/edit/')) return true;
    return false;
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'admin-sidebar-collapsed' : ''}`}>
        <div className="admin-sidebar-header">
           <div className="admin-logo-icon">
              <Shield size={22} className="text-white" />
           </div>
           <div className="admin-logo-text flex flex-col">
              <h1 className="text-xl font-extrabold text-white tracking-tight leading-none">Admin<span className="text-blue-500">Hub</span></h1>
              <p className="admin-logo-sub text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Portal Central</p>
           </div>
           <button 
             className="sidebar-toggle-btn"
             onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
             aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
           >
             {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
           </button>
        </div>

        {/* Admin User Info */}
        <div className="admin-user-info">
          <div className="admin-avatar">A</div>
          <div className="admin-user-details">
            <span className="admin-user-name">Administrator</span>
            <span className="admin-role-badge">Admin</span>
          </div>
        </div>
        
        <div className="sidebar-divider"></div>
        
        <nav className="admin-sidebar-nav">
          {navItems.map(item => (
            <Link 
              key={item.id}
              to={item.path} 
              className={`admin-nav-item ${isNavItemActive(item) ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span className="admin-nav-label">{item.label}</span>
              {isNavItemActive(item) && <ChevronRight size={14} className="ml-auto opacity-60" />}
            </Link>
          ))}
        </nav>

        <div className="sidebar-divider"></div>

        <div className="admin-sidebar-footer">
          <button 
            onClick={handleLogout}
            className="admin-logout-btn"
          >
            <LogOut size={18} />
            <span className="admin-nav-label">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Breadcrumb / Page Title */}
        <div className="admin-content-header">
          <div className="admin-breadcrumb">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span>{getCurrentPageTitle()}</span>
          </div>
        </div>
        <div className="admin-main-inner animate-in fade-in slide-in-from-right-4 duration-500">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
