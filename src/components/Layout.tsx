
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const sidebarItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/employee', label: 'Employee', icon: '👤' },
    { path: '/worklog', label: 'Work Log', icon: '📋' },
    { path: '/payroll', label: 'Payroll', icon: '💰' },
    { path: '/expense-income', label: 'Expense & Income', icon: '📊' },
    { path: '/reports', label: 'Reports', icon: '📈' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: '#f8f9fa',
        borderRight: '1px solid #e9ecef',
        padding: '20px 0'
      }}>
        {/* Sidebar Navigation */}
        <nav style={{ padding: '0 20px' }}>
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                marginBottom: '8px',
                textDecoration: 'none',
                color: location.pathname === item.path ? '#dc3545' : '#6c757d',
                backgroundColor: location.pathname === item.path ? '#fff5f5' : 'transparent',
                borderRadius: '8px',
                borderLeft: location.pathname === item.path ? '3px solid #dc3545' : '3px solid transparent',
                fontSize: '14px'
              }}
            >
              <span style={{ marginRight: '12px', fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            <LogOut size={16} style={{ marginRight: '8px' }} />
            Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <header style={{
          height: '70px',
          backgroundColor: 'white',
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px'
        }}>
          {/* Logo */}
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            <span style={{ color: '#dc3545' }}>TDA</span>
            <span style={{ color: '#333' }}>: HR</span>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d'
              }} />
              <input
                type="text"
                placeholder="Search"
                style={{
                  padding: '8px 12px 8px 40px',
                  border: '1px solid #e9ecef',
                  borderRadius: '20px',
                  fontSize: '14px',
                  width: '200px'
                }}
              />
            </div>

            {/* Language */}
            <select style={{
              padding: '6px 12px',
              border: '1px solid #e9ecef',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              <option>English</option>
            </select>

            {/* Date */}
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#6c757d' }}>
              <div>Tuesday</div>
              <div>13/05/2025</div>
            </div>

            {/* User Avatar */}
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#dc3545',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <User size={20} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1,
          backgroundColor: '#f8f9fa',
          padding: '24px'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
