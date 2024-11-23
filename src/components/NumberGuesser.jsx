import React, { useState, useEffect } from "react";

const NumberGuesser = () => {
  const [secretNumber, setSecretNumber] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [attempts, setAttempts] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [showRules, setShowRules] = useState(false);

  const difficultySettings = {
    easy: { attempts: 15, range: 50 },
    medium: { attempts: 10, range: 100 },
    hard: { attempts: 7, range: 150 },
  };

  const initializeGame = () => {
    const settings = difficultySettings[difficulty];
    // This will result in 50 when Math.random() returns 0.5
    setSecretNumber(Math.floor(Math.random() * settings.range) + 1);
    setAttempts(settings.attempts);
    setGuess("");
    setFeedback("");
    setGameOver(false);
  };

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  const handleGuess = () => {
    const numGuess = parseInt(guess);
    const range = difficultySettings[difficulty].range;

    if (isNaN(numGuess) || numGuess < 1 || numGuess > range) {
      setFeedback(`Please enter a valid number between 1 and ${range}`);
      return;
    }

    const newAttempts = attempts - 1;
    setAttempts(newAttempts);

    if (numGuess === secretNumber) {
      setFeedback("Congratulations! You won! 🎉");
      setGameOver(true);
    } else if (newAttempts === 0) {
      setFeedback(`Game Over! The number was ${secretNumber}`);
      setGameOver(true);
    } else if (numGuess < secretNumber) {
      setFeedback(`Too low! ${newAttempts} attempts remaining`);
    } else {
      setFeedback(`Too high! ${newAttempts} attempts remaining`);
    }

    setGuess("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-xl bg-white rounded-2xl p-8 shadow-lg">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Number Guesser</h1>
          <p className="text-gray-600">Guess the secret number</p>
          <button
            onClick={() => setShowRules(!showRules)}
            className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 
                     hover:bg-gray-50 transition-all"
          >
            {showRules ? "Hide Rules" : "Show Rules"}
          </button>
        </div>

        {showRules && (
          <div className="mb-8 p-6 rounded-lg bg-gray-50 border border-gray-100">
            <h3 className="text-gray-900 font-medium mb-3">How to Play:</h3>
            <ul className="text-gray-600 space-y-2 text-sm">
              <li>• Choose your difficulty level</li>
              <li>• Enter a number within the given range</li>
              <li>• Use the feedback to guide your next guess</li>
              <li>• Win before running out of attempts!</li>
            </ul>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex justify-center gap-2">
            {Object.keys(difficultySettings).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    difficulty === level
                      ? "bg-indigo-600 text-white"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-1">
            {[...Array(difficultySettings[difficulty].attempts)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all
                  ${i < attempts ? "bg-blue-600" : "bg-gray-200"}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder={`Enter a number (1-${difficultySettings[difficulty].range})`}
              disabled={gameOver}
              onKeyPress={(e) => e.key === "Enter" && handleGuess()}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900
                placeholder:text-gray-400 focus:outline-none focus:border-blue-300 transition-all"
              aria-label="Number input"
            />
            <button
              onClick={handleGuess}
              disabled={gameOver || !guess}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
                hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guess
            </button>
          </div>

          {feedback && (
            <div className="p-4 rounded-lg text-center bg-blue-50 text-blue-600">
              {feedback}
            </div>
          )}

          {gameOver && (
            <button
              onClick={initializeGame}
              className="w-full p-3 bg-blue-50 text-blue-600 rounded-lg
                font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
            >
              Play Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NumberGuesser;
