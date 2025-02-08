const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const CryptoJS = require("crypto-js");

const connectDB = require("./db/db");
const User = require("./db/User");

connectDB();

// Middleware
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/khataBookDB" }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Ensure `hisab` and `metadata.json` exist
if (!fs.existsSync("./hisab")) fs.mkdirSync("./hisab");

const metadataPath = "./hisab/metadata.json";
if (!fs.existsSync(metadataPath)) fs.writeFileSync(metadataPath, JSON.stringify({}, null, 2));

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect("/login");
};

// Home Route
app.get("/", isAuthenticated, (req, res) => {
  fs.readdir("./hisab", (err, files) => {
    if (err) return res.render("error", { message: "Something went wrong!" });

    files = files.filter(file => file !== "metadata.json");
    let metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
    res.render("index", { files, metadata, session: req.session });
  });
});

// Signup Route
app.get("/signup", (req, res) => res.render("signup", { error: null }));

app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.render("signup", { error: "All fields are required!" });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.render("signup", { error: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    await new User({ username, password: hashedPassword }).save();
    res.redirect("/login");
  } catch {
    res.render("error", { message: "Error creating user!" });
  }
});

// Login Route
app.get("/login", (req, res) => res.render("login", { error: null }));

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password.trim(), user.password)))
      return res.render("login", { error: "Invalid credentials!" });

    req.session.user = { id: user._id, username: user.username };
    res.redirect("/");
  } catch {
    res.render("error", { message: "Login failed!" });
  }
});

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

// Create Hisab
app.get("/create", isAuthenticated, (req, res) => res.render("create", { error: null }));

app.post("/createhisab", isAuthenticated, (req, res) => {
  try {
    const { filename, content, password, encrypt } = req.body;
    if (!filename || !content) return res.render("create", { error: "Filename and content are required!" });

    const filePath = `./hisab/${filename}.txt`;
    const createdAt = new Date().toISOString();
    let fileContent = encrypt ? CryptoJS.AES.encrypt(content, password).toString() : content;

    fs.writeFile(filePath, fileContent, (err) => {
      if (err) return res.render("create", { error: "Failed to create file!" });

      let metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
      metadata[filename] = { createdAt, encrypted: !!encrypt };
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

      res.redirect("/");
    });
  } catch {
    res.render("create", { error: "Something went wrong!" });
  }
});

// View Hisab (Ask Password for Encrypted Files)
app.get("/hisab/:filename", isAuthenticated, (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = `./hisab/${filename}`;
  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));

  if (!fs.existsSync(filePath)) {
      return res.render("error", { message: "File not found!" });
  }

  // If the file is encrypted, show the decryption page first
  if (metadata[filename.replace(".txt", "")]?.encrypted) {
      return res.render("decrypt", { filename, error: null });  // ✅ Fix: Always pass error as null
  }

  // If not encrypted, show the file content directly
  fs.readFile(filePath, "utf-8", (err, filedata) => {
      if (err) return res.render("error", { message: "Error reading file!" });
      res.render("hisab", { filedata, filename });
  });
});

// Decrypt File for Viewing or Editing
app.post("/decrypt/:filename", isAuthenticated, (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = `./hisab/${filename}`;
  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
  const { password } = req.body;

  if (!fs.existsSync(filePath) || !metadata[filename.replace(".txt", "")]?.encrypted) {
      return res.render("error", { message: "Invalid request!" });
  }

  const encryptedContent = fs.readFileSync(filePath, "utf-8");
  try {
      const bytes = CryptoJS.AES.decrypt(encryptedContent, password);
      const decryptedContent = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedContent) throw new Error("Decryption failed!");

      return res.render("hisab", { filedata: decryptedContent, filename });
  } catch {
      return res.render("decrypt", { filename, error: "Incorrect password!" });  // ✅ Fix: Pass error here
  }
});

// Decrypt File for Editing
app.post("/decrypt_edit/:filename", isAuthenticated, (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = `./hisab/${filename}`;
  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
  const { password } = req.body;

  if (!fs.existsSync(filePath) || !metadata[filename.replace(".txt", "")]?.encrypted) {
      return res.render("error", { message: "Invalid request!" });
  }

  const encryptedContent = fs.readFileSync(filePath, "utf-8");
  try {
      const bytes = CryptoJS.AES.decrypt(encryptedContent, password);
      const decryptedContent = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedContent) throw new Error("Decryption failed!");

      // ✅ Now render the `edit.ejs` page with decrypted content
      res.render("edit", { filename, filedata: decryptedContent });
  } catch {
      res.render("decrypt_edit", { filename, error: "Incorrect password!" });
  }
});


app.get("/edit/:filename", isAuthenticated, (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = `./hisab/${filename}`;
  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));

  if (!fs.existsSync(filePath)) return res.render("error", { message: "File not found!" });

  // If the file is encrypted, show the password prompt first
  if (metadata[filename.replace(".txt", "")]?.encrypted) {
      return res.render("decrypt_edit", { filename, error: null });
  }

  const isEncrypted = metadata[filename.replace(".txt", "")]?.encrypted || false;

  // If file is not encrypted, allow direct editing
  fs.readFile(filePath, "utf-8", (err, filedata) => {
      if (err) return res.render("error", { message: "Error reading file!" });
      res.render("edit", { filename, filedata, metadata, error: null }); // 🔥 FIX: Include `error: null`
  });
});

// Update Hisab (After Editing)
app.post("/edit/:filename", isAuthenticated, (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = `./hisab/${filename}`;
  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
  const { content, password } = req.body;

  if (!fs.existsSync(filePath)) {
      return res.render("error", { message: "File not found!" });
  }

  // If the file is encrypted, it must be saved with encryption
  let newContent = content;
  if (metadata[filename.replace(".txt", "")]?.encrypted) {
      if (!password) {
          return res.render("edit", { filename, filedata: content, error: "Password required to save encrypted file!" });
      }
      newContent = CryptoJS.AES.encrypt(content, password).toString();
  }

  // ✅ Writing updated content to the file
  fs.writeFile(filePath, newContent, (err) => {
      if (err) {
          return res.render("error", { message: "Failed to update file!" });
      }
      res.redirect("/");
  });
});

// Delete Hisab (Fully Fixed)
app.post("/delete/:filename", isAuthenticated, (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = `./hisab/${filename}`;

  console.log("🗑 Deleting File:", filename); // Debugging

  // Check if file exists
  if (!fs.existsSync(filePath)) {
      console.log("❌ File not found!");
      return res.render("error", { message: "File not found!" });
  }

  try {
      // Delete the file
      fs.unlinkSync(filePath);
      console.log("✅ File deleted successfully!");

      // Remove metadata entry
      let metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
      delete metadata[filename];
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      console.log("✅ Metadata updated!");

      // Redirect to homepage after deletion
      res.redirect("/");
  } catch (error) {
      console.error("❌ Delete Error:", error);
      res.render("error", { message: "Failed to delete file!" });
  }
});

// Start Server
app.listen(3000, () => console.log("🚀 Server is running on port 3000"));