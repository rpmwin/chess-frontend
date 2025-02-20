
import React, { useState, useEffect, useMemo } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

function Home() {
  // Create a persistent Chess instance.
  const game = useMemo(() => new Chess(), []);

  const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
  const [moveIndex, setMoveIndex] = useState(0);
  const [moveHistory, setMoveHistory] = useState([]);
  const [analysisData, setAnalysisData] = useState([]);

  useEffect(() => {
    // Retrieve PGN from session storage.
    const storedPgn = sessionStorage.getItem("pgn");
    if (storedPgn) {
      console.log(storedPgn);
      // Load the PGN into the game.
      game.loadPgn(storedPgn.trim());
      // Save the verbose move history.
      setMoveHistory(game.history({ verbose: true }));
      // Reset the board state.
      game.reset();
      setMoveIndex(0);
      setChessBoardPosition(game.fen());
    }
    // Retrieve analysis data from session storage.
    const storedAnalysis = sessionStorage.getItem("analysisData");
    if (storedAnalysis) {
      const parsed = JSON.parse(storedAnalysis);
      console.log(parsed);
      // Assuming your parsed analysis is an array.
      setAnalysisData(parsed);
    }
  }, [game]);

  function forwardMove() {
    if (moveIndex < moveHistory.length) {
      game.move(moveHistory[moveIndex]);
      setMoveIndex(moveIndex + 1);
      setChessBoardPosition(game.fen());
    }
  }

  function backwardMove() {
    if (moveIndex > 0) {
      game.undo();
      setMoveIndex(moveIndex - 1);
      setChessBoardPosition(game.fen());
    }
  }

  // Jump to a specific move index.
  function jumpToMove(n) {
    game.reset();
    for (let i = 0; i < n; i++) {
      game.move(moveHistory[i]);
    }
    setMoveIndex(n);
    setChessBoardPosition(game.fen());
  }

  // Get the AI commentary for the current move (if available).
  const currentCommentary =
    moveIndex > 0 
      ? analysisData.analysis[moveIndex - 1].ai_commentary
      : "No commentary available.";

  // Construct the arrow for the best move prediction using analysisData.
  // This mimics the arrow construction in your engine code.
  const getAnalysisArrow = () => {
    // console.log("i am getting called...")
    // console.log(analysisData)
    // console.log(`move Index: ${moveIndex} , 
    //   analysis Data: ${analysisData.analysis},
    //   analysisData[moveIndex - 1]: ${analysisData.analysis[moveIndex - 1]}`);
    if (moveIndex > 0 ) {
      const bestMove = analysisData.analysis[moveIndex - 1].best_move;
      if (bestMove && bestMove.length >= 4) {
        let arr = [
          [
            bestMove.substring(0, 2),
            bestMove.substring(2, 4),
            "rgb(0, 128, 0)",
          ],
        ];
        console.log(arr)
        return arr;
      }
    }
    return [];
  };

  const analysisArrow = getAnalysisArrow();

  return (
    <div>
      <Chessboard
        position={chessBoardPosition}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        // Pass the arrow for the best move prediction.
        customArrows={analysisArrow}
        boardWidth={500}
      />
      <button onClick={backwardMove} disabled={moveIndex === 0}>
        ← Back
      </button>
      <button onClick={forwardMove} disabled={moveIndex >= moveHistory.length}>
        Forward →
      </button>

      {/* Display AI Commentary */}
      <div style={{ marginTop: "20px" }}>
        <h4>AI Commentary</h4>
        <p>{currentCommentary}</p>
      </div>

      {/* Table displaying all moves */}
      <div style={{ marginTop: "20px", overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: "#fff",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                Move #
              </th>
              <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                White
              </th>
              <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                Black
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map(
              (_, index) => {
                const whiteMove = moveHistory[index * 2];
                const blackMove = moveHistory[index * 2 + 1];
                return (
                  <tr key={index}>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "4px",
                        cursor: whiteMove ? "pointer" : "default",
                      }}
                      onClick={() => {
                        if (whiteMove) jumpToMove(index * 2 + 1);
                      }}
                    >
                      {whiteMove ? whiteMove.san : ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "4px",
                        cursor: blackMove ? "pointer" : "default",
                      }}
                      onClick={() => {
                        if (blackMove) jumpToMove(index * 2 + 2);
                      }}
                    >
                      {blackMove ? blackMove.san : ""}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;


// import React, { useState, useEffect, useMemo } from "react";
// import { Chess } from "chess.js";
// import { Chessboard } from "react-chessboard";

// function Home() {
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
//       console.log(parsed)
//       setAnalysisData(parsed.analysis);
//       // if (parsed.result && parsed.result.analysis) {
//       // }
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
//     moveIndex > 0 && analysisData && analysisData[moveIndex - 1]
//       ? analysisData[moveIndex - 1].ai_commentary
//       : "No commentary available.";

//   return (
//     <div>
//       <Chessboard
//         position={chessBoardPosition}
//         customBoardStyle={{
//           borderRadius: "4px",
//           boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
//         }}
//       />
//       <button onClick={backwardMove} disabled={moveIndex === 0}>
//         ← Back
//       </button>
//       <button onClick={forwardMove} disabled={moveIndex >= moveHistory.length}>
//         Forward →
//       </button>

//       {/* Display AI Commentary */}
//       <div style={{ marginTop: "20px" }}>
//         <h4>AI Commentary</h4>
//         <p>{currentCommentary}</p>
//       </div>

//       {/* Table displaying all moves */}
//       <div style={{ marginTop: "20px", overflowX: "auto" }}>
//         <table
//           style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}
//         >
//           <thead>
//             <tr>
//               <th style={{ border: "1px solid #ccc", padding: "4px" }}>
//                 Move #
//               </th>
//               <th style={{ border: "1px solid #ccc", padding: "4px" }}>
//                 White
//               </th>
//               <th style={{ border: "1px solid #ccc", padding: "4px" }}>
//                 Black
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map(
//               (_, index) => {
//                 const whiteMove = moveHistory[index * 2];
//                 const blackMove = moveHistory[index * 2 + 1];
//                 return (
//                   <tr key={index}>
//                     <td
//                       style={{
//                         border: "1px solid #ccc",
//                         padding: "4px",
//                         textAlign: "center",
//                       }}
//                     >
//                       {index + 1}
//                     </td>
//                     <td
//                       style={{
//                         border: "1px solid #ccc",
//                         padding: "4px",
//                         cursor: whiteMove ? "pointer" : "default",
//                       }}
//                       onClick={() => {
//                         if (whiteMove) jumpToMove(index * 2 + 1);
//                       }}
//                     >
//                       {whiteMove ? whiteMove.san : ""}
//                     </td>
//                     <td
//                       style={{
//                         border: "1px solid #ccc",
//                         padding: "4px",
//                         cursor: blackMove ? "pointer" : "default",
//                       }}
//                       onClick={() => {
//                         if (blackMove) jumpToMove(index * 2 + 2);
//                       }}
//                     >
//                       {blackMove ? blackMove.san : ""}
//                     </td>
//                   </tr>
//                 );
//               }
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Home;

// // import React, { useState, useEffect, useMemo } from "react";
// // import { Chess } from "chess.js";
// // import { Chessboard } from "react-chessboard";

// // function Home() {
// //   // Create a persistent Chess instance.
// //   const game = useMemo(() => new Chess(), []);

// //   const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
// //   const [moveIndex, setMoveIndex] = useState(0);
// //   const [moveHistory, setMoveHistory] = useState([]);

// //   useEffect(() => {
// //     // Retrieve PGN from session storage.
// //     const storedPgn = sessionStorage.getItem("pgn");
// //     if (storedPgn) {
// //       console.log(storedPgn);
// //       // Load the PGN into the game.
// //       game.loadPgn(storedPgn.trim());
// //       // Save the verbose move history.
// //       setMoveHistory(game.history({ verbose: true }));
// //       // Reset the board state.
// //       game.reset();
// //       setMoveIndex(0);
// //       setChessBoardPosition(game.fen());
// //     }
// //   }, [game]);

// //   function forwardMove() {
// //     if (moveIndex < moveHistory.length) {
// //       game.move(moveHistory[moveIndex]);
// //       setMoveIndex(moveIndex + 1);
// //       setChessBoardPosition(game.fen());
// //     }
// //   }

// //   function backwardMove() {
// //     if (moveIndex > 0) {
// //       game.undo();
// //       setMoveIndex(moveIndex - 1);
// //       setChessBoardPosition(game.fen());
// //     }
// //   }

// //   // Jump to the position after n moves have been played.
// //   function jumpToMove(n) {
// //     game.reset();
// //     for (let i = 0; i < n; i++) {
// //       game.move(moveHistory[i]);
// //     }
// //     setMoveIndex(n);
// //     setChessBoardPosition(game.fen());
// //   }

// //   return (
// //     <div>
// //       <Chessboard
// //         position={chessBoardPosition}
// //         customBoardStyle={{
// //           borderRadius: "4px",
// //           boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
// //         }}
// //       />
// //       <button onClick={backwardMove} disabled={moveIndex === 0}>
// //         ← Back
// //       </button>
// //       <button onClick={forwardMove} disabled={moveIndex >= moveHistory.length}>
// //         Forward →
// //       </button>

// //       {/* Table displaying all moves */}
// //       <div style={{ marginTop: "20px", overflowX: "auto" }}>
// //         <table
// //           style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}
// //         >
// //           <thead>
// //             <tr>
// //               <th style={{ border: "1px solid #ccc", padding: "4px" }}>
// //                 Move #
// //               </th>
// //               <th style={{ border: "1px solid #ccc", padding: "4px" }}>
// //                 White
// //               </th>
// //               <th style={{ border: "1px solid #ccc", padding: "4px" }}>
// //                 Black
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map(
// //               (_, index) => {
// //                 const whiteMove = moveHistory[index * 2];
// //                 const blackMove = moveHistory[index * 2 + 1];
// //                 return (
// //                   <tr key={index}>
// //                     <td
// //                       style={{
// //                         border: "1px solid #ccc",
// //                         padding: "4px",
// //                         textAlign: "center",
// //                       }}
// //                     >
// //                       {index + 1}
// //                     </td>
// //                     <td
// //                       style={{
// //                         border: "1px solid #ccc",
// //                         padding: "4px",
// //                         cursor: whiteMove ? "pointer" : "default",
// //                       }}
// //                       onClick={() => {
// //                         if (whiteMove) jumpToMove(index * 2 + 1);
// //                       }}
// //                     >
// //                       {whiteMove ? whiteMove.san : ""}
// //                     </td>
// //                     <td
// //                       style={{
// //                         border: "1px solid #ccc",
// //                         padding: "4px",
// //                         cursor: blackMove ? "pointer" : "default",
// //                       }}
// //                       onClick={() => {
// //                         if (blackMove) jumpToMove(index * 2 + 2);
// //                       }}
// //                     >
// //                       {blackMove ? blackMove.san : ""}
// //                     </td>
// //                   </tr>
// //                 );
// //               }
// //             )}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Home;

// // // import React, { useState, useEffect, useMemo } from "react";
// // // import { Chess } from "chess.js";
// // // import { Chessboard } from "react-chessboard";

// // // function Home() {
// // //   // Create a persistent Chess instance.
// // //   const game = useMemo(() => new Chess(), []);

// // //   const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
// // //   const [moveIndex, setMoveIndex] = useState(0);
// // //   const [moveHistory, setMoveHistory] = useState([]);

// // //   useEffect(() => {
// // //     // Retrieve PGN from session storage.
// // //     const storedPgn = sessionStorage.getItem("pgn");
// // //     if (storedPgn) {
// // //       console.log(storedPgn);
// // //       // Load the PGN into the game.
// // //       game.loadPgn(storedPgn.trim());
// // //       // Save the verbose move history.
// // //       setMoveHistory(game.history({ verbose: true }));
// // //       // Reset the board state.
// // //       game.reset();
// // //       setMoveIndex(0);
// // //       setChessBoardPosition(game.fen());
// // //     }
// // //   }, [game]);

// // //   function forwardMove() {
// // //     if (moveIndex < moveHistory.length) {
// // //       game.move(moveHistory[moveIndex]);
// // //       setMoveIndex(moveIndex + 1);
// // //       setChessBoardPosition(game.fen());
// // //     }
// // //   }

// // //   function backwardMove() {
// // //     if (moveIndex > 0) {
// // //       game.undo();
// // //       setMoveIndex(moveIndex - 1);
// // //       setChessBoardPosition(game.fen());
// // //     }
// // //   }

// // //   return (
// // //     <div>
// // //       <Chessboard
// // //         position={chessBoardPosition}
// // //         customBoardStyle={{
// // //           borderRadius: "4px",
// // //           boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
// // //         }}
// // //       />
// // //       <button onClick={backwardMove} disabled={moveIndex === 0}>
// // //         ← Back
// // //       </button>
// // //       <button onClick={forwardMove} disabled={moveIndex >= moveHistory.length}>
// // //         Forward →
// // //       </button>

// // //       {/* Table displaying all moves */}
// // //       <div style={{ marginTop: "20px", overflowX: "auto" }}>
// // //         <table
// // //           style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}
// // //         >
// // //           <thead>
// // //             <tr>
// // //               <th style={{ border: "1px solid #ccc", padding: "4px" }}>
// // //                 Move #
// // //               </th>
// // //               <th style={{ border: "1px solid #ccc", padding: "4px" }}>
// // //                 White
// // //               </th>
// // //               <th style={{ border: "1px solid #ccc", padding: "4px" }}>
// // //                 Black
// // //               </th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map(
// // //               (_, index) => {
// // //                 const whiteMove = moveHistory[index * 2];
// // //                 const blackMove = moveHistory[index * 2 + 1];
// // //                 return (
// // //                   <tr key={index}>
// // //                     <td
// // //                       style={{
// // //                         border: "1px solid #ccc",
// // //                         padding: "4px",
// // //                         textAlign: "center",
// // //                       }}
// // //                     >
// // //                       {index + 1}
// // //                     </td>
// // //                     <td style={{ border: "1px solid #ccc", padding: "4px" }}>
// // //                       {whiteMove ? whiteMove.san : ""}
// // //                     </td>
// // //                     <td style={{ border: "1px solid #ccc", padding: "4px" }}>
// // //                       {blackMove ? blackMove.san : ""}
// // //                     </td>
// // //                   </tr>
// // //                 );
// // //               }
// // //             )}
// // //           </tbody>
// // //         </table>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default Home;

// // // // import React, { useState, useEffect, useMemo } from "react";
// // // // import { Chess } from "chess.js";
// // // // import { Chessboard } from "react-chessboard";

// // // // function Home() {
// // // //   // Create a persistent Chess instance.
// // // //   const game = useMemo(() => new Chess(), []);

// // // //   const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
// // // //   const [moveIndex, setMoveIndex] = useState(0);
// // // //   const [moveHistory, setMoveHistory] = useState([]);

// // // //   useEffect(() => {
// // // //     // Retrieve PGN from session storage.
// // // //     const storedPgn = sessionStorage.getItem("pgn");
// // // //     if (storedPgn) {
// // // //       console.log(storedPgn);
// // // //       // Load the PGN into the game.
// // // //       game.loadPgn(storedPgn.trim());
// // // //       // Save the verbose move history.
// // // //       setMoveHistory(game.history({ verbose: true }));
// // // //       // Reset the board state.
// // // //       game.reset();
// // // //       setMoveIndex(0);
// // // //       setChessBoardPosition(game.fen());
// // // //     }
// // // //   }, [game]);

// // // //   function forwardMove() {
// // // //     if (moveIndex < moveHistory.length) {
// // // //       game.move(moveHistory[moveIndex]);
// // // //       setMoveIndex(moveIndex + 1);
// // // //       setChessBoardPosition(game.fen());
// // // //     }
// // // //   }

// // // //   function backwardMove() {
// // // //     if (moveIndex > 0) {
// // // //       game.undo();
// // // //       setMoveIndex(moveIndex - 1);
// // // //       setChessBoardPosition(game.fen());
// // // //     }
// // // //   }

// // // //   return (
// // // //     <div>
// // // //       <Chessboard
// // // //         position={chessBoardPosition}
// // // //         customBoardStyle={{
// // // //           borderRadius: "4px",
// // // //           boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
// // // //         }}
// // // //       />
// // // //       <button onClick={backwardMove} disabled={moveIndex === 0}>
// // // //         ← Back
// // // //       </button>
// // // //       <button onClick={forwardMove} disabled={moveIndex >= moveHistory.length}>
// // // //         Forward →
// // // //       </button>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default Home;

// // // // // import React, { useState, useEffect, useRef, useMemo } from "react";
// // // // // import { Engine } from "../Engine";
// // // // // import { Chess } from "chess.js";
// // // // // import { Chessboard } from "react-chessboard";

// // // // // function Home({ pgn }) {
// // // // //   const engine = useMemo(() => new Engine(), []);
// // // // //   const game = useMemo(() => new Chess(), []);
// // // // //   const inputRef = useRef(null);

// // // // //   const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
// // // // //   const [positionEvaluation, setPositionEvaluation] = useState(0);
// // // // //   const [depth, setDepth] = useState(10);
// // // // //   const [bestLine, setBestline] = useState("");
// // // // //   const [possibleMate, setPossibleMate] = useState("");
// // // // //   const [isAnalyzing, setIsAnalyzing] = useState(false);
// // // // //   const [moveIndex, setMoveIndex] = useState(0);
// // // // //   const [moveHistory, setMoveHistory] = useState([]);

// // // // //   useEffect(() => {
// // // // //     if (pgn) {
// // // // //       console.log(pgn);
// // // // //       game.loadPgn(pgn);
// // // // //       setMoveHistory(game.history({ verbose: true }));
// // // // //       setMoveIndex(0);
// // // // //       game.reset();
// // // // //       setChessBoardPosition(game.fen());
// // // // //     }
// // // // //   }, [pgn]);

// // // // //   function findBestMove() {
// // // // //     setIsAnalyzing(true);
// // // // //     engine.stop();
// // // // //     setBestline("");
// // // // //     setPossibleMate("");

// // // // //     setTimeout(() => {
// // // // //       engine.evaluatePosition(game.fen(), 18);
// // // // //       engine.onMessage((response) => {
// // // // //         let { positionEvaluation, possibleMate, pv, depth } = response;
// // // // //         if (depth && depth < 10) return;
// // // // //         setPositionEvaluation(
// // // // //           ((game.turn() === "w" ? 1 : -1) * Number(positionEvaluation)) / 100
// // // // //         );
// // // // //         if (possibleMate) setPossibleMate(possibleMate);
// // // // //         if (depth) setDepth(depth);
// // // // //         if (pv) setBestline(pv);
// // // // //         setIsAnalyzing(false);
// // // // //       });
// // // // //     }, 100);
// // // // //   }

// // // // //   function forwardMove() {
// // // // //     if (moveIndex < moveHistory.length) {
// // // // //       game.move(moveHistory[moveIndex]);
// // // // //       setMoveIndex(moveIndex + 1);
// // // // //       setChessBoardPosition(game.fen());
// // // // //       findBestMove();
// // // // //     }
// // // // //   }

// // // // //   function backwardMove() {
// // // // //     if (moveIndex > 0) {
// // // // //       game.undo();
// // // // //       setMoveIndex(moveIndex - 1);
// // // // //       setChessBoardPosition(game.fen());
// // // // //       findBestMove();
// // // // //     }
// // // // //   }

// // // // //   return (
// // // // //     <div>
// // // // //       <h4>
// // // // //         Position Evaluation:{" "}
// // // // //         {isAnalyzing
// // // // //           ? "analyzing..."
// // // // //           : possibleMate
// // // // //           ? `#${possibleMate}`
// // // // //           : positionEvaluation}
// // // // //         {"; "} Depth: {depth}
// // // // //       </h4>
// // // // //       <h5>
// // // // //         Best line: <i>{bestLine.slice(0, 40)}</i> ...
// // // // //       </h5>
// // // // //       <Chessboard
// // // // //         position={chessBoardPosition}
// // // // //         customBoardStyle={{
// // // // //           borderRadius: "4px",
// // // // //           boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
// // // // //         }}
// // // // //       />
// // // // //       <button onClick={backwardMove} disabled={moveIndex === 0}>
// // // // //         ← Back
// // // // //       </button>
// // // // //       <button onClick={forwardMove} disabled={moveIndex >= moveHistory.length}>
// // // // //         Forward →
// // // // //       </button>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default Home;

// // import React, { useState, useEffect, useRef, useMemo } from "react";
// // import { Engine } from "../Engine";
// // import { Chess } from "chess.js";
// // import { Chessboard } from "react-chessboard";

// // function Home() {
// //   const engine = useMemo(() => new Engine(), []);
// //   const game = useMemo(() => new Chess(), []);
// //   const inputRef = useRef(null);
// //   const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
// //   const [positionEvaluation, setPositionEvaluation] = useState(0);
// //   const [depth, setDepth] = useState(10);
// //   const [bestLine, setBestline] = useState("");
// //   const [possibleMate, setPossibleMate] = useState("");
// //   const [legalMoves, setLegalMoves] = useState([]);
// //   const [selectedSquare, setSelectedSquare] = useState(null);
// //   const [isAnalyzing, setIsAnalyzing] = useState(false);

// //   function findBestMove() {
// //     setIsAnalyzing(true);
// //     // Stop any ongoing analysis
// //     engine.stop();
// //     // Clear previous analysis
// //     setBestline("");
// //     setPossibleMate("");

// //     // Start new analysis
// //     setTimeout(() => {
// //       engine.evaluatePosition(game.fen(), 18);
// //       engine.onMessage((response) => {
// //         let { positionEvaluation, possibleMate, pv, depth } = response;
// //         if (depth && depth < 10) return;
// //         if (positionEvaluation) {
// //           setPositionEvaluation(
// //             ((game.turn() === "w" ? 1 : -1) * Number(positionEvaluation)) / 100
// //           );
// //         }
// //         if (possibleMate) setPossibleMate(possibleMate);
// //         if (depth) setDepth(depth);
// //         if (pv) setBestline(pv);
// //         setIsAnalyzing(false);
// //       });
// //     }, 100);
// //   }

// //   function getLegalMoveSquares(square) {
// //     const moves = game.moves({
// //       square: square,
// //       verbose: true,
// //     });
// //     return moves.map((move) => ({
// //       square: move.to,
// //       type: "hint",
// //     }));
// //   }

// // function onSquareClick(square) {
// //   if (square === selectedSquare) {
// //     setSelectedSquare(null);
// //     setLegalMoves([]);
// //     return;
// //   }

// //   const piece = game.get(square);
// //   if (piece && piece.color === game.turn()) {
// //     setSelectedSquare(square);
// //     setLegalMoves(getLegalMoveSquares(square));
// //   } else if (selectedSquare) {
// //     // Check if the target square is in our legal moves list
// //     const legalMove = legalMoves.find((move) => move.square === square);
// //     if (legalMove) {
// //       const move = game.move({
// //         from: selectedSquare,
// //         to: square,
// //         promotion: "q",
// //       });

// //       if (move) {
// //         setChessBoardPosition(game.fen());
// //         findBestMove();
// //       }
// //     }

// //     setSelectedSquare(null);
// //     setLegalMoves([]);
// //   }
// // }

// // function onDrop(sourceSquare, targetSquare, piece) {
// //   // Get legal moves for the source square
// //   const legalMoves = game.moves({
// //     square: sourceSquare,
// //     verbose: true,
// //   });

// //   // Check if the target square is a legal destination
// //   const isLegalMove = legalMoves.some((move) => move.to === targetSquare);

// //   if (!isLegalMove) return false;

// //   const isPawnPromotion =
// //     piece[1] === "P" && (targetSquare[1] === "1" || targetSquare[1] === "8");

// //   const move = game.move({
// //     from: sourceSquare,
// //     to: targetSquare,
// //     promotion: isPawnPromotion ? "q" : undefined,
// //   });

// //   // illegal move
// //   if (move === null) return false;

// //   setChessBoardPosition(game.fen());
// //   setPossibleMate("");
// //   setSelectedSquare(null);
// //   setLegalMoves([]);

// //   if (game.isGameOver() || game.isDraw()) return true;

// //   // Trigger analysis after move
// //   findBestMove();
// //   return true;
// // }

// //   useEffect(() => {
// //     if (!game.isGameOver() && !game.isDraw()) {
// //       findBestMove();
// //     }

// //     // Cleanup function to stop engine when component unmounts
// //     return () => {
// //       engine.stop();
// //     };
// //   }, []);

// //   const getBestMoveArrow = () => {
// //     if (!bestLine || isAnalyzing) return undefined;
// //     const moves = bestLine.split(" ");
// //     const pvIndex = moves.findIndex((move) => move === "pv");
// //     if (pvIndex === -1 || pvIndex + 1 >= moves.length) return undefined;

// //     const bestMove = moves[pvIndex + 1];
// //     if (bestMove.length < 4) return undefined;

// //     return [
// //       [bestMove.substring(0, 2), bestMove.substring(2, 4), "rgb(0, 128, 0)"],
// //     ];
// //   };

// //   const handleFenInputChange = (e) => {
// //     const { valid } = game.validate_fen(e.target.value);
// //     if (valid && inputRef.current) {
// //       inputRef.current.value = e.target.value;
// //       game.load(e.target.value);
// //       setChessBoardPosition(game.fen());
// //       findBestMove();
// //     }
// //   };

// //   return (
// //     <div>
// //       <h4>
// //         Position Evaluation:{" "}
// //         {isAnalyzing
// //           ? "analyzing..."
// //           : possibleMate
// //           ? `#${possibleMate}`
// //           : positionEvaluation}
// //         {"; "}
// //         Depth: {depth}
// //       </h4>
// //       <h5>
// //         Best line: <i>{bestLine.slice(0, 40)}</i> ...
// //       </h5>
// //       <input
// //         ref={inputRef}
// //         style={{
// //           width: "90%",
// //         }}
// //         onChange={handleFenInputChange}
// //         placeholder="Paste FEN to start analysing custom position"
// //       />
// //       <Chessboard
// //         id="AnalysisBoard"
// //         position={chessBoardPosition}
// //         customBoardStyle={{
// //           borderRadius: "4px",
// //           boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
// //         }}
// //         customArrows={getBestMoveArrow()}
// //         customSquareStyles={{
// //           ...(selectedSquare && {
// //             [selectedSquare]: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
// //           }),
// //           ...Object.fromEntries(
// //             legalMoves.map((move) => [
// //               move.square,
// //               {
// //                 background:
// //                   "radial-gradient(circle, rgba(0, 0, 0, 0.5) 19%, transparent 20%)",
// //                 borderRadius: "50%",
// //               },
// //             ])
// //           ),
// //         }}
// //         arePiecesDraggable={true}
// //         arePremovesAllowed={false}
// //         onSquareClick={onSquareClick}
// //         onPieceDrop={onDrop}
// //       />
// //       <button
// //         onClick={() => {
// //           engine.stop();
// //           setPossibleMate("");
// //           setBestline("");
// //           game.reset();
// //           setChessBoardPosition(game.fen());
// //           setSelectedSquare(null);
// //           setLegalMoves([]);
// //           findBestMove();
// //         }}
// //       >
// //         reset
// //       </button>
// //       <button
// //         onClick={() => {
// //           engine.stop();
// //           setPossibleMate("");
// //           setBestline("");
// //           game.undo();
// //           setChessBoardPosition(game.fen());
// //           setSelectedSquare(null);
// //           setLegalMoves([]);
// //           findBestMove();
// //         }}
// //       >
// //         undo
// //       </button>
// //     </div>
// //   );
// // }

// // export default Home;
