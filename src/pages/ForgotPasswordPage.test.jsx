/** @vitest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import ForgotPasswordPage from './ForgotPasswordPage';
import useAuthStore from '../store/authStore';

vi.mock('../store/authStore');

describe('ForgotPasswordPage', () => {
    const mockForgotPassword = vi.fn();
    const mockVerifySecurityAnswer = vi.fn();
    const mockResetPassword = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        useAuthStore.mockReturnValue({
            forgotPassword: mockForgotPassword,
            verifySecurityAnswer: mockVerifySecurityAnswer,
            resetPassword: mockResetPassword,
        });
    });

    const renderComponent = () => {
        render(
            <BrowserRouter>
                <ForgotPasswordPage />
            </BrowserRouter>
        );
    };

    test('debería renderizar el componente en el primer paso (Verificar email)', () => {
        renderComponent();

        expect(screen.getByRole('heading', { name: /recuperar contraseña/i })).toBeInTheDocument();

        expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /volver al login/i })).toBeInTheDocument();
    });
});
