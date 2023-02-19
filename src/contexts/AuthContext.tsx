import { createContext, useEffect, useState } from "react";
import { recoverUserInformation, signInRequest } from "../api/auth";
import Router from "next/router";
import { setCookie, parseCookies, destroyCookie } from "nookies";

type User = {
  username: string;
  email: string;
};

export type SignInData = {
  identifier: string;
  password: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'nextauth.token': jwt } = parseCookies();

    if (jwt) {
     recoverUserInformation(jwt).then(response => {
      setUser(response);
     });
    }
  }, []);


  async function signIn({ identifier, password }) {
    try {
      const { user, jwt } = await signInRequest({ identifier, password });

      setCookie(undefined, "nextauth.token", jwt, {
        maxAge: 60 * 60 * 1, // 1 hour
      });

      setUser(user);

      Router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  function signOut() {
    destroyCookie(undefined, 'nextauth.token');
    setUser(null);
    Router.push('/');
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
