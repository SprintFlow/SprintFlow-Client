import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import LoadingOverlay from './LoadingOverlay';

// Mockeamos SprintFlowLogo para que no se renderice su SVG complejo en este test unitario.
// Solo necesitamos saber que se está intentando renderizar.
vi.mock('./SprintFlowLogo', () => ({
  default: () => <div data-testid="sprintflow-logo-mock">SprintFlow Logo Mock</div>,
}));

describe('LoadingOverlay', () => {
  test('debería renderizarse y mostrar el logo cuando open es true', () => {
    render(<LoadingOverlay open={true} />);

    // Verificamos que el Backdrop (el overlay) está presente buscándolo por su test-id.
    const backdrop = screen.getByTestId('loading-overlay');
    expect(backdrop).toBeInTheDocument();

    // Verificamos que nuestro logo mockeado está presente
    expect(screen.getByTestId('sprintflow-logo-mock')).toBeInTheDocument();
  });

  test('no debería renderizarse cuando open es false', () => {
    render(<LoadingOverlay open={false} />);

    // Verificamos que el Backdrop no está presente gracias a la prop `unmountOnExit`.
    expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();

    // Verificamos que nuestro logo mockeado tampoco está presente
    expect(screen.queryByTestId('sprintflow-logo-mock')).not.toBeInTheDocument();
  });
});
