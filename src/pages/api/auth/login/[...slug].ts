"use server";

import dbConnect from "@/lib/mongodb";
import Role from "@/models/role";
import User from "@/models/user";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { error } from "console";

const secret = "userToken";
const jwtKey = new TextEncoder().encode(secret);

export const encrypt = async (payload: any) => {
  // const  time = moment();

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h") // Token expires in 7 days
    .sign(jwtKey);

  return token;
};

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
        const { slug }:any = req.query;
        const userInfo = [...slug];
        const email = userInfo[0];
        const password = userInfo[1];

        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ error: "Authentication failed" });
        } else if (user.password !== password) {
          return res.status(401).json({ error: "Authentication password" });
        }
        const getRole = user.role_id;
        const role = await Role.findById(getRole);
        // const token = await generateToken({
        //   userId: user._id,
        //   userEmail: user.email,
        //   userPassword: user.password,
        // });
        // if (!token) {
        //   return res.status(401).json({ error: "Token not generated" });
        // }

        let data = {
          email,
          role: role.role_name,
          date: Date.now(),
        };
        // const session = await encrypt(data);

        // cookieStore.set("session", session, { httpOnly: true, expires: 10 });
        let stringData = JSON.stringify(data);
        const token = btoa(stringData);
        // const token = await encrypt(data);
        // const reversetoken = atob(token); // reverse btoa
        // res.setHeader("Set-Cookie", token);
        // console.log(token);
        res.status(200).json({
          success: true,
          data: {
            user: user,
            role: role,
            token: token,
            // reversetoken: reversetoken, // get original string
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
