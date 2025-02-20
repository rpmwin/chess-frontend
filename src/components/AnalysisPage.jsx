import React, { useState, useEffect, useMemo } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import EvaluationBar from "./EvaluationBar";

function AnalysisPage() {
  const game = useMemo(() => new Chess(), []);
  const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
  const [moveIndex, setMoveIndex] = useState(0);
  const [moveHistory, setMoveHistory] = useState([]);
  const [analysisData, setAnalysisData] = useState([]);
  const [cp, setCp] = useState(0); // Evaluation score

  useEffect(() => {
    const storedPgn = sessionStorage.getItem("pgn");
    if (storedPgn) {
      game.loadPgn(storedPgn.trim());
      setMoveHistory(game.history({ verbose: true }));
      game.reset();
      setMoveIndex(0);
      setChessBoardPosition(game.fen());
    }

    const storedAnalysis = sessionStorage.getItem("analysisData");
    if (storedAnalysis) {
      const parsed = JSON.parse(storedAnalysis);
      setAnalysisData(parsed);
    }
  }, [game]);

  function forwardMove() {
    if (moveIndex < moveHistory.length) {
      game.move(moveHistory[moveIndex]);
      setMoveIndex(moveIndex + 1);
      setChessBoardPosition(game.fen());
      setCp(analysisData.analysis[moveIndex - 1]?.played_move_eval.value || 0);
    }
  }

  function backwardMove() {
    if (moveIndex > 0) {
      game.undo();
      setMoveIndex(moveIndex - 1);
      setChessBoardPosition(game.fen());
      setCp(analysisData.analysis[moveIndex - 1]?.played_move_eval.value || 0);
      console.log(cp);
    }
  }

  function jumpToMove(n) {
    game.reset();
    for (let i = 0; i < n; i++) {
      game.move(moveHistory[i]);
    }
    setMoveIndex(n);
    setChessBoardPosition(game.fen());
    setCp(analysisData.analysis[n - 1]?.cp || 0);
  }

  const currentCommentary =
    moveIndex > 0
      ? analysisData.analysis[moveIndex - 1]?.ai_commentary ||
        "No commentary available."
      : "No commentary available.";

  return (
    <div className="flex w-screen h-screen bg-gray-900 text-white">
      {/* Left Side (Board & Controls) */}
      <div className="w-1/2 flex flex-col items-center justify-center border-r border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <EvaluationBar cp={cp} />
          <Chessboard
            position={chessBoardPosition}
            boardWidth={400}
            customBoardStyle={{
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(255, 255, 255, 0.2)",
            }}
          />
        </div>
        <div className="mt-4 flex gap-4 ">
          <button
            onClick={backwardMove}
            disabled={moveIndex === 0}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
          >
            ← Back
          </button>
          <button
            onClick={forwardMove}
            disabled={moveIndex >= moveHistory.length}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
          >
            Forward →
          </button>
        </div>
      </div>

      {/* Right Side (Comments & Moves) */}
      <div className="w-1/2 flex flex-col  p-4  mx-auto ">
        {/* AI Commentary */}
        <div className="bg-gray-800 p-4 rounded-md shadow-md">
          <h4 className="text-lg font-semibold">AI Commentary</h4>
          <p className="mt-2 text-gray-300">{currentCommentary}</p>
        </div>

        {/* Move History */}
        <div className="mt-4 mx-auto flex-1 min-w-[40%] overflow-y-auto  max-w-[50%] bg-gray-800 p-4 rounded-md">
          <h4 className="text-lg font-semibold">Move History</h4>
          <table className="w-full  text-center mt-2 border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-2 border border-gray-600">#</th>
                <th className="p-2 border border-gray-600">White</th>
                <th className="p-2 border border-gray-600">Black</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map(
                (_, index) => {
                  const whiteMove = moveHistory[index * 2];
                  const blackMove = moveHistory[index * 2 + 1];
                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-700 cursor-pointer"
                    >
                      <td className="p-2 border border-gray-600">
                        {index + 1}
                      </td>
                      <td
                        className="p-2 border border-gray-600"
                        onClick={() => whiteMove && jumpToMove(index * 2 + 1)}
                      >
                        {whiteMove ? whiteMove.san : "~"}
                      </td>
                      <td
                        className="p-2 border border-gray-600"
                        onClick={() => blackMove && jumpToMove(index * 2 + 2)}
                      >
                        {blackMove ? blackMove.san : "~"}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AnalysisPage;

// import React, { useState, useEffect, useMemo } from "react";
// import { Chess } from "chess.js";
// import { Chessboard } from "react-chessboard";

// function AnalysisPage() {
//   // Create a persistent Chess instance.
//   const game = useMemo(() => new Chess(), []);

//   const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
//   const [moveIndex, setMoveIndex] = useState(0);
//   const [moveHistory, setMoveHistory] = useState([]);
//   const [analysisData, setAnalysisData] = useState([]);

//   useEffect(() => {
//     // Retrieve PGN from session storage.
//     const storedPgn = sessionStorage.getItem("pgn");
//     if (storedPgn) {
//       console.log(storedPgn);
//       // Load the PGN into the game.
//       game.loadPgn(storedPgn.trim());
//       // Save the verbose move history.
//       setMoveHistory(game.history({ verbose: true }));
//       // Reset the board state.
//       game.reset();
//       setMoveIndex(0);
//       setChessBoardPosition(game.fen());
//     }
//     // Retrieve analysis data from session storage.
//     const storedAnalysis = sessionStorage.getItem("analysisData");
//     if (storedAnalysis) {
//       const parsed = JSON.parse(storedAnalysis);
//       console.log(parsed);
//       // Assuming your parsed analysis is an array.
//       setAnalysisData(parsed);
//     }
//   }, [game]);

//   function forwardMove() {
//     if (moveIndex < moveHistory.length) {
//       game.move(moveHistory[moveIndex]);
//       setMoveIndex(moveIndex + 1);
//       setChessBoardPosition(game.fen());
//     }
//   }

//   function backwardMove() {
//     if (moveIndex > 0) {
//       game.undo();
//       setMoveIndex(moveIndex - 1);
//       setChessBoardPosition(game.fen());
//     }
//   }

//   // Jump to a specific move index.
//   function jumpToMove(n) {
//     game.reset();
//     for (let i = 0; i < n; i++) {
//       game.move(moveHistory[i]);
//     }
//     setMoveIndex(n);
//     setChessBoardPosition(game.fen());
//   }

//   // Get the AI commentary for the current move (if available).
//   const currentCommentary =
//     moveIndex > 0
//       ? analysisData.analysis[moveIndex - 1].ai_commentary
//       : "No commentary available.";

//   // Construct the arrow for the best move prediction using analysisData.
//   // This mimics the arrow construction in your engine code.
//   const getAnalysisArrow = () => {
//     if (moveIndex > 0) {
//       const bestMove = analysisData.analysis[moveIndex - 1].best_move;
//       if (bestMove && bestMove.length >= 4) {
//         let arr = [
//           [
//             bestMove.substring(0, 2),
//             bestMove.substring(2, 4),
//             "rgb(0, 128, 0)",
//           ],
//         ];
//         console.log(arr);
//         return arr;
//       }
//     }
//     return [];
//   };

//   const analysisArrow = getAnalysisArrow();

//   return (
//     <div className="w-screen overflow-hidden">
//       <div>
//         <Chessboard
//           position={chessBoardPosition}
//           customBoardStyle={{
//             borderRadius: "4px",
//             boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
//           }}
//           // Pass the arrow for the best move prediction.
//           customArrows={analysisArrow}
//           boardWidth={500}
//         />
//         <button onClick={backwardMove} disabled={moveIndex === 0}>
//           ← Back
//         </button>
//         <button
//           onClick={forwardMove}
//           disabled={moveIndex >= moveHistory.length}
//         >
//           Forward →
//         </button>
//       </div>

//       <div>
//         {/* Display AI Commentary */}
//         <div style={{ marginTop: "20px" }}>
//           <h4>AI Commentary</h4>
//           <p>{currentCommentary}</p>
//         </div>

//         {/* Table displaying all moves */}
//         <div style={{ marginTop: "20px", overflowX: "auto" }}>
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               color: "#fff",
//             }}
//           >
//             <thead>
//               <tr>
//                 <th style={{ border: "1px solid #ccc", padding: "4px" }}>
//                   Move #
//                 </th>
//                 <th style={{ border: "1px solid #ccc", padding: "4px" }}>
//                   White
//                 </th>
//                 <th style={{ border: "1px solid #ccc", padding: "4px" }}>
//                   Black
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map(
//                 (_, index) => {
//                   const whiteMove = moveHistory[index * 2];
//                   const blackMove = moveHistory[index * 2 + 1];
//                   return (
//                     <tr key={index}>
//                       <td
//                         style={{
//                           border: "1px solid #ccc",
//                           padding: "4px",
//                           textAlign: "center",
//                         }}
//                       >
//                         {index + 1}
//                       </td>
//                       <td
//                         style={{
//                           border: "1px solid #ccc",
//                           padding: "4px",
//                           cursor: whiteMove ? "pointer" : "default",
//                         }}
//                         onClick={() => {
//                           if (whiteMove) jumpToMove(index * 2 + 1);
//                         }}
//                       >
//                         {whiteMove ? whiteMove.san : ""}
//                       </td>
//                       <td
//                         style={{
//                           border: "1px solid #ccc",
//                           padding: "4px",
//                           cursor: blackMove ? "pointer" : "default",
//                         }}
//                         onClick={() => {
//                           if (blackMove) jumpToMove(index * 2 + 2);
//                         }}
//                       >
//                         {blackMove ? blackMove.san : ""}
//                       </td>
//                     </tr>
//                   );
//                 }
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AnalysisPage;
