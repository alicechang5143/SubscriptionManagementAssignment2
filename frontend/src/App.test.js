import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';

test('renders SubManager navigation brand', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  expect(screen.getByText(/SubManager/i)).toBeInTheDocument();
});
