import React from 'react';
import { render, screen } from '@testing-library/react';
import Events from './Events';

// Ensure jest-dom matchers are available (setupTests.js also loads these when running via Jest)
import '@testing-library/jest-dom/extend-expect';

test('renders calendar iframe with correct src and title', () => {
  const url = 'https://calendar.google.com/calendar/embed?src=3c2a01314cb17c4b0f1fe29b83c80bf8f1753a4217fa9bab39ed151a019aa919%40group.calendar.google.com&ctz=America%2FNew_York';

  // Render the Events component with the provided default URL
  render(<Events defaultUrl={url} />);

  // The iframe should be present with the expected title
  const iframe = screen.getByTitle('UMD UQA Calendar');
  expect(iframe).toBeInTheDocument();

  // And it should have the calendar URL as its src attribute
  expect(iframe).toHaveAttribute('src', url);
});