import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingOverlay from './LoadingOverlay';

describe('LoadingOverlay', () => {
  test('debería renderizarse y mostrar el logo cuando open es true', () => {
    render(<LoadingOverlay open={true} />);

    // Verificamos que el Backdrop (el overlay) está presente
    const backdrop = screen.getByTestId('loading-overlay');
    expect(backdrop).toBeInTheDocument();

    // Verificamos que el texto "SprintFlow" está presente en el SVG
    const logoText = screen.getByText('SprintFlow');
    expect(logoText).toBeInTheDocument();
  });

  test('no debería renderizarse cuando open es false', () => {
    render(<LoadingOverlay open={false} />);

    // Verificamos que el Backdrop no está presente gracias a la prop `unmountOnExit`
    expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();

    // Verificamos que el texto del logo tampoco está presente
    expect(screen.queryByText('SprintFlow')).not.toBeInTheDocument();
  });

  test('debería aplicar los estilos correctos al Backdrop', () => {
    render(<LoadingOverlay open={true} />);

    const backdrop = screen.getByTestId('loading-overlay');
    
    // Verificamos que tiene el atributo aria-hidden
    expect(backdrop).toHaveAttribute('aria-hidden', 'true');
  });
});