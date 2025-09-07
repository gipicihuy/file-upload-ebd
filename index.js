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
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
            min-height: 100vh;
            color: #e2e8f0;
        }
        
        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .glass-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.36);
        }
        
        .glass-button {
            background: rgba(167, 139, 250, 0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        
        .glass-button:hover {
            background: rgba(167, 139, 250, 0.3);
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        
        .floating { 
            animation: floating 3s ease-in-out infinite;
        }
        
        @keyframes floating {
            0% { transform: translate(0, 0px); }
            50% { transform: translate(0, 10px); }
            100% { transform: translate(0, -0px); }
        }
    </style>
</head>
<body class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="glass-card p-8 w-full max-w-md transform transition-all duration-300">
        <div class="mb-6 text-center">
            <div class="floating inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-400">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            </div>
        </div>
        <h1 class="text-3xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">Unggahan Berhasil!</h1>
        <div class="text-center mb-6 text-md glass-card p-3 rounded-lg">
            File Anda berhasil diunggah. Berikut adalah tautan URL langsungnya:
        </div>
        <div class="text-center mb-6 p-3 glass-card rounded-lg break-words">
            <a id="rawUrlLink" href="${rawUrl}" class="text-green-300 hover:text-green-100 font-semibold text-lg transition duration-200 ease-in-out">${rawUrl}</a>
        </div>
        <div class="flex justify-between items-center space-x-4">
            <button onclick="copyUrl()" class="w-1/2 glass-button text-white font-bold py-3 px-4 rounded-full transform hover:scale-105 transition duration-300 ease-in-out">
                Salin URL
            </button>
            <a href="/" class="w-1/2 flex items-center justify-center glass-button text-white font-bold py-3 px-4 rounded-full transform hover:scale-105 transition duration-300 ease-in-out">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Kembali
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
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error - EBD Upload</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class="bg-red-900 bg-opacity-50 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-2xl max-w-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-2xl font-bold text-red-200 mb-2">Error Mengunggah File</h2>
          <p class="text-red-100 mb-6">Terjadi kesalahan saat mengunggah file. Silakan coba lagi.</p>
          <a href="/" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition duration-300">
            Kembali
          </a>
        </div>
      </body>
      </html>
    `);
  }
});

app.listen(port, () => {
  console.log(`Server EBD Upload running at http://localhost:${port}`);
});
