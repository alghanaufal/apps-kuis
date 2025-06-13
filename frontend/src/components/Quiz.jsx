import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Quiz = () => {
  // set variables
  const [questions, setQuestions] = useState([]);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(300);
  const navigate = useNavigate();
  // set saving state saat quiz
  useEffect(() => {
    const savedQuizData = JSON.parse(localStorage.getItem("quizData"));
    if (savedQuizData && savedQuizData.questions?.length > 0) {
      setQuestions(savedQuizData.questions);
      setCurrentQuestion(savedQuizData.currentQuestion);
      setScore(savedQuizData.score);
      setTimer(savedQuizData.timer);
      shuffleOptions(savedQuizData.questions[savedQuizData.currentQuestion]);
    } else {
      fetchQuiz();
    }
  }, []);
  // menyimpan ke LocalStorage
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem(
        "quizData",
        JSON.stringify({ questions, currentQuestion, score, timer })
      );
    }
  }, [questions, currentQuestion, score, timer]);
  // handle finish quiz if waktu pengerjaan selesai
  useEffect(() => {
    if (timer === 0) {
      handleFinishQuiz();
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);
  // membuat soal quiz
  const fetchQuiz = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/quiz");
      console.log("API Response:", response.data); 
      setQuestions(response.data);
      if (response.data[0]) shuffleOptions(response.data[0]);
    } catch (error) {
      console.error("Failed to fetch quiz questions:", error);
    }
  };
  // shuffle option
  const shuffleOptions = (question) => {
    if (!question || !question.incorrect_answers || !question.correct_answer) {
      console.error("Invalid question data:", question);
      return;
    }
    const options = [...question.incorrect_answers, question.correct_answer];
    const shuffled = options.sort(() => Math.random() - 0.5);
    setShuffledOptions(shuffled);
  };
  // handle jawaban untuk score
  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      shuffleOptions(questions[nextQuestion]);
    } else {
      handleFinishQuiz();
    }
  };
  // simpan data score
  const handleFinishQuiz = () => {
    const token = localStorage.getItem("token");
    axios.post(
      "http://localhost:5000/api/save-result",
      { score },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    localStorage.removeItem("quizData");
    navigate("/result", { state: { score } });
  };
  // loading
  if (questions.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#FFEEEC] to-[#FFF7F5]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold text-gray-600">
            Preparing your quiz...
          </p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  // set timer
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#FFEEEC] to-[#FFF7F5]">
      <div className="w-full max-w-lg mb-5 flex items-center gap-4 px-4">
        <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-orange-400"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <div className="relative max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
        <p className="absolute top-3 right-4 text-sm font-bold text-pink-600">
          {formatTime(timer)}
        </p>

        <h2 className="text-xl font-bold text-gray-700">
          Fantasy Quiz #{currentQuestion + 1}
        </h2>
        <div className="mt-4">
          <p className="text-lg font-semibold">{question.question}</p>
          <div className="grid grid-cols-1 gap-4 mt-4">
            {shuffledOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option === question.correct_answer)}
                className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-medium rounded-lg hover:opacity-90 transition"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
