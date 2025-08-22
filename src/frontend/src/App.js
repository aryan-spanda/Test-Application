import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Home from './pages/Home';
import Users from './pages/Users';
import About from './pages/About';

// Testing controlled ArgoCD Image Updater workflow - Change #7
const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const MainContent = styled.main`
  min-height: calc(100vh - 80px);
`;

function App() {
  return (
    <AppContainer>
      <Header />
      <MainContent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </MainContent>
    </AppContainer>
  );
}

export default App;
// ArgoCD Image Updater test - Mon Aug 18 20:55:40 IST 2025
