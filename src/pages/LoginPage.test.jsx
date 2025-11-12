import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import LoginPage from './LoginPage';
import useAuthStore from '../store/authStore';

vi.mock('../store/authStore');

describe('LoginPage', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLoginPage = () => {
    return render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  };

  test('debería renderizar el formulario de login con todos sus campos', () => {
    // Mock Zustand selector
    useAuthStore.mockImplementation((selector) => {
      const state = {
        login: vi.fn(),
        error: null,
        isLoading: false,
        user: null
      };
      return selector(state);
    });

    renderLoginPage();

    expect(screen.getByRole('heading', { name: /sprintflow/i })).toBeInTheDocument();
    expect(screen.getByText(/gestión ágil de sprints para cohispania/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /¿olvidaste tu contraseña\?/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /regístrate aquí/i })).toBeInTheDocument();
  });

  test('debería permitir al usuario escribir en los campos de email y contraseña', async () => {
    useAuthStore.mockImplementation((selector) => {
      const state = {
        login: vi.fn(),
        error: null,
        isLoading: false,
        user: null
      };
      return selector(state);
    });

    const user = userEvent.setup();
    renderLoginPage();

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('debería llamar a la función de login al hacer clic en el botón', async () => {
    const user = userEvent.setup();
    const mockLogin = vi.fn().mockResolvedValue({ success: true });
    
    // Mock both selector and getState for login function
    useAuthStore.mockImplementation((selector) => {
      const state = {
        login: mockLogin,
        error: null,
        isLoading: false,
        user: { isAdmin: false }
      };
      return selector(state);
    });

    useAuthStore.getState = vi.fn(() => ({
      login: mockLogin,
      error: null,
      user: { isAdmin: false }
    }));

    renderLoginPage();

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(emailInput, 'test@user.com');
    await user.type(passwordInput, 'securePassword');
    await user.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@user.com',
      password: 'securePassword'
    });
  });
});