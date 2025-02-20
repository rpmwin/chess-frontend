import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PGNInputPage = () => {
  const [pgn, setPgn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [polling, setPolling] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pgn.trim()) return;

    setLoading(true);
    setError(null);

    try {
     
      console.log(pgn)
      sessionStorage.setItem("pgn", pgn);


      const response = await axios.post("http://localhost:8000/analyze", {
        pgn,
      });
      console.log("Task Created:", response.data);
      setTaskId(response.data.task_id);
      setPolling(true); // Start polling
    } catch (err) {
      setError("Failed to analyze PGN. Please try again.");
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (polling && taskId) {
      interval = setInterval(async () => {
        try {
          const statusResponse = await axios.get(
            `http://localhost:8000/task_status/${taskId}`
          );

          console.log("Polling response:", statusResponse.data);

          if (statusResponse.data.status === "SUCCESS") {
            clearInterval(interval);
            setPolling(false);
            setLoading(false);
            console.log("Analysis complete!");

            sessionStorage.setItem(
              "analysisData",
              JSON.stringify(statusResponse.data.result)
            );
            sessionStorage.setItem(
              "response",
              JSON.stringify(statusResponse.data)
            );
            navigate("/analysis");
          }
        } catch (err) {
          console.error("Polling error:", err);
          setError("Error checking status. Please try again.");
        }
      }, 2000); // Poll every 2 seconds
    }

    return () => clearInterval(interval); // Cleanup on unmount
  }, [polling, taskId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Enter Your PGN</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
      >
        <textarea
          className="w-full h-40 p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Paste your PGN here..."
          value={pgn}
          onChange={(e) => setPgn(e.target.value)}
        />

        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
          disabled={loading || polling}
        >
          {loading || polling ? (
            <>
              <span className="animate-spin border-4 border-white border-t-transparent rounded-full h-5 w-5 mr-2"></span>
              {polling ? "Analyzing..." : "Processing..."}
            </>
          ) : (
            "Analyze PGN"
          )}
        </button>
      </form>

      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
};

export default PGNInputPage;
