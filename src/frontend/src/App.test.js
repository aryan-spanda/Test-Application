import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock the components to avoid router issues
jest.mock('../components/Header', () => {
  return function Header() {
    return <div>Header Mock</div>;
  };
});

jest.mock('../pages/Home', () => {
  return function Home() {
    return <div>Home Mock</div>;
  };
});

jest.mock('../pages/Users', () => {
  return function Users() {
    return <div>Users Mock</div>;
  };
});

jest.mock('../pages/About', () => {
  return function About() {
    return <div>About Mock</div>;
  };
});

test('renders application without crashing', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Check if the app renders
  const headerElement = screen.getByText(/Header Mock/i);
  expect(headerElement).toBeInTheDocument();
});

test('has main content container', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Check if main content is present
  const mainElement = document.querySelector('main');
  expect(mainElement).toBeInTheDocument();
});
