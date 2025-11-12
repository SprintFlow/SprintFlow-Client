// --- IMPORTS ---
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, afterEach, vi } from 'vitest';
import RegisterPage from './RegisterPage';
import useAuthStore from '../store/authStore';

// --- MOCKS ---
vi.mock('../store/authStore');

describe('RegisterPage', () => {
  // --- SETUP ---
  const renderRegisterPage = () => {
    return render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );
  };

  // Clean up mocks after each test to ensure isolation
  afterEach(() => {
    vi.clearAllMocks();
  });

  // --- TESTS ---
  test('debería renderizar el formulario de registro con todos sus campos', () => {
    const { container } = renderRegisterPage();
    
    expect(screen.getByRole('heading', { name: /crear una cuenta/i })).toBeInTheDocument();
    
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    
    // Verificar por ID en lugar de label para los campos de contraseña
    expect(container.querySelector('#password')).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    
    expect(screen.getByLabelText(/pregunta de seguridad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/respuesta de seguridad/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  });


  test('debería permitir al usuario escribir en los campos de nombre, email y contraseña', async () => {
    const user = userEvent.setup();
    const { container } = renderRegisterPage();

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);

    // Usar querySelector para los campos de contraseña
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


  test('debería llamar a la función de register al hacer clic en el botón', async () => {
    const user = userEvent.setup();

    // 1. Mock the register function from the store
    const mockRegister = vi.fn().mockResolvedValue({ success: true });

    useAuthStore.mockReturnValue(mockRegister);

    const { container } = renderRegisterPage();

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    
    // Usar querySelector para los campos de contraseña
    const passwordInput = container.querySelector('#password');
    const confirmPasswordInput = container.querySelector('#confirmPassword');
    
    const securityAnswerInput = screen.getByLabelText(/respuesta de seguridad/i);

    const submitButton = screen.getByRole('button', { name: /registrarse/i });

    // 2. Simulate user interaction
    await user.type(nameInput, 'Nuevo Usuario');
    await user.type(emailInput, 'nuevo@usuario.com');
    await user.type(passwordInput, 'passwordValida');
    await user.type(confirmPasswordInput, 'passwordValida');
    
    // Para el Select de Material-UI, necesitamos hacer click y luego seleccionar
    const securityQuestionSelect = container.querySelector('#securityQuestion');
    await user.click(securityQuestionSelect);
    
    // Esperar a que aparezca el menú y hacer click en la opción
    const option = await screen.findByText('¿Cuál es tu comida favorita?');
    await user.click(option);
    
    await user.type(securityAnswerInput, 'Pizza');

    await user.click(submitButton);

    // 3. Assert that the register function was called with the correct data
    expect(mockRegister).toHaveBeenCalledWith({
      name: 'Nuevo Usuario',
      email: 'nuevo@usuario.com',
      password: 'passwordValida',
      securityQuestion: '¿Cuál es tu comida favorita?',
      securityAnswer: 'Pizza'
    });
  });
});