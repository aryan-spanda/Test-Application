import React from 'react';
import styled from 'styled-components';
import { FaGithub, FaDocker, FaReact, FaNodeJs } from 'react-icons/fa';
import { SiKubernetes, SiArgo } from 'react-icons/si';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const AboutCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 1.2rem;
  opacity: 0.9;
`;

const Content = styled.div`
  padding: 3rem 2rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  color: #343a40;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const Description = styled.p`
  color: #6c757d;
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const TechStack = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const TechItem = styled.div`
  text-align: center;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    border-color: #007bff;
    transform: translateY(-2px);
  }
`;

const TechIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  
  &.react { color: #61dafb; }
  &.node { color: #68a063; }
  &.docker { color: #2496ed; }
  &.kubernetes { color: #326ce5; }
  &.argocd { color: #ef7b4d; }
  &.github { color: #333; }
`;

const TechName = styled.h3`
  margin: 0;
  color: #343a40;
  font-size: 1.1rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FeatureItem = styled.li`
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
  color: #6c757d;
  
  &:last-child {
    border-bottom: none;
  }
  
  &::before {
    content: "✓";
    color: #28a745;
    font-weight: bold;
    margin-right: 0.75rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const InfoCard = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #007bff;
`;

const InfoTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #343a40;
`;

const InfoText = styled.p`
  margin: 0;
  color: #6c757d;
  line-height: 1.6;
`;

const About = () => {
  return (
    <Container>
      <AboutCard>
        <Header>
          <Title>About Dummy Application</Title>
          <Subtitle>Full-Stack Demo for Spanda Platform</Subtitle>
        </Header>
        
        <Content>
          <Section>
            <SectionTitle>Overview</SectionTitle>
            <Description>
              This is a comprehensive full-stack application designed to demonstrate
              the capabilities of the Spanda Platform's GitOps deployment model. 
              It showcases a modern web application architecture with React frontend
              and Node.js backend, containerized and ready for Kubernetes deployment.
            </Description>
            
            <Description>
              The application follows the "Pure Reference" landing zone pattern,
              where deployment configurations live within the application repository,
              and the platform's landing zone simply references these configurations
              for automated deployment via ArgoCD.
            </Description>
          </Section>

          <Section>
            <SectionTitle>Technology Stack</SectionTitle>
            <TechStack>
              <TechItem>
                <TechIcon className="react">
                  <FaReact />
                </TechIcon>
                <TechName>React</TechName>
              </TechItem>
              <TechItem>
                <TechIcon className="node">
                  <FaNodeJs />
                </TechIcon>
                <TechName>Node.js</TechName>
              </TechItem>
              <TechItem>
                <TechIcon className="docker">
                  <FaDocker />
                </TechIcon>
                <TechName>Docker</TechName>
              </TechItem>
              <TechItem>
                <TechIcon className="kubernetes">
                  <SiKubernetes />
                </TechIcon>
                <TechName>Kubernetes</TechName>
              </TechItem>
              <TechItem>
                <TechIcon className="argocd">
                  <SiArgo />
                </TechIcon>
                <TechName>ArgoCD</TechName>
              </TechItem>
              <TechItem>
                <TechIcon className="github">
                  <FaGithub />
                </TechIcon>
                <TechName>GitHub</TechName>
              </TechItem>
            </TechStack>
          </Section>

          <Section>
            <SectionTitle>Key Features</SectionTitle>
            <FeatureList>
              <FeatureItem>Modern React frontend with responsive design</FeatureItem>
              <FeatureItem>RESTful Node.js API with Express.js</FeatureItem>
              <FeatureItem>Containerized with Docker for consistent deployment</FeatureItem>
              <FeatureItem>Kubernetes-native with proper health checks</FeatureItem>
              <FeatureItem>GitOps deployment with ArgoCD integration</FeatureItem>
              <FeatureItem>Comprehensive monitoring and observability</FeatureItem>
              <FeatureItem>Security best practices and hardened containers</FeatureItem>
              <FeatureItem>Horizontal pod autoscaling capabilities</FeatureItem>
              <FeatureItem>Environment-specific configurations</FeatureItem>
              <FeatureItem>CI/CD pipeline with automated testing</FeatureItem>
            </FeatureList>
          </Section>

          <Section>
            <SectionTitle>Architecture Details</SectionTitle>
            <InfoGrid>
              <InfoCard>
                <InfoTitle>Frontend</InfoTitle>
                <InfoText>
                  React SPA served via Nginx, featuring modern UI components,
                  routing, API integration, and responsive design for optimal
                  user experience across devices.
                </InfoText>
              </InfoCard>
              <InfoCard>
                <InfoTitle>Backend</InfoTitle>
                <InfoText>
                  Express.js API server providing RESTful endpoints, health checks,
                  metrics collection, and comprehensive error handling with
                  proper HTTP status codes.
                </InfoText>
              </InfoCard>
              <InfoCard>
                <InfoTitle>Deployment</InfoTitle>
                <InfoText>
                  Kubernetes manifests for both services with proper resource
                  limits, security contexts, and ingress configuration for
                  production-ready deployment.
                </InfoText>
              </InfoCard>
              <InfoCard>
                <InfoTitle>Monitoring</InfoTitle>
                <InfoText>
                  Built-in health endpoints, Prometheus metrics, structured
                  logging, and observability features for comprehensive
                  application monitoring.
                </InfoText>
              </InfoCard>
            </InfoGrid>
          </Section>

          <Section>
            <SectionTitle>Deployment Model</SectionTitle>
            <Description>
              This application demonstrates the Spanda Platform's "Pure Reference"
              approach where:
            </Description>
            <FeatureList>
              <FeatureItem>Application repository contains all source code and deployment manifests</FeatureItem>
              <FeatureItem>Landing zone contains only small registration files pointing to this repo</FeatureItem>
              <FeatureItem>ArgoCD automatically discovers and deploys based on landing zone references</FeatureItem>
              <FeatureItem>No code duplication between application and infrastructure repositories</FeatureItem>
              <FeatureItem>Development teams maintain full control over their deployment configurations</FeatureItem>
            </FeatureList>
          </Section>
        </Content>
      </AboutCard>
    </Container>
  );
};

export default About;
