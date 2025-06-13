import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleStartQuiz = () => {
    navigate("/quiz");
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  return (
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
            Welcome, {username}
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Hard work matters! Get ready to challenge yourself and have fun.
          </p>

          <button
            onClick={handleStartQuiz}
            className="mt-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-8 py-4 text-lg font-bold text-white shadow-md hover:opacity-90"
          >
            Start Quiz
          </button>
        </div>

        <div className="mt-20 rounded-lg bg-white/50 px-8 py-6 shadow-lg backdrop-blur-sm text-center">
          <h2 className="text-2xl font-semibold text-pink-600">
            "Challenge Your Mind"
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            Quizaki is your ultimate platform for immersive quizzes and
            competitive events designed exclusively for students. Sharpen your
            skills, fuel your ambition, and showcase your expertise on a
            platform that inspires growth.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
