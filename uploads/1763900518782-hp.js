// src/plugins/device.js
/*
// Fitur: Search Spesifikasi Device
// Category: search
*/

import axios from 'axios';

// API Configuration
const API_URL = "https://api.givy.my.id/search/device";

/**
 * Helper function untuk memformat objek specs menjadi string yang rapi.
 * @param {object} specs - Objek spesifikasi dari API.
 * @returns {string} String spesifikasi yang diformat.
 */
function formatSpecs(specs) {
    if (!specs || typeof specs !== 'object') return ""; // Kembalikan string kosong jika tidak ada

    let specText = "";

    // Iterasi melalui kunci dan nilai spesifikasi
    for (const key in specs) {
        if (specs.hasOwnProperty(key)) {
            const value = specs[key];
            
            // Format kunci (misal: '2G bands' -> '2G Bands')
            const cleanKey = key.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

            // 🚨 FORMAT BARU: Menggunakan Blockquote (>) 🚨
            specText += `> *${cleanKey}:* ${value}\n`;
        }
    }

    return specText.trim();
}

export default {
    name: "device",
    category: "search",
    command: ["device", "hp", "specs"], 
    settings: { 
        // Tidak ada setting spesifik
    },

    /**
     * @param {object} conn - Objek koneksi Baileys.
     * @param {object} m - Objek pesan yang diserialisasi.
     * @param {object} ctx - Konteks handler.
     */
    run: async (conn, m, { Func, usedPrefix }) => {
        const query = m.text?.trim();
        
        if (!query) {
            return m.reply(`*Usage:* ${m.prefix}${m.command} <device_name>\n\nContoh:\n${m.prefix}${m.command} samsung s24 ultra`);
        }
        
        m.reply(global.mess?.wait || '⏳ Mencari spesifikasi...'); 

        try {
            const encodedQuery = encodeURIComponent(query);
            const response = await axios.get(`${API_URL}?query=${encodedQuery}`, {
                timeout: 20000 // Batas waktu 20 detik
            });

            const data = response.data;
            
            // Cek status API
            if (!data || data.status === false || !data.device) {
                const errorMessage = data?.message || `❌ Spesifikasi untuk *${query}* tidak ditemukan.`;
                return m.reply(errorMessage);
            }

            const { device, image, specs } = data;
            
            // 1. Format Spesifikasi
            const specsDetail = formatSpecs(specs);

            // 2. Buat Caption dengan FORMAT BARU
            let caption = `- *\`『 ${device} 』\`*`; // 🚨 FORMAT JUDUL BARU

            // Tambahkan header spesifikasi
            caption += `\n\n\`⚙️ SPESIFIKASI LENGKAP\``; 
            
            // Tambahkan detail spesifikasi yang sudah diformat blockquote
            caption += `\n${specsDetail}`; 
            
            caption += `\n\n_Data provided by Givy API._`;


            // 3. Kirim Gambar dengan Caption
            await conn.sendMessage(m.chat, {
                image: { url: image },
                caption: caption
            }, { quoted: m });
            
        } catch (err) {
            console.error("[DEVICE SEARCH API ERROR]:", err);
            
            let errorMessage = "⚠️ Terjadi kesalahan saat mencari spesifikasi device.";
            if (err.response) {
                errorMessage = `❌ API Error: Status Code ${err.response.status}.`;
            } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
                errorMessage = '❌ Permintaan ke API Timeout. Coba ulangi perintah.';
            } else if (err.code === 'ENOTFOUND') {
                errorMessage = '❌ API server tidak ditemukan. Coba lagi nanti.';
            } else if (err.message.includes('Invalid URL')) {
                 errorMessage = '❌ Terdapat masalah pada URL gambar device. (Internal Error)';
            }

            await m.reply(errorMessage);
        }
    }
}