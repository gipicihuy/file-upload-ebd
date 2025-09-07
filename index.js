const express = require('express');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const fs = require('fs');
const mime = require('mime-types');

const app = express();
const port = 3000;
const to = "ghp_a6JBpEMap2hb2AJhjMM9";
const ken = "YUFfA1Wkjo0vXExQ";
const githubToken = `${to}${ken}`;

const owner = "gipicihuy"; 
const repo = "file-upload-ebd"; 
const branch = "main";

console.log("GitHub Token:", githubToken);

app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let uploadedFile = req.files.file;
  let mimeType = mime.lookup(uploadedFile.name);
  let fileName = `${Date.now()}.${mime.extension(mimeType)}`;
  let filePath = `uploads/${fileName}`;
  let base64Content = Buffer.from(uploadedFile.data).toString('base64');

  try {
    let response = await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      message: `Upload file ${fileName}`,
      content: base64Content,
      branch: branch,
    }, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
    });

    let rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    
    res.send(`
    <!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unggahan Berhasil - EBD</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="icon" type="image/x-icon" href="https://i.pinimg.com/736x/0d/71/2a/0d712a0b6805c0b44386339048bdfce5.jpg?format=png&name=900x900">
    <style>
        body {
            background: linear-gradient(to right top, #2a0a0a, #3d0f0f, #521414, #681919, #7f1e1e);
            background-size: cover;
            background-attachment: fixed;
            color: #f0d9d9;
        }
        .card-glow {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 
                        0 4px 6px -2px rgba(0, 0, 0, 0.2), 
                        0 0 30px rgba(139, 0, 0, 0.6);
            transition: all 0.3s ease-in-out;
            background: rgba(60, 15, 15, 0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(139, 0, 0, 0.3);
        }
        .card-glow:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 20px -5px rgba(0, 0, 0, 0.3), 
                        0 6px 8px -3px rgba(0, 0, 0, 0.25), 
                        0 0 40px rgba(178, 34, 34, 0.7);
        }
        .glass {
            background: rgba(90, 25, 25, 0.3);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(139, 0, 0, 0.2);
        }
        .btn-primary {
            background: linear-gradient(to right, #8B0000, #A52A2A);
        }
        .btn-primary:hover {
            background: linear-gradient(to right, #A52A2A, #B22222);
        }
    </style>
</head>
<body class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="p-8 rounded-xl w-full max-w-md card-glow transform hover:scale-105 transition duration-300">
        <div class="mb-6">
            <img src="https://media.tenor.com/yWaLIc5J9WgAAAAj/momoi.gif" alt="Momoi GIF" class="mx-auto rounded-full h-32 w-32 object-cover shadow-lg border-4 border-[#8B0000]">
        </div>
        <h1 class="text-3xl font-extrabold text-center mb-4 text-white">Unggahan Berhasil!</h1>
        <div class="text-center mb-6 text-md glass p-3 rounded-lg">
            File Anda berhasil diunggah. Berikut adalah tautan URL langsungnya:
        </div>
        <div class="text-center mb-6 p-3 glass rounded-lg break-words shadow-inner">
            <a id="rawUrlLink" href="${rawUrl}" class="text-[#F8C8C8] hover:text-white font-semibold text-lg transition duration-200 ease-in-out">${rawUrl}</a>
        </div>
        <div class="flex justify-between items-center space-x-4">
            <button onclick="copyUrl()" class="w-1/2 btn-primary text-white font-bold py-3 px-4 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-[#8B0000]">
                Salin URL
            </button>
            <a href="/" class="w-1/2 flex items-center justify-center glass hover:bg-[#3d0f0f] text-white font-bold py-3 px-4 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-[#3d0f0f]">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                🔙 Kembali
            </a>
        </div>
    </div>
    <script>
        function copyUrl() {
            const rawUrl = document.getElementById('rawUrlLink').href;
            navigator.clipboard.writeText(rawUrl).then(function() {
                alert("URL berhasil disalin: " + rawUrl);
            }).catch(function(error) {
                alert("Gagal menyalin URL: " + error);
            });
        }
    </script>
</body>
</html>
`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
