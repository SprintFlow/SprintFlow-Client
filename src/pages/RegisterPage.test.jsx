// src/pages/RegisterPage.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import RegisterPage from './RegisterPage';
import useAuthStore from '../store/authStore';

// Mockeamos el store de Zustand.
// Esto intercepta la importación de 'useAuthStore' y la reemplaza por nuestra simulación.
vi.mock('../store/authStore');

describe('RegisterPage', () => {

  const renderRegisterPage = () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );
  };

  // Limpiamos los mocks después de cada test para que no interfieran entre sí.
  afterEach(() => {
    vi.clearAllMocks();
  });


  // Test 1: Verificar que la página se renderiza correctamente.
  test('debería renderizar el formulario de registro con todos sus campos', () => {
    renderRegisterPage();

    expect(screen.getByRole('heading', { name: /crear cuenta/i })).toBeInTheDocument();
    
    // El formulario de registro tiene un campo más.
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument(); // Busca "Correo electrónico"
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument(); // Busca "Contraseña" exactamente
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument(); // Busca "Confirmar contraseña"

    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  });

  // Test 2: Simular que un usuario escribe en los campos.
  test('debería permitir al usuario escribir en los campos de nombre, email y contraseña', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    // Usamos selectores más específicos para diferenciar los campos de contraseña
    const passwordInput = screen.getByLabelText(/^contraseña$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'register@example.com');
    await user.type(passwordInput, 'newPassword123');
    await user.type(confirmPasswordInput, 'newPassword123');

    expect(nameInput).toHaveValue('Test User');
    expect(emailInput).toHaveValue('register@example.com');
    expect(passwordInput).toHaveValue('newPassword123');
    expect(confirmPasswordInput).toHaveValue('newPassword123');
  });

  // Test 3: Verificar que la función de registro es llamada.
  test('debería llamar a la función de register al hacer clic en el botón', async () => {
    const user = userEvent.setup();

    // Creamos una función mock para 'register' que devuelve una promesa resuelta.
    const mockRegister = vi.fn().mockResolvedValue({ success: true });

    // Configuramos nuestro mock de `useAuthStore` para que devuelva la función mockeada.
    useAuthStore.mockImplementation((selector) => {
      // Esto simula la llamada `useAuthStore(state => state.register)`
      return mockRegister;
    });

    renderRegisterPage();

    // Obtenemos los campos y el botón
    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^contraseña$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /registrarse/i });

    // Simulamos que el usuario rellena el formulario
    await user.type(nameInput, 'Nuevo Usuario');
    await user.type(emailInput, 'nuevo@usuario.com');
    await user.type(passwordInput, 'passwordValida');
    await user.type(confirmPasswordInput, 'passwordValida');

    // Simulamos el clic en el botón de registro
    await user.click(submitButton);

    // Verificamos que la función `register` fue llamada con los datos correctos
    expect(mockRegister).toHaveBeenCalledWith({
      name: 'Nuevo Usuario',
      email: 'nuevo@usuario.com',
      password: 'passwordValida',
    });
  });
});
