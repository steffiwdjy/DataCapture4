// routes/auth.js

import express from "express";
import { getGistFile, updateGistFile } from "../service/gistService.js";

const router = express.Router();

// Route: POST /api/signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || password.length < 8) {
    return res.status(400).json({ message: "Email dan password harus valid (password minimal 8 karakter)." });
  }

  try {
    const users = await getGistFile("users.json");

    if (users.some((user) => user.email === email)) {
      return res.status(409).json({ message: "Email sudah terdaftar." });
    }

    users.push({ email, password });
    await updateGistFile("users.json", users);

    res.status(201).json({ message: "Pendaftaran berhasil." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan saat pendaftaran." });
  }
});

// Route: POST /api/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await getGistFile("users.json");

    const foundUser = users.find((user) => user.email === email && user.password === password);

    if (!foundUser) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    res.json({ message: "Login berhasil." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan saat login." });
  }
});


// logout
router.post("/logout", (req, res) => {
  // Jika pakai session:
  // req.session.destroy();
  // Kalau hanya frontend stateless:
  // tinggal respon OK supaya frontend hapus token

  res.json({ message: "Logout berhasil." });
});

export default router;
