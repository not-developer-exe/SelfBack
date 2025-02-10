const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");

const connectDB = require("./db/db");
const User = require("./db/User");
const Hisab = require("./db/Hisab");

dotenv.config();
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
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect("/login");
};

// Home Route (Fetch user-specific hisabs)
// Home Route (Fetch User-Specific Hisabs)
app.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const hisabs = await Hisab.find({ userId });

    res.render("index", {
      files: hisabs, // ✅ Fetch files from DB
      session: req.session,
    });
  } catch (error) {
    console.error("Error fetching hisabs:", error);
    res.render("error", { message: "Something went wrong!" });
  }
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

// Create Hisab (Store in MongoDB)
app.get("/create", isAuthenticated, (req, res) => res.render("create", { error: null }));

app.post("/createhisab", isAuthenticated, async (req, res) => {
  try {
    const { filename, content, password, encrypt } = req.body;
    if (!filename || !content) return res.render("create", { error: "Filename and content are required!" });

    let fileContent = content;
    if (encrypt) {
      fileContent = CryptoJS.AES.encrypt(content, password).toString();
    }

    await Hisab.create({
      userId: req.session.user.id,
      filename,
      content: fileContent,
      encrypted: !!encrypt,
    });

    res.redirect("/");
  } catch (error) {
    console.error("Create Hisab Error:", error);
    res.render("create", { error: "Something went wrong!" });
  }
});

// View Hisab (Ask Password for Encrypted Files)
app.get("/hisab/:filename", isAuthenticated, async (req, res) => {
  try {
    const file = await Hisab.findOne({ userId: req.session.user.id, filename: req.params.filename }).lean();

    if (!file) return res.render("error", { message: "File not found!" });

    if (file.encrypted) {
      return res.render("decrypt", { filename: file.filename, error: null });
    }

    res.render("hisab", { filedata: file.content, filename: file.filename });
  } catch (error) {
    console.error("View Hisab Error:", error);
    res.render("error", { message: "Something went wrong!" });
  }
});

app.post("/decrypt/:filename", isAuthenticated, async (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const userId = req.session.user.id;

  try {
      const file = await Hisab.findOne({ filename, userId });

      if (!file || !file.encrypted) {
          return res.render("error", { message: "Invalid request!" });
      }

      const { password } = req.body;
      const bytes = CryptoJS.AES.decrypt(file.content, password);
      const decryptedContent = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedContent) {
          return res.render("decrypt", { filename, error: "Incorrect password!" });
      }

      res.render("hisab", { filename, filedata: decryptedContent });
  } catch (error) {
      res.render("error", { message: "Something went wrong!" });
  }
});

// Decrypt Hisab
app.post("/decrypt_edit/:filename", isAuthenticated, async (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const userId = req.session.user.id;

  try {
      const file = await Hisab.findOne({ filename, userId });

      if (!file || !file.encrypted) {
          return res.render("error", { message: "Invalid request!" });
      }

      const { password } = req.body;
      const bytes = CryptoJS.AES.decrypt(file.content, password);
      const decryptedContent = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedContent) {
          return res.render("decrypt_edit", { filename, error: "Incorrect password!" });
      }

      res.render("edit", { filename, filedata: decryptedContent, isEncrypted: true, error: null });
  } catch (error) {
      res.render("error", { message: "Something went wrong!" });
  }
});

// Edit Hisab
app.get("/edit/:filename", isAuthenticated, async (req, res) => {
  try {
    const file = await Hisab.findOne({ userId: req.session.user.id, filename: req.params.filename }).lean();

    if (!file) return res.render("error", { message: "File not found!" });

    if (file.encrypted) {
      return res.render("decrypt_edit", { filename: file.filename, error: null });
    }

    res.render("edit", { filename: file.filename, filedata: file.content, isEncrypted: file.encrypted });
  } catch (error) {
    console.error("Edit Hisab Error:", error);
    res.render("error", { message: "Something went wrong!" });
  }
});

// Update Hisab
app.post("/edit/:filename", isAuthenticated, async (req, res) => {
  try {
    const { content, password } = req.body;
    const file = await Hisab.findOne({ userId: req.session.user.id, filename: req.params.filename });

    if (!file) return res.render("error", { message: "File not found!" });

    let updatedContent = content;
    if (file.encrypted) {
      if (!password) return res.render("edit", { filename: file.filename, filedata: content, error: "Password required!" });
      updatedContent = CryptoJS.AES.encrypt(content, password).toString();
    }

    file.content = updatedContent;
    await file.save();

    res.redirect("/");
  } catch (error) {
    console.error("Update Hisab Error:", error);
    res.render("error", { message: "Something went wrong!" });
  }
});

// Delete Hisab
app.post("/delete/:filename", isAuthenticated, async (req, res) => {
  try {
    await Hisab.deleteOne({ userId: req.session.user.id, filename: req.params.filename });
    res.redirect("/");
  } catch (error) {
    console.error("Delete Hisab Error:", error);
    res.render("error", { message: "Failed to delete file!" });
  }
});

// Start Server
app.listen(3000, () => console.log("🚀 Server is running on port 3000"));