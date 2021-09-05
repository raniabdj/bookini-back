const { User } = require("../Models/User");
const app = require("express")();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/authentication");

require("dotenv");

// Register
app.post(
  "/register",
  async (req, res) => {
    console.log('hello',__dirname)
    try {
      var user= new User({
        fullName:req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        role: req.body.role,
      });
      await user.save();
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// Login
app.post(
  "/login",
  async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email }).select("+password");
      if (!user)
        return res.status(400).json({
          success: false,
          message: "User Not Exist",
        });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          success: false,
          message: "Incorrect Password !",
        });
      const payload = {
        user: { id: user.id, role: user.role },
      };
      jwt.sign(
        payload,
        process.env.TOKEN_PASSPHRASE,
        { expiresIn: process.env.TOKEN_EXPIRES_IN },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            success: true,
            data: {
              token,
              name: user.fullName,
              email: user.email,
              role: user.role,
            },
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// Get all user with pagination
app.get("/", (req, res) => {
  const { limit, offset } = getPagination(req.query.page - 1, 4);
  User.paginate({}, { offset, limit, select: "-createdAt" })
    .then((result) => {
      res.json({
        success: true,
        totalItems: result.totalDocs,
        data: result.docs,
        totalPages: result.totalPages,
        currentPage: result.page,
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
});

module.exports = app;