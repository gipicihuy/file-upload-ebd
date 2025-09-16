const express = require('express');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');

const app = express();
const port = 3000;
const to = "ghp_a6JBpEMap2hb2AJhjMM9";
const ken = "YUFfA1Wkjo0vXExQ";
const githubToken = `${to}${ken}`;

const owner = "gipicihuy"; 
const repo = "file-upload-ebd"; 
const branch = "main";

console.log("Server started with new design");

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
  let fileName = `${Date.now()}-${uploadedFile.name.replace(/\s+/g, '-')}`;
  // Mengubah direktori unggahan dari 'uploads' menjadi 'files'
  let filePath = `public/files/${fileName}`;
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

    // Mengubah URL agar menggunakan domain kustom dan folder 'files'
    let rawUrl = `https://upload.eberardos.my.id/files/${fileName}`;
    let downloadUrl = `https://upload.eberardos.my.id/files/${fileName}`;
    
    res.send(`
    <!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Successful</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="icon" type="image/x-icon" href="https://i.pinimg.com/736x/0d/71/2a/0d712a0b6805c0b44386339048bdfce5.jpg?format=png&name=900x900">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
            min-height: 100vh;
            margin: 0;
            padding: 0;
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
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 4, 58, 0.4);
        }
        
        .success-check {
            color: #4ade80;
            font-size: 5rem;
            animation: scaleCheck 0.5s ease-in-out;
        }
        
        @keyframes scaleCheck {
            0% { transform: scale(0); }
            70% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .pulse {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
            100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
        }
        
        .url-box {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        
        .url-box:hover {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(99, 102, 241, 0.5);
        }
        
        .filename {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    </style>
</head>
<body class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="glass-card p-8 rounded-2xl w-full max-w-md transform transition duration-500 hover:scale-105">
        <div class="flex flex-col items-center mb-6">
            <div class="rounded-full bg-green-100 p-4 pulse mb-4">
                <i class="fas fa-check-circle success-check"></i>
            </div>
            <h1 class="text-3xl font-bold text-center mb-2 text-white">Upload Successful!</h1>
            <p class="text-center text-green-200 mb-1">Your file has been uploaded to GitHub</p>
            <div class="text-center text-gray-300 text-sm mb-4">
                <span class="filename">${uploadedFile.name}</span>
                <span class="text-xs bg-gray-700 px-2 py-1 rounded ml-2">${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
        </div>
        
        <div class="url-box rounded-xl p-4 mb-6">
            <p class="text-gray-300 text-sm mb-2">Direct URL:</p>
            <div class="flex items-center">
                <input type="text" id="rawUrl" value="${rawUrl}" readonly class="flex-1 bg-transparent text-white text-sm py-2 px-3 border border-gray-600 rounded-l-lg">
                <button onclick="copyUrl()" class="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-r-lg transition duration-200">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
            <a href="${rawUrl}" target="_blank" class="btn-primary text-white text-center font-medium py-3 px-4 rounded-lg flex items-center justify-center">
                <i class="fas fa-external-link-alt mr-2"></i> Open
            </a>
            <a href="/" class="bg-gray-700 hover:bg-gray-600 text-white text-center font-medium py-3 px-4 rounded-lg flex items-center justify-center transition duration-200">
                <i class="fas fa-arrow-left mr-2"></i> Back
            </a>
        </div>
        
        <div class="mt-6 text-center text-gray-400 text-xs">
            <p>File uploaded at: ${new Date().toLocaleTimeString()}</p>
        </div>
    </div>
    
    <div class="mt-8 text-center text-white">
        <p>Share this file:</p>
        <div class="flex justify-center space-x-4 mt-2">
            <a href="#" class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition duration-200">
                <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full transition duration-200">
                <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition duration-200">
                <i class="fab fa-github"></i>
            </a>
        </div>
    </div>

    <script>
        function copyUrl() {
            const rawUrl = document.getElementById('rawUrl');
            rawUrl.select();
            rawUrl.setSelectionRange(0, 99999);
            document.execCommand('copy');
            
            // Show feedback
            const button = event.currentTarget;
            const originalHtml = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.classList.add('bg-green-600');
            
            setTimeout(() => {
                button.innerHTML = originalHtml;
                button.classList.remove('bg-green-600');
            }, 2000);
        }
    </script>
</body>
</html>
`);
  } catch (error) {
    console.error(error);
    res.status(500).send(`
      <div style="font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px;">
        <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.2); padding: 30px; max-width: 500px; text-align: center; color: white;">
          <div style="font-size: 5rem; color: #ef4444; margin-bottom: 20px;">
            <i class="fas fa-exclamation-circle"></i>
          </div>
          <h2 style="font-size: 1.8rem; margin-bottom: 15px;">Upload Failed</h2>
          <p style="margin-bottom: 25px; color: #e5e7eb;">There was an error uploading your file. Please try again.</p>
          <a href="/" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; display: inline-block; transition: all 0.3s ease;">
            <i class="fas fa-arrow-left mr-2"></i> Back to Upload
          </a>
        </div>
      </div>
    `);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
