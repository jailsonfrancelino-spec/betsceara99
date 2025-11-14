
import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import MainApp from './MainApp';

// Para simplicidade, usando um objeto simples para o armazenamento de usuários.
// Em um aplicativo real, isso seria mais complexo e provavelmente envolveria hashing de senhas.
type UserStore = Record<string, string>;

const App: React.FC = () => {
  const [users, setUsers] = useState<UserStore>({
    jailson: '121212'
  });
  const [authenticatedUser, setAuthenticatedUser] = useState<string | null>(null);

  // Carrega usuários do localStorage na renderização inicial
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('cambistas_users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        // Se não houver usuários no armazenamento, salva o padrão
        localStorage.setItem('cambistas_users', JSON.stringify({ jailson: '121212' }));
      }
    } catch (error) {
      console.error("Falha ao carregar usuários do localStorage", error);
    }
  }, []);

  const handleLogin = (user: string, pass: string): boolean => {
    if (users[user] && users[user] === pass) {
      setAuthenticatedUser(user);
      return true;
    }
    return false;
  };

  const handleRegister = (user: string, pass: string): boolean => {
    if (users[user]) {
      return false; // Usuário já existe
    }
    const newUsers = { ...users, [user]: pass };
    setUsers(newUsers);
    try {
      localStorage.setItem('cambistas_users', JSON.stringify(newUsers));
    } catch (error) {
      console.error("Falha ao salvar usuários no localStorage", error);
      // Opcionalmente reverte o estado se a gravação falhar
      setUsers(users);
      return false;
    }
    return true;
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
  };

  if (!authenticatedUser) {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return <MainApp onLogout={handleLogout} />;
};

export default App;
