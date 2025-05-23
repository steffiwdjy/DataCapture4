const express = require("express");
const axios = require("axios");
const router = express.Router();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Pastikan sudah ada di .env
const GIST_ID = "YOUR_GIST_ID_HERE"; // Ganti dengan ID gist kamu
const gistApiUrl = `https://api.github.com/gists/${GIST_ID}`;

// Route untuk menambahkan data penyewa baru
router.post("/", async (req, res) => {
  try {
    console.log("TOKEN:", GITHUB_TOKEN?.slice(0, 4) + "...");
    console.log("GIST ID:", GIST_ID);

    // Ambil isi gist dulu
    const gistResponse = await axios.get(gistApiUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    // Cek apakah file rentals.json ada
    if (!gistResponse.data.files["rentals.json"]) {
      return res.status(500).json({ message: "File rentals.json tidak ditemukan di gist" });
    }

    // Parsing content dari rentals.json
    const fileContent = gistResponse.data.files["rentals.json"].content;
    const data = JSON.parse(fileContent);

    // Tambahkan data baru dari request body
    data.push(req.body);

    // Update gist dengan data baru (stringify dengan indentasi)
    const patchResponse = await axios.patch(
      gistApiUrl,
      {
        files: {
          "rentals.json": {
            content: JSON.stringify(data, null, 2),
          },
        },
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    console.log("Update gist berhasil:", patchResponse.status);

    res.status(200).json({ message: "Data berhasil disimpan di gist" });
  } catch (error) {
    console.error("Gagal simpan data di gist:", error.message);
    if (error.response) {
      console.error("Detail error response:", error.response.data);
    }
    res.status(500).json({ message: "Gagal menyimpan data di gist" });
  }
});

router.get("/", async (req, res) => {
  try {
    const gistResponse = await axios.get(gistApiUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const fileContent = gistResponse.data.files["rentals.json"].content;
    const data = JSON.parse(fileContent);

    res.status(200).json(data);
  } catch (error) {
    console.error("Gagal ambil data penyewa dari gist:", error.message);
    res.status(500).json({ message: "Gagal memuat data penyewa" });
  }
});

// Route ekspor CSV (ambil data dari gist juga)
router.get("/export/all", async (req, res) => {
  try {
    const gistResponse = await axios.get(gistApiUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const fileContent = gistResponse.data.files["rentals.json"].content;
    const data = JSON.parse(fileContent);

    const csvHeader = [
      "Nama Penyewa", "Status Kewarganegaraan", "Tower", "Lantai", "Unit",
      "Metode Pembayaran", "Tanggal Check-in", "Waktu Check-in",
      "Tanggal Check-out", "Waktu Check-out", "Lama Menginap (hari)",
      "Komentar", "Agen", "Diedit Oleh"
    ];

    const csvRows = data.map(item => [
      item.nama, item.status_kewarganegaraan, item.tower, item.lantai, item.unit,
      item.metode_pembayaran, item.tanggal_checkin, item.waktu_checkin,
      item.tanggal_checkout || "", item.waktu_checkout || "", item.lama_menginap,
      item.komentar_str, item.agen, item.diedit_oleh || ""
    ]);

    let csv = csvHeader.join(",") + "\n";
    csv += csvRows.map(row => row.map(val => `"${val || ""}"`).join(",")).join("\n");

    const filename = "data_penyewa.csv";
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);

  } catch (err) {
    console.error("Gagal ekspor CSV:", err.message);
    res.status(500).send("Gagal ekspor CSV.");
  }
});

module.exports = router;
