// File location: /src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

// Types for better type safety
export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserDocument {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Benutzername und Passwort sind erforderlich');
        }

        try {
          const { db } = await connectToDatabase();
          
          const user = await db.collection('users').findOne({ 
            username: credentials.username 
          }) as UserDocument | null;
          
          if (!user) {
            throw new Error('Kein Benutzer mit diesem Benutzernamen gefunden');
          }
          
          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            throw new Error('Falsches Passwort');
          }
          
          return { 
            id: user._id.toString(), 
            name: user.username, 
            email: user.email,
            image: null // Add profile image support if needed
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error(error instanceof Error ? error.message : 'Es ist ein Fehler bei der Anmeldung aufgetreten');
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user ID to the token when signing in
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID to the session
      if (session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    }
  },
  // Improved error handling
  logger: {
    error(code, metadata) {
      console.error(`Auth error [${code}]:`, metadata);
    },
  },
  // More secure JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Better debug options for development
  debug: process.env.NODE_ENV === 'development',
};

export default authOptions;