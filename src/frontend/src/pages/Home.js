import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaRocket, FaUsers, FaServer, FaChartLine } from 'react-icons/fa';
import api from '../services/api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const TestBanner = styled.div`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  font-weight: bold;
  font-size: 1.2rem;
  animation: pulse 2s infinite;
  /* Updated for ArgoCD Image Updater configurable registry testing - Aug 4, 2025 */
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border-radius: 12px;
  margin-bottom: 3rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const StatIcon = styled.div`
  font-size: 3rem;
  color: #007bff;
  margin-bottom: 1rem;
`;

const StatTitle = styled.h3`
  color: #343a40;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
`;

const FeaturesSection = styled.section`
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const SectionTitle = styled.h2`
  text-align: center;
  color: #343a40;
  margin-bottom: 2rem;
  font-size: 2.5rem;
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureItem = styled.div`
  text-align: center;
  padding: 1.5rem;
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: #28a745;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  color: #343a40;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #6c757d;
  line-height: 1.6;
`;

const Home = () => {
  const [stats, setStats] = useState({
    users: 0,
    apiCalls: 0,
    uptime: '0%',
    status: 'Loading...'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch users count
      const usersResponse = await api.get('/api/users');
      
      // Fetch system status
      const statusResponse = await api.get('/health');
      
      setStats({
        users: usersResponse.data.length,
        apiCalls: Math.floor(Math.random() * 10000) + 1000, // Mock data
        uptime: '99.9%', // Mock data
        status: statusResponse.data.status === 'healthy' ? 'Online' : 'Offline'
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(prev => ({ ...prev, status: 'Offline' }));
    }
  };

  return (
    <Container>
      <TestBanner>
        🎉 IT WORKS! ArgoCD GitOps triggered at {new Date().toLocaleString()} 🎉
      </TestBanner>
      
      <HeroSection>
        <HeroTitle>🚀 Welcome to Spanda Test App 🚀</HeroTitle>
        <HeroSubtitle>
          A full-stack application built for the Spanda Platform - Testing ArgoCD Image Updater!
        </HeroSubtitle>
        <div style={{ marginTop: '2rem' }}>
          <strong>Powered by React + Node.js + Kubernetes</strong>
        </div>
        <div style={{ marginTop: '1rem', fontSize: '1rem', opacity: '0.8' }}>
          🔥 Updated: {new Date().toLocaleString()} - Testing GitOps Automation 🔥
        </div>
      </HeroSection>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <FaUsers />
          </StatIcon>
          <StatTitle>Total Users</StatTitle>
          <StatValue>{stats.users}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FaServer />
          </StatIcon>
          <StatTitle>System Status</StatTitle>
          <StatValue style={{ 
            color: stats.status === 'Online' ? '#28a745' : '#dc3545',
            fontSize: '1.5rem' 
          }}>
            {stats.status}
          </StatValue>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FaChartLine />
          </StatIcon>
          <StatTitle>API Calls</StatTitle>
          <StatValue>{stats.apiCalls.toLocaleString()}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FaRocket />
          </StatIcon>
          <StatTitle>Uptime</StatTitle>
          <StatValue style={{ fontSize: '1.5rem' }}>{stats.uptime}</StatValue>
        </StatCard>
      </StatsGrid>

      <FeaturesSection>
        <SectionTitle>Application Features</SectionTitle>
        <FeaturesList>
          <FeatureItem>
            <FeatureIcon>
              <FaUsers />
            </FeatureIcon>
            <FeatureTitle>User Management</FeatureTitle>
            <FeatureDescription>
              Complete CRUD operations for user management with a modern, 
              responsive interface built with React and styled-components.
            </FeatureDescription>
          </FeatureItem>
          
          <FeatureItem>
            <FeatureIcon>
              <FaServer />
            </FeatureIcon>
            <FeatureTitle>RESTful API</FeatureTitle>
            <FeatureDescription>
              Robust Node.js backend with Express.js providing RESTful endpoints,
              health checks, and comprehensive error handling.
            </FeatureDescription>
          </FeatureItem>
          
          <FeatureItem>
            <FeatureIcon>
              <FaRocket />
            </FeatureIcon>
            <FeatureTitle>Cloud Native</FeatureTitle>
            <FeatureDescription>
              Containerized application designed for Kubernetes deployment
              with ArgoCD GitOps workflow and automatic scaling capabilities.
            </FeatureDescription>
          </FeatureItem>
          
          <FeatureItem>
            <FeatureIcon>
              <FaChartLine />
            </FeatureIcon>
            <FeatureTitle>Monitoring Ready</FeatureTitle>
            <FeatureDescription>
              Built-in health checks, metrics endpoints, and logging
              for comprehensive monitoring and observability in production.
            </FeatureDescription>
          </FeatureItem>
        </FeaturesList>
      </FeaturesSection>
    </Container>
  );
};

export default Home;
