'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from 'react';

export default function SignInButton() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      // Store the token in localStorage
      console.log(session)
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
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={handleSignOut}>Sign out</button>
      </>
    );
  }
  return <button onClick={handleSignIn}>Sign in with Google</button>;
}