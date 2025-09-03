import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { SignInAction, loginwithgoogleAction } from "@/actions/authentication"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "you@example.com",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "********",
                },

            },
            async authorize(credentials) {
                const { email, password } = credentials as {
                    email: string
                    password: string
                }

                const result = await SignInAction(email, password)

                console.log("result inside auth.ts", result)
                if (result?.status && result.data) {
                    const { username, email, _id } = result.data
                    return {
                        id: _id.toString(),
                        name: username,
                        email: email,
                    };
                }
                return null
            }

        }),
    ],

    // Optional: Callbacks (to control JWT & Session)
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
                token.name = user.name
                // token.picture = user.image
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.name = token.name as string
                // session.user.image = token.picture as string
            }
            return session
        },
        // This is where you handle the redirect after a successful sign-in.
        async signIn({ user, account, profile }) {
            if (account?.provider == "google") {
                const google_id = account.providerAccountId
                const { email, name } = user
                const result = await loginwithgoogleAction(google_id, email ?? '', profile?.picture ?? '', name ?? '')
                if (result?.status && result.data?._id) {
                    // Correctly override the user object's id with the MongoDB _id
                    user.id = result.data._id.toString();
                } else {
                    // Handle the case where the action failed to return a valid ID
                    return false;
                }

            }
            if (user) {
                return true;
            }
            return false;
        }
    },
    pages: {
        signIn: "/log-in",
    },

    secret: process.env.AUTH_SECRET,
    trustHost: true
})
