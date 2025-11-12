import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingOverlay from './LoadingOverlay';

describe('LoadingOverlay', () => {
  test('should render and display the logo when open is true', () => {
    render(<LoadingOverlay open={true} />);

    const backdrop = screen.getByTestId('loading-overlay');
    expect(backdrop).toBeInTheDocument();

    const logoText = screen.getByText('SprintFlow');
    expect(logoText).toBeInTheDocument();
  });

  test('should not render when open is false', () => {
    render(<LoadingOverlay open={false} />);

    expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
    expect(screen.queryByText('SprintFlow')).not.toBeInTheDocument();
  });

  test('should apply correct styles to Backdrop', () => {
    render(<LoadingOverlay open={true} />);

    const backdrop = screen.getByTestId('loading-overlay');
    expect(backdrop).toHaveAttribute('aria-hidden', 'true');
  });
});