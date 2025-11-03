import { createContext, useContext, useEffect, useState } from 'react';
import { getMe } from './auth.api';
import type { User } from './auth.types';

type AuthCtx = { ready: boolean; user: User; setUser: (u: User) => void; setToken: (t: string|null)=>void; };

const Ctx = createContext<AuthCtx>({ ready:false, user:null, setUser:()=>{}, setToken:()=>{} });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User>(null);

  const setToken = (t: string|null) => {
    if (!t) localStorage.removeItem('token');
    else localStorage.setItem('token', t);
  };

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) { setReady(true); return; }
    getMe()
      .then((u) => setUser(u))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setReady(true));
  }, []);

  return <Ctx.Provider value={{ ready, user, setUser, setToken }}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);
