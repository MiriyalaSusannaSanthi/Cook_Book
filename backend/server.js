origin: function (origin, callback) {
    if (
      !origin ||
      origin === "http://localhost:5173" ||
      origin === "http://localhost:3000" ||
      origin.endsWith(".vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },