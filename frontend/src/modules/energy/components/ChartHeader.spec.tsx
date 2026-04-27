import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ChartHeader from './ChartHeader';

// Mock the hook used in the provider if needed, or just wrap with provider
// Since ChartHeader uses useDateFilterContext, we can wrap it with DateFilterProvider
// but DateFilterProvider uses useDateValidation hook.
// Let's mock useDateFilterContext directly for simplicity in this unit test.

vi.mock('../context/DateRangeContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../context/DateRangeContext')>();
  return {
    ...actual,
    useDateFilterContext: vi.fn(),
  };
});

import { useDateFilterContext } from '../context/DateRangeContext';

describe('ChartHeader', () => {
  it('renders correctly with title', () => {
    (useDateFilterContext as any).mockReturnValue({
      register: vi.fn(),
      errors: {},
    });

    render(<ChartHeader title="Test Title" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha Inicio')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha Fin')).toBeInTheDocument();
  });

  it('shows error messages when errors are present', () => {
    (useDateFilterContext as any).mockReturnValue({
      register: vi.fn(),
      errors: {
        startDate: { message: 'Start date is required' },
      },
    });

    render(<ChartHeader title="Test Title" />);

    expect(screen.getByText('Start date is required')).toBeInTheDocument();
  });
});
