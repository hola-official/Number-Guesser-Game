// src/components/tests/NumberGuesser.test.jsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import NumberGuesser from "../NumberGuesser";

describe("NumberGuesser", () => {
  beforeEach(() => {
    // Mock Math.random to return 0.5, which will make secretNumber 50 in medium difficulty
    vi.spyOn(Math, "random").mockImplementation(() => 0.49);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render the main components", () => {
    render(<NumberGuesser />);

    expect(screen.getByText("Number Guesser")).toBeInTheDocument();
    expect(screen.getByText("Guess the secret number")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guess" })).toBeInTheDocument();
  });

  it("should show/hide rules when clicking the rules button", async () => {
    const user = userEvent.setup();
    render(<NumberGuesser />);

    const rulesButton = screen.getByText("Show Rules");
    await user.click(rulesButton);
    expect(screen.getByText("How to Play:")).toBeInTheDocument();

    await user.click(rulesButton);
    expect(screen.queryByText("How to Play:")).not.toBeInTheDocument();
  });

  it("should handle correct guess", async () => {
    const user = userEvent.setup();
    render(<NumberGuesser />);

    // Get the input and button
    const input = screen.getByLabelText("Number input");
    const guessButton = screen.getByText("Guess");

    // Type the correct number (50)
    await user.type(input, "50");

    // Click the guess button
    await user.click(guessButton);

    // Wait for the success message to appear
    await waitFor(() => {
      expect(
        screen.getByText("Congratulations! You won! 🎉")
      ).toBeInTheDocument();
    });
  });

  it("should handle incorrect guess", async () => {
    const user = userEvent.setup();
    render(<NumberGuesser />);

    const input = screen.getByLabelText("Number input");
    await user.type(input, "25");

    const guessButton = screen.getByText("Guess");
    await user.click(guessButton);

    await waitFor(() => {
      expect(
        screen.getByText("Too low! 9 attempts remaining")
      ).toBeInTheDocument();
    });
  });

  // Additional test for game over scenario
  it("should handle game over", async () => {
    const user = userEvent.setup();
    render(<NumberGuesser />);

    const input = screen.getByLabelText("Number input");
    const guessButton = screen.getByText("Guess");

    // Make 10 wrong guesses
    for (let i = 0; i < 10; i++) {
      await user.clear(input);
      await user.type(input, "1");
      await user.click(guessButton);
    }

    await waitFor(() => {
      expect(
        screen.getByText("Game Over! The number was 50")
      ).toBeInTheDocument();
    });
  });

  // Test for difficulty change
  it("should change difficulty levels", async () => {
    const user = userEvent.setup();
    render(<NumberGuesser />);

    // Change to easy mode
    await user.click(screen.getByText("Easy"));
    expect(
      screen.getByPlaceholderText("Enter a number (1-50)")
    ).toBeInTheDocument();

    // Change to hard mode
    await user.click(screen.getByText("Hard"));
    expect(
      screen.getByPlaceholderText("Enter a number (1-150)")
    ).toBeInTheDocument();
  });
});
