function checkOrigin(req, res, next) {
  const origin = req.get("origin") || req.get("referer");

  if (origin && origin.includes("http://localhost:3000")) {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Invalid origin" });
  }
}

module.exports = checkOrigin;
