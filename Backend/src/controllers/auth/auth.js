import { Customer, DeliveryPartner } from "../../models/user.js";
import jwt from "jsonwebtoken";

/* ======================================================
   SAFETY: ENV CHECK (MANDATORY)
   ====================================================== */
if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("JWT secrets are missing in environment variables");
}

/* ======================================================
   TOKEN GENERATOR
   ====================================================== */
const generateTokens = (user) => {
  if (!user || !user._id || !user.role) {
    throw new Error("Invalid user object passed to generateTokens");
  }

  const payload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

/* ======================================================
   CUSTOMER LOGIN (FIXED + TOKEN ROTATION READY)
   ====================================================== */
export const loginCustomer = async (req, reply) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return reply.status(400).send({ message: "Phone is required" });
    }

    let customer = await Customer.findOne({ phone });

    if (!customer) {
      customer = new Customer({
        phone,
        role: "Customer",
        isActivated: true,
      });
    }

    const { accessToken, refreshToken } = generateTokens(customer);

    // 🔒 STORE REFRESH TOKEN (VERY IMPORTANT)
    customer.refreshToken = refreshToken;
    await customer.save();

    return reply.send({
      message: "Login Successful",
      accessToken,
      refreshToken,
      customer,
    });

  } catch (error) {
    console.error("LOGIN CUSTOMER ERROR:", error);
    return reply.status(500).send({
      message: "Error occurred in loginCustomer controller",
    });
  }
};

/* ======================================================
   DELIVERY PARTNER LOGIN (LOGIC CLEANED)
   ====================================================== */
export const loginDeliveryPartner = async (req, reply) => {
  try {
    const { email, password } = req.body;

    const deliveryPartner = await DeliveryPartner.findOne({ email });

    if (!deliveryPartner) {
      return reply.status(404).send({ message: "Delivery Partner not found" });
    }

    // ⚠️ TEMP: plain password (hash later)
    if (password !== deliveryPartner.password) {
      return reply.status(400).send({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(deliveryPartner);

    deliveryPartner.refreshToken = refreshToken;
    await deliveryPartner.save();

    return reply.send({
      message: "Login Successful",
      accessToken,
      refreshToken,
      deliveryPartner,
    });

  } catch (error) {
    console.error("LOGIN DELIVERY ERROR:", error);
    return reply.status(500).send({ message: "An error occurred" });
  }
};

/* ======================================================
   REFRESH TOKEN (SECURE + ROTATION)
   ====================================================== */
export const refreshAccessToken = async (req, reply) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return reply.status(401).send({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    let user;

    if (decoded.role === "Customer") {
      user = await Customer.findById(decoded.userId);
    } else if (decoded.role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(decoded.userId);
    } else {
      return reply.status(403).send({ message: "Invalid role" });
    }

    if (!user || user.refreshToken !== refreshToken) {
      return reply.status(403).send({
        message: "Token reuse detected. Please login again.",
      });
    }

    // 🔁 ROTATE TOKENS
    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return reply.send({
      message: "Token refreshed",
      ...tokens,
    });

  } catch (error) {
    return reply.status(403).send({ message: "Invalid refresh token" });
  }
};

/* ======================================================
   FETCH USER (SAFE)
   ====================================================== */
export const fetchUser = async (req, reply) => {
  try {
    const { userId, role } = req.user;

    let user;

    if (role === "Customer") {
      user = await Customer.findById(userId);
    } else if (role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(userId);
    } else {
      return reply.status(403).send({ message: "Invalid role" });
    }

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    return reply.send({
      message: "User fetched successfully",
      user,
    });

  } catch (error) {
    return reply.status(500).send({ message: "An error occurred" });
  }
};
