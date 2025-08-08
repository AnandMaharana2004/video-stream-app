
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "./models/userModel";
import { connectToDatabase } from "./utils/db/dbConnection";
import { signInSchema } from "./utils/validation/userValidation";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) {
          const error = new Error(parsed.error.errors[0].message || "Invalid credentials.");
          error.name = "ValidationError";
          throw error;
        }

        const { email, password } = parsed.data;
        await connectToDatabase();

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
          const error = new Error("No user found with this email.");
          error.name = "NoUser";
          throw error;
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          const error = new Error("Invalid password.");
          error.name = "InvalidPassword";
          throw error;
        }

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    newUser: "/sign-up",
  },
  callbacks: {
    // This runs whenever a user signs in (Google, Credentials, etc.)
    async signIn({ user, account, profile }) {

      // Only handle Google sign in here
      if (account?.provider === "google") {
        const google_id = account.providerAccountId;
        const email = user.email;
        const name = user.name || profile?.name || "";
        await connectToDatabase();
        // Find user by email
        let dbUser = await User.findOne({ email });

        if (!dbUser) {
          // If user does not exist, create a new user document
          dbUser = await User.create({
            username: name,
            email,
            google_id,
          });
        } else {
          // If user exists, update Google ID if needed
          if (!dbUser.google_id || dbUser.google_id !== google_id) {
            dbUser.google_id = google_id;
            await dbUser.save();
          }
        }
        user.id = dbUser._id.toString();
      }

      return true;
    },
  },
});