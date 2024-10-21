import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"]
  }
}

export interface ImageState {
  file: File | null;
  scale: number;
  offsetX: number;
  offsetY: number;
}



export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  credit: number;
  stripeCustomerId: string | null;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  createdAt: Date;
}