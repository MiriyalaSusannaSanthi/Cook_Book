const admin = require("../config/firebase");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const firebaseLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, name, email, picture } = decoded;

    // Use name from token, fallback to email prefix (never "SmartChef User")
    const displayName = name || email.split("@")[0];

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // New user — create with proper name
      user = await User.create({
        firebaseUid: uid,
        name: displayName,
        email,
        photoURL: picture || "",
      });
    } else if (!user.name || user.name === "SmartChef User") {
      // Existing user with bad name — fix it
      user.name = displayName;
      await user.save();
    }

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