import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", {
        username,
        password,
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-yellow-100 to-pink-200">
        <div className="w-full max-w-md p-8 bg-white/50 rounded-lg shadow-lg backdrop-blur-md">
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
            Sign In
          </h2>
          <form onSubmit={handleRegister} method="POST" className="space-y-4">
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                User Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full rounded-md bg-gray-50 px-4 py-2 border border-gray-300 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md bg-gray-50 px-4 py-2 border border-gray-300 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full rounded-md bg-gradient-to-r from-pink-400 to-yellow-400 px-4 py-2 text-white font-semibold shadow-lg hover:from-pink-500 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                Sign in
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            Have an account?{" "}
            <Link
              to="/login"
              className="text-pink-500 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
