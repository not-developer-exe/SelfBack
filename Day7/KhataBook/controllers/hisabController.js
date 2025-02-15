const CryptoJS = require("crypto-js");
const Hisab = require("../db/Hisab");

// Get All Hisabs (User-Specific)
exports.getHisabs = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const hisabs = await Hisab.find({ userId });
        res.render("index", { files: hisabs, session: req.session });
    } catch {
        res.render("error", { message: "Something went wrong!" });
    }
};

// Create Hisab
exports.createHisab = async (req, res) => {
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
    } catch {
        res.render("create", { error: "Something went wrong!" });
    }
};

// View Hisab
exports.viewHisab = async (req, res) => {
    try {
        const file = await Hisab.findOne({ userId: req.session.user.id, filename: req.params.filename }).lean();
        if (!file) return res.render("error", { message: "File not found!" });

        if (file.encrypted) {
            return res.render("decrypt", { filename: file.filename, error: null });
        }

        res.render("hisab", { filedata: file.content, filename: file.filename });
    } catch {
        res.render("error", { message: "Something went wrong!" });
    }
};

// Decrypt Hisab
exports.decryptHisab = async (req, res) => {
    try {
        const { password } = req.body;
        const file = await Hisab.findOne({ userId: req.session.user.id, filename: req.params.filename });

        if (!file || !file.encrypted) return res.render("error", { message: "Invalid request!" });

        const bytes = CryptoJS.AES.decrypt(file.content, password);
        const decryptedContent = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedContent) {
            return res.render("decrypt", { filename: file.filename, error: "Incorrect password!" });
        }

        res.render("hisab", { filename: file.filename, filedata: decryptedContent });
    } catch {
        res.render("error", { message: "Something went wrong!" });
    }
};

// Delete Hisab
exports.deleteHisab = async (req, res) => {
    try {
        await Hisab.deleteOne({ userId: req.session.user.id, filename: req.params.filename });
        res.redirect("/");
    } catch {
        res.render("error", { message: "Failed to delete file!" });
    }
};