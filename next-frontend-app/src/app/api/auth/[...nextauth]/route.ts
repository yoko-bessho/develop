import NextAuth from "next-auth";
import "next-auth/jwt";
import { authOptions } from "../authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
