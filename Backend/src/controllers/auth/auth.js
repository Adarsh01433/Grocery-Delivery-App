import { Customer, DeliveryPartner } from "../../models/user.js";
import jwt from "jsonwebtoken";

/* ======================================================
   TOKEN GENERATOR (FIXED)
   ====================================================== */
const generateTokens = (user) => {
  if (!user || !user._id || !user.role) {
    throw new Error("Invalid user object passed to generateTokens");
  }

  const accessToken = jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

/* ======================================================
   CUSTOMER LOGIN (FIXED)
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
      await customer.save();
    }

    // 🔥 FIX: pass FULL user object
    console.log("ACCESS:", process.env.ACCESS_TOKEN_SECRET);
console.log("REFRESH:", process.env.REFRESH_TOKEN_SECRET);
    const { accessToken, refreshToken } = generateTokens(customer);

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
   DELIVERY PARTNER LOGIN (FIXED LOGIC)
   ====================================================== */
export const loginDeliveryPartner = async (req, reply) => {
  try {
    const { email, password } = req.body;

    const deliveryPartner = await DeliveryPartner.findOne({ email });

    if (!deliveryPartner) {
      return reply.status(404).send({ message: "Delivery Partner not found" });
    }

    // ❗ password check (plain for now)
    const isMatch = password === deliveryPartner.password;

    if (!isMatch) {
      return reply.status(400).send({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(deliveryPartner);

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
   REFRESH TOKEN (FIXED)
   ====================================================== */
export const refreshToken = async (req, reply) => {
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

    if (!user) {
      return reply.status(403).send({ message: "User not found" });
    }

    const tokens = generateTokens(user);

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
