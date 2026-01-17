import {
  loginCustomer,
  loginDeliveryPartner,
  refreshAccessToken,
  fetchUser,
} from "../controllers/auth/auth.js";

import { verifyAccessToken } from "../middleware/auth.js";

import { updateUser } from "../controllers/tracking/user.js";

/* ======================================================
   AUTH ROUTES (FINAL – FIXED)
   ====================================================== */

export const authRoutes = async (fastify) => {
  // 🔐 CUSTOMER LOGIN
  fastify.post("/customer/login", loginCustomer);

  // 🔐 DELIVERY PARTNER LOGIN
  fastify.post("/delivery/login", loginDeliveryPartner);

  // 🔁 REFRESH TOKEN
  fastify.post("/refresh-token", refreshAccessToken);

  // 👤 FETCH USER (PROTECTED)
  fastify.get(
    "/user",
    { preHandler: verifyAccessToken },
    fetchUser
  );

  // 👤 UPDATE USER (PROTECTED)
  fastify.patch(
    "/user",
    { preHandler: verifyAccessToken },
    updateUser
  );
};
