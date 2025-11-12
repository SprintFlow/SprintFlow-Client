import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// Mock de dependencias
vi.mock('../../services/UserService', () => ({
  default: {
    getAll: vi.fn(() => Promise.resolve([
      { _id: 'user1', name: 'Juan Pérez', role: 'Developer' },
      { _id: 'user2', name: 'María García', role: 'Designer' }
    ]))
  }
}));

vi.mock('../../store/SprintStore', () => ({
  default: vi.fn(() => ({
    createSprint: vi.fn(() => Promise.resolve({ success: true }))
  }))
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Importa el componente después de los mocks
import CreateSprint from './CreateSprint';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CreateSprint - Tests que funcionan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar el título "Crear Nuevo Sprint"', async () => {
    renderWithProviders(<CreateSprint />);
    
    await waitFor(() => {
      expect(screen.getByText('Crear Nuevo Sprint')).toBeInTheDocument();
    });
  });

  it('debe mostrar todos los campos del formulario', async () => {
    renderWithProviders(<CreateSprint />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Nombre del Sprint \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Fecha de Inicio \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Fecha de Fin \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Observaciones/i)).toBeInTheDocument();
    });
  });

  it('debe permitir escribir en el campo de nombre', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateSprint />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Nombre del Sprint \*/i)).toBeInTheDocument();
    });
    
    const nameInput = screen.getByLabelText(/Nombre del Sprint \*/i);
    await user.type(nameInput, 'Mi Sprint de Prueba');
    
    expect(nameInput).toHaveValue('Mi Sprint de Prueba');
  });

  it('debe mostrar el botón de crear sprint', async () => {
    renderWithProviders(<CreateSprint />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Crear Sprint/i })).toBeInTheDocument();
    });
  });

  it('debe cargar y mostrar los usuarios disponibles', async () => {
    renderWithProviders(<CreateSprint />);
    
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('María García')).toBeInTheDocument();
    });
  });
});