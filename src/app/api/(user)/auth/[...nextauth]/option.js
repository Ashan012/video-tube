import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/models/users.model";
import { ApiError } from "@/utils/ApiError";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Username/email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await dbconnect();

        console.log(credentials);
        try {
          const user = await UserModel.findOne({
            $or: [
              { username: credentials.identifier },
              { email: credentials.identifier },
            ],
          });

          if (!user) {
            throw new ApiError("user not found", 404);
          }
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordValid) {
            throw new ApiError("password was incorrect", 401);
          }
          return user;
        } catch (error) {
          throw new Error(error?.message || "login failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id.toString();
        token.username = user.username;
        token.fullName = user.fullName;
        token.email = user.email;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session._id = token._id;
        session.username = token.username;
        session.fullName = token.fullName;
        session.email = token.email;
        session.avatar = token.avatar;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
