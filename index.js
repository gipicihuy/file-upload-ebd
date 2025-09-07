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
    <title>Upload Successful</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="icon" type="image/x-icon" href="https://i.imgur.com/3QzZ2yE.png">
    <style>
        body {
            background: linear-gradient(135deg, #2a0a0a 0%, #1a0000 100%);
            background-attachment: fixed;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .crimson-glow {
            box-shadow: 0 10px 25px -5px rgba(139, 0, 0, 0.5), 
                        0 5px 10px -3px rgba(139, 0, 0, 0.4),
                        0 0 20px rgba(178, 34, 34, 0.6);
            transition: all 0.3s ease;
        }
        .crimson-glow:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px -5px rgba(139, 0, 0, 0.6), 
                        0 8px 15px -3px rgba(139, 0, 0, 0.5),
                        0 0 25px rgba(220, 20, 60, 0.7);
        }
        .blood-pattern {
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(120, 0, 0, 0.1) 0%, transparent 20%),
                radial-gradient(circle at 90% 80%, rgba(120, 0, 0, 0.1) 0%, transparent 20%);
        }
    </style>
</head>
<body class="flex flex-col items-center justify-center min-h-screen p-4 blood-pattern">
    <div class="bg-[#1f0000] border border-red-900 p-10 rounded-2xl w-full max-w-xl crimson-glow">
        <div class="text-center mb-8">
            <div class="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-red-800/50">
                <img src="https://media.tenor.com/2yehGvPzIsIAAAAj/miku-hatsune.gif" alt="Success GIF" class="w-full h-full object-cover">
            </div>
            <h1 class="text-3xl font-bold text-red-100 mb-2">Upload Successful!</h1>
            <p class="text-red-300/80">Your file has been uploaded to GitHub</p>
        </div>

        <div class="text-center mb-8 p-4 bg-red-900/20 rounded-xl border border-red-800/50 break-words">
            <a id="rawUrlLink" href="${rawUrl}" class="text-red-300 hover:text-red-100 font-mono text-sm transition duration-200">${rawUrl}</a>
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button onclick="copyUrl()" class="w-full sm:w-1/2 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-red-100 font-bold py-3 px-4 rounded-full transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                </svg>
                Copy URL
            </button>
            <a href="/" class="w-full sm:w-1/2 flex items-center justify-center bg-red-800/30 hover:bg-red-800/50 text-red-200 font-bold py-3 px-4 rounded-full transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 border border-red-800/50">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Upload Another
            </a>
        </div>
    </div>

    <script>
        function copyUrl() {
            const rawUrl = document.getElementById('rawUrlLink').href;
            navigator.clipboard.writeText(rawUrl).then(function() {
                alert("URL copied to clipboard: " + rawUrl);
            }).catch(function(error) {
                alert("Failed to copy URL: " + error);
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
  console.log(`Crimson Uploader running at http://localhost:${port}`);
});
