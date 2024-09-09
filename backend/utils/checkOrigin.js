function checkOrigin(req, res, next) {
  const origin = req.get("origin") || req.get("referer");

  if (
    origin &&
    (origin.includes("http://localhost:3000") ||
      origin.includes("https://find-your-lost-pet.vercel.app"))
  ) {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Invalid origin" });
  }
}

module.exports = checkOrigin;
