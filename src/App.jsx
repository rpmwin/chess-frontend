import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Nopage from "./components/Nopage";
import PGNInputPage from "./components/PGNInputPage";
import AnalysisPage from "./components/AnalysisPage";
import PGNTraversal from "./components/PGNTraversal";
import DummyOutlet from "./components/DummyOutlet";

function App() {
  const [count, setCount] = useState(0);

  const pgn = `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2025.02.11"]
[Round "?"]
[White "petar-rovcanin"]
[Black "puneethm123"]
[Result "1-0"]
[TimeControl "300"]
[WhiteElo "1504"]
[BlackElo "1467"]
[Termination "petar-rovcanin won by resignation"]
[ECO "B01"]
[EndTime "10:55:28 GMT+0000"]
[Link "https://www.chess.com/game/live/122780372860"]

1. e4 d5 2. exd5 Qxd5 3. Nc3 Qd8 4. d4 Nf6 5. h3 Bf5 6. Nf3 Bg6 7. Bd3 e6 8.
Bxg6 fxg6 9. Bg5 Be7 10. Qe2 Qd7 11. O-O-O Nd5 12. Bxe7 Nxe7 13. d5 exd5 14.
Rxd5 Qc6 15. Re5 Qf6 16. Nd5 1-0`;

  return (
    <>
      <div className="w-screen h-screen overflow-hidden bg-gray-700">
        <BrowserRouter>
          <Routes element={<DummyOutlet />}>
            <Route path="/" element={<Home pgn={pgn} />}></Route>
            <Route path="/analyze" element={<PGNInputPage />}></Route>
            <Route path="/analysis" element={<AnalysisPage />}></Route>
            <Route path="/PGNTraversal" element={<PGNTraversal />}></Route>
            <Route path="*" element={<Nopage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
