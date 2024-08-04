'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";

export default function SignInButton() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      localStorage.setItem('jwtToken', session.accessToken);
    }
  }, [session]);

  const handleSignIn = () => {
    signIn("google");
  };

  const handleSignOut = () => {
    signOut();
    localStorage.removeItem('jwtToken');
  };

  if (session) {
    return (
      <div className="flex flex-col items-center gap-2">
        <p>Signed in as {session.user?.email}</p>
        <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
      </div>
    );
  }
  return <Button onClick={handleSignIn}>Sign in with Google</Button>;
}