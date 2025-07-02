import React from 'react';
import { render, screen } from '@testing-library/react';
import OfflinePage from '@/app/offline/page';

describe('OfflinePage', () => {
  it('renders the offline message', () => {
    render(<OfflinePage />);

    const heading = screen.getByRole('heading', { name: /you're offline/i });
    expect(heading).toBeInTheDocument();

    const message = screen.getByText(/it looks like you've lost your connection/i);
    expect(message).toBeInTheDocument();
  });
});
