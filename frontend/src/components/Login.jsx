import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("token", token);
        login(formData); 
        navigate("/dashboard");
      } else {
        alert("Invalid username or password!");
      }
    } catch (error) {
      alert("Error during login!");
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-yellow-100 to-pink-200">
        <div className="w-full max-w-md p-8 bg-white/50 rounded-lg shadow-lg backdrop-blur-md">
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                User Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
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
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
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
                Login
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/" className="text-pink-500 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;