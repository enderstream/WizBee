import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/HamburgerMenu.css';

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="hamburger-menu-container">
      <button 
        className={`hamburger-button ${isOpen ? 'open' : ''}`} 
        onClick={toggleMenu}
      >
        <div className="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {isOpen && (
        <div className="menu-overlay" onClick={() => setIsOpen(false)}>
          <div className="menu-content" onClick={e => e.stopPropagation()}>
            <ul>
              {user ? (
                <>
                  <li>
                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                      프로필
                    </Link>
                  </li>
                  <li>
                    <Link to="/study-stats" onClick={() => setIsOpen(false)}>
                      학습 통계
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings" onClick={() => setIsOpen(false)}>
                      설정
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="logout-button">
                      로그아웃
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/" onClick={() => setIsOpen(false)}>
                    홈
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;