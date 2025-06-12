
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
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 24px 32px 24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            <span style={{ color: '#ef4444' }}>TDA</span>
            <span style={{ color: '#333' }}>: HR</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav style={{ flex: 1, padding: '0 24px' }}>
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
                color: location.pathname === item.path ? '#ef4444' : '#6b7280',
                backgroundColor: 'transparent',
                borderRadius: '8px',
                borderLeft: location.pathname === item.path ? '3px solid #ef4444' : '3px solid transparent',
                fontSize: '14px',
                fontWeight: location.pathname === item.path ? '500' : '400'
              }}
            >
              <span style={{ marginRight: '12px', fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div style={{ padding: '24px' }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '12px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: '500'
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
          height: '80px',
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px'
        }}>
          {/* Logo (Mobile) */}
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            <span style={{ color: '#ef4444' }}>TDA</span>
            <span style={{ color: '#333' }}>: HR</span>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                placeholder="Search"
                style={{
                  padding: '10px 16px 10px 48px',
                  border: '1px solid #d1d5db',
                  borderRadius: '24px',
                  fontSize: '14px',
                  width: '300px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Language */}
            <select style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'white'
            }}>
              <option>English</option>
            </select>

            {/* Date */}
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#6b7280' }}>
              <div style={{ fontWeight: '500' }}>Tuesday</div>
              <div>13/05/2025</div>
            </div>

            {/* User Avatar */}
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#ef4444',
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
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
