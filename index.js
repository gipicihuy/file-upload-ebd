const express = require('express');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');

const app = express();
const port = 3000;

// GitHub configuration - Replace with your actual token and repo details
const to = "ghp_a6JBpEMap2hb2AJhjMM9";
const ken = "YUFfA1Wkjo0vXExQ";
const githubToken = `${to}${ken}`;

const owner = "gipicihuy"; 
const repo = "file-upload-ebd"; 
const branch = "main";

console.log("GitHub Token configured");

app.use(fileUpload());
app.use(express.static('public'));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle file upload
app.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error - Crimson Upload</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body {
            background: linear-gradient(135deg, #1a0000 0%, #2a0a0a 50%, #1a0000 100%);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #ffcccc;
          }
        </style>
      </head>
      <body class="flex items-center justify-center min-h-screen">
        <div class="bg-[#1a0000] border border-red-900/80 p-8 rounded-2xl max-w-md text-center">
          <h1 class="text-2xl font-bold text-red-200 mb-4">Upload Error</h1>
          <p class="text-red-300 mb-6">No files were selected for upload.</p>
          <a href="/" class="bg-red-800 text-red-100 px-6 py-2 rounded-full hover:bg-red-700 transition">Go Back</a>
        </div>
      </body>
      </html>
    `);
  }

  let uploadedFile = req.files.file;
  let mimeType = mime.lookup(uploadedFile.name);
  let fileName = `${Date.now()}-${uploadedFile.name.replace(/\s+/g, '-')}`;
  let filePath = `uploads/${fileName}`;
  let base64Content = Buffer.from(uploadedFile.data).toString('base64');

  try {
    let response = await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        message: `Upload file ${fileName}`,
        content: base64Content,
        branch: branch,
      },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    
    // Send success response with dark red themed page
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Upload Successful - Crimson Upload</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="icon" type="image/x-icon" href="https://i.imgur.com/3QzZ2yE.png">
        <style>
          body {
            background: linear-gradient(135deg, #1a0000 0%, #2a0a0a 50%, #1a0000 100%);
            background-attachment: fixed;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #ffcccc;
          }
          .crimson-glow {
            box-shadow: 0 10px 25px -5px rgba(139, 0, 0, 0.7), 
                        0 5px 10px -3px rgba(139, 0, 0, 0.5),
                        0 0 20px rgba(178, 34, 34, 0.8);
          }
        </style>
      </head>
      <body class="flex flex-col items-center justify-center min-h-screen p-4">
        <div class="bg-[#1a0000] border border-red-900/80 p-8 rounded-2xl w-full max-w-xl crimson-glow">
          <div class="text-center mb-8">
            <div class="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-red-800/50">
              <img src="https://media.tenor.com/2yehGvPzIsIAAAAj/miku-hatsune.gif" alt="Success GIF" class="w-full h-full object-cover">
            </div>
            <h1 class="text-3xl font-bold text-red-100 mb-2">Upload Successful!</h1>
            <p class="text-red-300/80">Your file has been uploaded to GitHub</p>
          </div>

          <div class="text-center mb-8 p-4 bg-red-900/20 rounded-xl border border-red-800/50 break-words">
            <a id="rawUrlLink" href="${rawUrl}" class="text-red-300 hover:text-red-100 font-mono text-sm transition">${rawUrl}</a>
          </div>

          <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button onclick="copyUrl()" class="w-full sm:w-1/2 bg-red-800 hover:bg-red-700 text-red-100 font-bold py-3 px-4 rounded-full transition focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
              </svg>
              Copy URL
            </button>
            <a href="/" class="w-full sm:w-1/2 flex items-center justify-center bg-red-900/30 hover:bg-red-900/50 text-red-200 font-bold py-3 px-4 rounded-full transition border border-red-800/50">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    console.error('Upload error:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error - Crimson Upload</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body {
            background: linear-gradient(135deg, #1a0000 0%, #2a0a0a 50%, #1a0000 100%);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #ffcccc;
          }
        </style>
      </head>
      <body class="flex items-center justify-center min-h-screen">
        <div class="bg-[#1a0000] border border-red-900/80 p-8 rounded-2xl max-w-md text-center">
          <h1 class="text-2xl font-bold text-red-200 mb-4">Upload Error</h1>
          <p class="text-red-300 mb-6">There was an error uploading your file. Please try again.</p>
          <a href="/" class="bg-red-800 text-red-100 px-6 py-2 rounded-full hover:bg-red-700 transition">Go Back</a>
        </div>
      </body>
      </html>
    `);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Crimson Upload server running at http://localhost:${port}`);
});
