const admin = require("../config/firebase");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const firebaseLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, name, email, picture } = decoded;

    // Find or create user in MongoDB
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        name: name || "SmartChef User",
        email,
        photoURL: picture || "",
      });
    }

    // Issue our own JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    console.error("Firebase login error:", error.message);
    res.status(401).json({ message: "Invalid Firebase token" });
  }
};

module.exports = { firebaseLogin };