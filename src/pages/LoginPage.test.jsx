// src/pages/LoginPage.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom'; // Necesario si tu componente usa <Link> o <Navigate>
import LoginPage from './LoginPage';

// `describe` agrupa tests relacionados. Es como una sección de tu fichero de pruebas.
describe('LoginPage', () => {

  // Creamos una función de renderizado reutilizable que envuelve el componente
  // con los Providers que necesite (en este caso, el Router).
  const renderLoginPage = () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  };

  // Test 1: Verificar que la página se renderiza correctamente.
  test('debería renderizar el formulario de login con todos sus campos', () => {
    renderLoginPage();

    // `screen` es tu vista sobre el componente renderizado.
    // `getByRole` busca elementos como lo haría un usuario con lector de pantalla.
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    
    // `getByLabelText` es ideal para inputs de formulario. Busca el <label> y encuentra su input.
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();

    // Buscamos el botón por su texto visible.
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  // Test 2: Simular que un usuario escribe en los campos.
  test('debería permitir al usuario escribir en los campos de email y contraseña', async () => {
    // `userEvent` simula interacciones de usuario de forma más realista que `fireEvent`.
    const user = userEvent.setup();
    renderLoginPage();

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    // Simulamos que el usuario escribe en los campos.
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    // Verificamos que el valor de los inputs ha cambiado.
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  // Test 3: Simular un envío de formulario exitoso.
  // NOTA: Para este test, necesitarás "mockear" la función que hace la llamada a la API.
  // Por ahora, vamos a simular el clic y verificar que los campos se usan.
  test('debería llamar a la función de login al hacer clic en el botón', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    // Aquí haríamos un mock de la función de login de tu hook o servicio.
    // Por ejemplo: `const mockLogin = jest.fn();`
    // Y se lo pasaríamos al componente si lo aceptara como prop, o mockearíamos el hook.
    // Como es un test de componente, nos centramos en la interacción.

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(emailInput, 'test@user.com');
    await user.type(passwordInput, 'securePassword');
    await user.click(submitButton);

    // En un test más avanzado, verificaríamos que la función mockeada fue llamada:
    // expect(mockLogin).toHaveBeenCalledWith({
    //   email: 'test@user.com',
    //   password: 'securePassword'
    // });
    
    // Por ahora, podemos verificar que se muestra un estado de "cargando" si lo tienes.
    // Por ejemplo, si el botón se deshabilita:
    // expect(submitButton).toBeDisabled();
  });
});
