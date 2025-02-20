import React, { useState, useEffect, useMemo } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const PGNTraversal = () => {
  // Create a persistent Chess instance.
  const game = useMemo(() => new Chess(), []);

  // State for the current board FEN.
  const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
  // State for the current move index.
  const [moveIndex, setMoveIndex] = useState(0);
  // State for storing the full move history.
  const [moveHistory, setMoveHistory] = useState([]);

  useEffect(() => {
    // Get the PGN from session storage.
    const storedPgn = sessionStorage.getItem("pgn");
    console.log(storedPgn)
    if (storedPgn) {
      // Load the PGN into the game.
      const loadSuccess = game.loadPgn(storedPgn.trim());
      if (!loadSuccess) {
        console.error("Failed to load PGN");
        return;
      }
      // Save the verbose move history.
      setMoveHistory(game.history({ verbose: true }));
      // Reset the board and move index.
      game.reset();
      setMoveIndex(0);
      setChessBoardPosition(game.fen());
    }
  }, [game]);

  // Function to move forward one move.
  const forwardMove = () => {
    if (moveIndex < moveHistory.length) {
      game.move(moveHistory[moveIndex]);
      setMoveIndex(moveIndex + 1);
      setChessBoardPosition(game.fen());
    }
  };

  // Function to move backward one move.
  const backwardMove = () => {
    if (moveIndex > 0) {
      game.undo();
      setMoveIndex(moveIndex - 1);
      setChessBoardPosition(game.fen());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4">
      <Chessboard
        position={chessBoardPosition}
        boardWidth={400}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
      />
      <div className="mt-4 flex space-x-4">
        <button
          onClick={backwardMove}
          disabled={moveIndex === 0}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          ← Back
        </button>
        <button
          onClick={forwardMove}
          disabled={moveIndex >= moveHistory.length}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Forward →
        </button>
      </div>
    </div>
  );
};

export default PGNTraversal;
