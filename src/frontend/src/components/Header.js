import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #343a40;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  /* Updated for ArgoCD Image Updater testing - Aug 4, 2025 */
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background-color: #007bff;
  }
`;

const Header = () => {
  const location = useLocation();

  return (
    <HeaderContainer>
      <Nav>
        <Logo>Dummy App</Logo>
        <NavLinks>
          <li>
            <NavLink 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/users" 
              className={location.pathname === '/users' ? 'active' : ''}
            >
              Users
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/about" 
              className={location.pathname === '/about' ? 'active' : ''}
            >
              About
            </NavLink>
          </li>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
