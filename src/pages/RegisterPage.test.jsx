import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, afterEach, vi } from 'vitest';
import RegisterPage from './RegisterPage';
import useAuthStore from '../store/authStore';

vi.mock('../store/authStore');

describe('RegisterPage', () => {
  const renderRegisterPage = () => {
    return render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render registration form with all fields', () => {
    const { container } = renderRegisterPage();
    
    expect(screen.getByRole('heading', { name: /crear una cuenta/i })).toBeInTheDocument();
    
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    
    expect(container.querySelector('#password')).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    
    expect(screen.getByLabelText(/pregunta de seguridad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/respuesta de seguridad/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  });

  test('should allow user to type in name, email and password fields', async () => {
    const user = userEvent.setup();
    const { container } = renderRegisterPage();

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = container.querySelector('#password');
    const confirmPasswordInput = container.querySelector('#confirmPassword');

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'register@example.com');
    await user.type(passwordInput, 'newPassword123');
    await user.type(confirmPasswordInput, 'newPassword123');

    expect(nameInput).toHaveValue('Test User');
    expect(emailInput).toHaveValue('register@example.com');
    expect(passwordInput).toHaveValue('newPassword123');
    expect(confirmPasswordInput).toHaveValue('newPassword123');
  });

  test('should call register function when submit button is clicked', async () => {
    const user = userEvent.setup();
    const mockRegister = vi.fn().mockResolvedValue({ success: true });

    useAuthStore.mockReturnValue(mockRegister);

    const { container } = renderRegisterPage();

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = container.querySelector('#password');
    const confirmPasswordInput = container.querySelector('#confirmPassword');
    const securityAnswerInput = screen.getByLabelText(/respuesta de seguridad/i);
    const submitButton = screen.getByRole('button', { name: /registrarse/i });

    await user.type(nameInput, 'Nuevo Usuario');
    await user.type(emailInput, 'nuevo@usuario.com');
    await user.type(passwordInput, 'passwordValida');
    await user.type(confirmPasswordInput, 'passwordValida');
    
    const securityQuestionSelect = container.querySelector('#securityQuestion');
    await user.click(securityQuestionSelect);
    
    const option = await screen.findByText('¿Cuál es tu comida favorita?');
    await user.click(option);
    
    await user.type(securityAnswerInput, 'Pizza');
    await user.click(submitButton);

    expect(mockRegister).toHaveBeenCalledWith({
      name: 'Nuevo Usuario',
      email: 'nuevo@usuario.com',
      password: 'passwordValida',
      securityQuestion: '¿Cuál es tu comida favorita?',
      securityAnswer: 'Pizza'
    });
  });
});