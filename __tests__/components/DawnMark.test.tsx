import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Define mocks before importing the component
jest.mock('marked', () => {
  return {
    Marked: jest.fn().mockImplementation(() => ({
      use: jest.fn(),
      parse: jest.fn(() => '<p>Parsed Markdown</p>'),
    })),
  };
});

jest.mock('marked-highlight', () => ({
  markedHighlight: jest.fn(() => ({})),
}));

jest.mock('highlight.js', () => ({
  getLanguage: jest.fn(),
  highlight: jest.fn(() => ({ value: '' })),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('# Initial Content'),
  })
) as jest.Mock;

// Mock @monaco-editor/react
jest.mock('@monaco-editor/react', () => ({
  Editor: ({ value, onChange }: { value: string; onChange: (val: string) => void }) => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// Mock katex auto-render
jest.mock('katex/dist/contrib/auto-render', () => {
  return jest.fn();
});

// Import component after mocks
import DawnMark from '@/components/DawnMark';

describe('DawnMark Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('clears the editor content when the clear button is clicked', async () => {
    render(<DawnMark />);

    // Wait for initial fetch to populate the editor
    await waitFor(() => {
      const editor = screen.getByTestId('monaco-editor') as HTMLTextAreaElement;
      expect(editor.value).toBe('# Initial Content');
    });

    // Find the clear button
    const clearButton = screen.getByLabelText('Clear editor');
    expect(clearButton).toBeInTheDocument();

    // Click the clear button
    fireEvent.click(clearButton);

    // Assert that the editor content is cleared
    const editor = screen.getByTestId('monaco-editor') as HTMLTextAreaElement;
    expect(editor.value).toBe('');
  });
});
