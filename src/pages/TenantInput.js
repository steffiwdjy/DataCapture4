// src/pages/TenantInput.js
import React, { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const pelanggaran_list = [
  "Ditemukan alat suntik di tempat sampah",
  "Ditemukan kondom dalam jumlah banyak",
  "Kerusakan parah pada fasilitas",
  "Kebisingan berlebihan di malam hari",
  "Penyalahgunaan alkohol/narkoba",
  "Kekerasan atau ancaman kepada penghuni lain",
  "Merokok di area terlarang",
];

const TenantInput = () => {
  const [form, setForm] = useState({
    nama: "",
    status_kewarganegaraan: "",
    tower: "",
    lantai: "",
    unit: "",
    metode_pembayaran: "",
    tanggal_checkin: dayjs().format("YYYY-MM-DD"),
    waktu_checkin: dayjs().format("HH:mm"),
    lama_menginap: "",
  });
  const [komentar, setKomentar] = useState([]);
  const [notif, setNotif] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheck = (e) => {
    const value = e.target.value;
    setKomentar((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      agen: localStorage.getItem("agent"),
      komentar_str: komentar.join(", "),
    };

    try {
      await axios.post("/api/tenant", data);
      setNotif("Data berhasil disimpan");
      setForm({ ...form, nama: "", unit: "", lama_menginap: "" });
      setKomentar([]);
    } catch {
      setNotif("Gagal menyimpan data");
    }
  };

  return (
    <div>
      <h2>Input Data Penyewa</h2>
      <form onSubmit={handleSubmit}>
        <input name="nama" placeholder="Nama" onChange={handleChange} /><br />
        <select name="status_kewarganegaraan" onChange={handleChange}>
          <option value="">-- Status --</option>
          <option>WNI</option>
          <option>WNA</option>
        </select><br />
        <input name="tower" placeholder="Tower" onChange={handleChange} /><br />
        <input name="lantai" placeholder="Lantai" onChange={handleChange} /><br />
        <input name="unit" placeholder="Unit" onChange={handleChange} /><br />
        <input name="metode_pembayaran" placeholder="Metode Pembayaran" onChange={handleChange} /><br />
        <input type="date" name="tanggal_checkin" value={form.tanggal_checkin} readOnly /><br />
        <input type="time" name="waktu_checkin" value={form.waktu_checkin} readOnly /><br />
        <input name="lama_menginap" placeholder="Lama Menginap (hari)" onChange={handleChange} /><br />
        <fieldset>
          <legend>Komentar (Pelanggaran)</legend>
          {pelanggaran_list.map((p, i) => (
            <label key={i}>
              <input type="checkbox" value={p} onChange={handleCheck} /> {p}
            </label>
          ))}
        </fieldset>
        <button type="submit">Simpan</button>
        <p>{notif}</p>
      </form>
    </div>
  );
};

export default TenantInput;
