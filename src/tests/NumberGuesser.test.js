import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NumberGuesser from '../components/NumberGuesser';

describe('NumberGuesser', () => {
  beforeEach(() => {
    // Mock Math.random to return a consistent value for testing
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders main game elements', () => {
    render(<NumberGuesser />);
    expect(screen.getByText('Number Guesser')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter a number/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Guess/i })).toBeInTheDocument();
  });

  test('handles difficulty change correctly', () => {
    render(<NumberGuesser />);
    const hardButton = screen.getByRole('button', { name: /Hard/i });
    fireEvent.click(hardButton);
    expect(hardButton).toHaveClass('bg-indigo-600');
    expect(screen.getByPlaceholderText(/Enter a number/)).toHaveAttribute('placeholder', expect.stringContaining('150'));
  });

  test('provides feedback for invalid input', () => {
    render(<NumberGuesser />);
    const input = screen.getByPlaceholderText(/Enter a number/);
    const guessButton = screen.getByRole('button', { name: /Guess/i });

    fireEvent.change(input, { target: { value: '101' } });
    fireEvent.click(guessButton);
    expect(screen.getByText(/Please enter a valid number/)).toBeInTheDocument();
  });

  test('decrements attempts after each guess', () => {
    render(<NumberGuesser />);
    const input = screen.getByPlaceholderText(/Enter a number/);
    const guessButton = screen.getByRole('button', { name: /Guess/i });

    fireEvent.change(input, { target: { value: '25' } });
    fireEvent.click(guessButton);
    expect(screen.getByText(/9 attempts remaining/)).toBeInTheDocument();
  });

  test('shows game over message when attempts run out', () => {
    render(<NumberGuesser />);
    const input = screen.getByPlaceholderText(/Enter a number/);
    const guessButton = screen.getByRole('button', { name: /Guess/i });

    // Make 10 incorrect guesses
    for (let i = 0; i < 10; i++) {
      fireEvent.change(input, { target: { value: '1' } });
      fireEvent.click(guessButton);
    }

    expect(screen.getByText(/Game Over!/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play Again/i })).toBeInTheDocument();
  });

  test('shows winning message on correct guess', () => {
    render(<NumberGuesser />);
    const input = screen.getByPlaceholderText(/Enter a number/);
    const guessButton = screen.getByRole('button', { name: /Guess/i });

    // Since Math.random is mocked to return 0.5, the secret number will be 50
    fireEvent.change(input, { target: { value: '50' } });
    fireEvent.click(guessButton);

    expect(screen.getByText(/Congratulations!/)).toBeInTheDocument();
  });
});