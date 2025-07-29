"use server";

import dbConnect from "@/lib/mongodb";
import Role from "@/models/role";
import User from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";
// import { cookies } from "next/headers";
// import { SignJWT, jwtVerify } from "jose";
// import { error } from "console";

// const secret = "userToken";
// const jwtKey = new TextEncoder().encode(secret);

// export const encrypt = async (payload: any) => {
//   // const  time = moment();

//   const token = await new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("1h") // Token expires in 7 days
//     .sign(jwtKey);

//   return token;
// };

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  // const cookieStore = await cookies();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { slug } = req.query;
        const email = slug;

        const user = await User.findOne({ email });
        const role = await Role.findById({ _id: user.role_id });

        res.status(200).json({
          success: true,
          data: {
            user: user,
            role: role,
          },
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
        res.status(201).json({ success: true, data: "not accepting post" });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
