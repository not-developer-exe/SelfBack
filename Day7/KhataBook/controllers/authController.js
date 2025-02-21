const bcrypt = require("bcryptjs");
const User = require("../db/User");

// Signup Controller
exports.signup = async (req, res) => {
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
};

// Login Controller
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password.trim(), user.password))) {
            return res.render("login", { error: "Invalid credentials!" });
        }

        req.session.user = { id: user._id.toString(), username: user.username };
        res.redirect("/");
    } catch {
        res.render("error", { message: "Login failed!" });
    }
};

// Logout Controller
exports.logout = (req, res) => {
    req.session.destroy(() => res.redirect("/login"));
};