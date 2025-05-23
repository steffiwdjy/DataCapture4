// src/pages/RegisterLogin.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notif, setNotif] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) return setNotif("Email dan password wajib diisi");
    if (!isLogin && password.length < 8)
      return setNotif("Password minimal 8 karakter");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await axios.post(endpoint, { email, password });
      localStorage.setItem("agent", email);
      navigate("/input");
    } catch (err) {
      setNotif(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="form-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
        <p>{notif}</p>
      </form>
      <p>
        {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Daftar di sini" : "Login di sini"}
        </button>
      </p>
    </div>
  );
};

export default RegisterLogin;