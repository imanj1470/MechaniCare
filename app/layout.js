import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "MechaniCare",
  description: "AI Mechanic Buddy",
};

export default function RootLayout({ children }) {

  return (
      <ClerkProvider>
    <html lang="en">
    <body className={`${poppins.className}`} >
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          {children}
        </body>
    </html>
    </ClerkProvider>
  );
}//className={`${poppins.className}`}