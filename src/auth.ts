import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { authUtils } from "@/lib/auth-utils"
import { usersApi } from "@/lib/firestore-users"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const result = await authUtils.authenticate(
                    credentials.email as string,
                    credentials.password as string
                )

                if (!result.success || !result.userId) {
                    return null
                }

                const email = credentials.email as string;
                return {
                    id: result.userId,
                    email: email,
                    name: email.split('@')[0] || 'User',
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
    },
    callbacks: {
        async signIn({ user, account }) {
            try {
                // Check if user profile exists
                const profileResult = await usersApi.getProfile(user.id!);

                if (!profileResult.success || !profileResult.data) {
                    // Profile doesn't exist, create it
                    const nickname = user.name || user.email?.split('@')[0] || 'User';
                    await usersApi.createProfile(
                        user.id!,
                        user.email!,
                        nickname
                    );
                    console.log('✅ Auto-created profile for:', user.email);
                }

                return true;
            } catch (error) {
                console.error('Error in signIn callback:', error);
                return true; // Still allow sign-in even if profile creation fails
            }
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id
                token.email = user.email
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.email = token.email as string
            }
            return session
        },
    },
    // Security settings
    useSecureCookies: process.env.NODE_ENV === "production",
    secret: process.env.NEXTAUTH_SECRET,
})
