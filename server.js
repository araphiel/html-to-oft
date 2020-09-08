const fs = require("fs");
const express = require("express");
const fileUpload = require("express-fileupload");
const archiver = require("archiver");

const app = express();

// Middleware
app.use(fileUpload());
app.use(express.static("public"));

// Routes
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/upload", (request, response) => {
  if (!request.files || Object.keys(request.files).length === 0) {
    return response.status(400).send("No files were uploaded.");
  }

  // Get email data
  const { emailFile } = request.files;
  const emailHTML = emailFile.data.toString("utf8");
  
  const filename = emailFile.name
  const basename = filename.replace('.html', '')

  // Get title from email
  const emailTitle = getEmailTitle(emailHTML);

  // Get formatted email
  const parsedEmlData = emlFormat(emailTitle, emailHTML);

  // Create zip archive
  const archive = archiver("zip");

  // Set download name
  response.attachment(`${basename}.zip`);

  // Pipe zip file into express
  archive.pipe(response);
  
  // Pass HTML version to zip
  archive.append(emailFile.data, { name: filename })
  
  // Add Outlook formats to zip
  const formats = ["eml", "emltpl"];
  formats.forEach(format =>
    archive.append(Buffer.from(parsedEmlData), {
      name: `${basename}.${format}`
    })
  );

  archive.finalize();
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// Helper functions
function getEmailTitle(string) {
  if (!string.match(/<title>(.+)<\/title>/)) return;
  return string.match(/<title>(.+)<\/title>/)[1];
}

function emlFormat(title, html) {
  return `To: \nSubject: ${title} \nX-Unsent: 1\nContent-Type: text/html\n\n${html}`;
}
