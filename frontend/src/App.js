import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Home from './pages/Home';
import Users from './pages/Users';
import About from './pages/About';

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
