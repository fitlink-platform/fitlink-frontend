import { useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { getProfile } from '~/services/userService';

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("Đang gọi getProfile...")
        const data = await getProfile()
        console.log('Get Profile:', data);
        
        setUser(data);
      } catch {
        console.error('Lỗi getProfile:');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}