import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  return (
    <>
      <div className="h-screen overflow-hidden flex flex-col">

        <div
          className="absolute inset-0 -z-10 bg-gradient-to-b from-[#FFEEEC] to-[#FFF7F5]"
          aria-hidden="true"
        ></div>

        <div className="flex justify-between items-center px-8 py-4">
          <div className="text-2xl font-bold text-amber-600">Quiz --</div>
          <button
            onClick={handleLogout}
            className="rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-90"
          >
            Log Out
          </button>
        </div>

        <div className="flex flex-col items-center justify-center flex-grow px-6">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-amber-600">
              Your score = {location.state?.score || 0}
            </h1>
            <p className="mt-4 text-lg text-gray-700">Great Job</p>

            <button
              onClick={handleGoToDashboard}
              className="mt-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-8 py-4 text-lg font-bold text-white shadow-md hover:opacity-90"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Result;
