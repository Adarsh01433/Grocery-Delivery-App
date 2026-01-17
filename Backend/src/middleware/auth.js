import jwt from "jsonwebtoken";

export const verifyAccessToken = async (req, reply) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔥 FIX 1: startsWith (not startWith)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({
        message: "Access token required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // attach user to request
    req.user = decoded; // { userId, role }

  } catch (error) {
    return reply.status(401).send({
      message: "Invalid or expired access token",
    });
  }
};
