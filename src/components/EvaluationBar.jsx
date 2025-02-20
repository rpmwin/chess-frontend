import React, { useState, useEffect } from "react";

const EvaluationBar = ({ cp }) => {
  const [barStyles, setBarStyles] = useState({
    whiteHeight: "50%",
    blackHeight: "50%",
  });

  useEffect(() => {
    // Clamp centipawn values to -1000 to 1000
    const clampedCP = Math.max(-1000, Math.min(1000, cp));

    // Convert centipawn to percentage (0 cp = 50%, +1000 cp = 100%, -1000 cp = 0%)
    const whiteHeight = 50 + clampedCP / 20; // Scale factor
    const blackHeight = 100 - whiteHeight;

    setBarStyles({
      whiteHeight: `${whiteHeight}%`,
      blackHeight: `${blackHeight}%`,
    });
  }, [cp]);

  return (
    <div>
      <div
        className="evaluation-bar mx-auto"
        style={{
          width: "30px",
          height: "500px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          overflow: "hidden",
          margin: "0 auto",
        }}
      >
        <div className="flex flex-col w-full h-full">
          <div
            className="black-bar transition-all duration-500"
            style={{ height: barStyles.blackHeight, backgroundColor: "black" }}
          />
          <div
            className="white-bar transition-all duration-500"
            style={{ height: barStyles.whiteHeight, backgroundColor: "white" }}
          />
        </div>
      </div>
      
      <div className="text-center mt-2 text-white">{cp/100} </div>
    </div>
  );
};

export default EvaluationBar;
