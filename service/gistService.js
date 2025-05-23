import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GIST_ID = process.env.GIST_ID;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

// Ambil isi file JSON dari Gist, parsing jadi objek JS, atau array kosong kalau file kosong/tidak ada
export const getGistFile = async (filename) => {
  try {
    const res = await axios.get(`https://api.github.com/gists/${GIST_ID}`, { headers });
    const fileContent = res.data.files[filename]?.content;
    if (!fileContent) return []; // kalau kosong langsung return array kosong
    
    const data = JSON.parse(fileContent);
    
    // Pastikan tipe data adalah array, kalau bukan array return array kosong atau bungkus jadi array
    if (Array.isArray(data)) {
      return data;
    } else {
      console.warn(`${filename} bukan array, return array kosong`);
      return [];
    }
  } catch (err) {
    console.error("Error saat mengambil file dari Gist:", err.message);
    return [];  // return array kosong supaya gak error lanjutan
  }
};


// Update isi file JSON di Gist dengan data baru (objek JS akan di-stringify)
export const updateGistFile = async (filename, data) => {
  try {
    const files = {
      [filename]: {
        content: JSON.stringify(data, null, 2),
      },
    };
    await axios.patch(`https://api.github.com/gists/${GIST_ID}`, { files }, { headers });
  } catch (err) {
    console.error("Error saat memperbarui file di Gist:", err.message);
    throw err;
  }
};
