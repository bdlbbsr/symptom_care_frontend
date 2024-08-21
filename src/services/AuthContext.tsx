import Cookies from 'js-cookie';
import React, { createContext, useContext, useState, ReactNode, FC, useEffect } from 'react';

// Define the shape of the user data
interface User {
  role: string;
  _id: string;
  name: string;
  email: string;
  token: string;
  userId: string;
  // Add any other user-related properties here
}

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const authData = Cookies.get('auth');
    if (authData) {
      try {
        const parsedUser = JSON.parse(authData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse auth data from cookies:", error);
        Cookies.remove('auth'); // Clean up if parsing fails
      }
    }
  }, []);

  const login = async (userData: User) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      Cookies.set('auth', JSON.stringify(data), { expires: 7, secure: true });
      setUser(data);
    } catch (error) {
      console.error("Login error:", error);
      // Handle the error (e.g., show a notification to the user)
    }
  };

  const logout = () => {
    Cookies.remove('auth');
    localStorage.removeItem('area');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
