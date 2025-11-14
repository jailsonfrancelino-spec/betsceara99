
import React, { useState } from 'react';
import { CurrencyDollarIcon } from './Icons';

interface LoginPageProps {
  onLogin: (user: string, pass: string) => boolean;
  onRegister: (user: string, pass: string) => boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(username, password);
    if (!success) {
      setError('Usuário ou senha inválidos.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Usuário e senha são obrigatórios.');
      return;
    }
    setError('');
    const success = onRegister(username, password);
    if (!success) {
      setError('Usuário já existe.');
    }
    else {
        alert('Cadastro realizado com sucesso! Faça o login.');
        setIsRegistering(false);
        setUsername('');
        setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3">
                <CurrencyDollarIcon className="w-10 h-10 text-cyan-400"/>
                <h1 className="text-3xl font-extrabold text-white">
                    Gerenciador de Cambistas BetsCeara99
                </h1>
            </div>
            <p className="text-gray-400 mt-2">{isRegistering ? 'Crie sua conta' : 'Acesse sua conta'}</p>
        </div>

        <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors"
          >
            {isRegistering ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
            <button onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setUsername('');
                setPassword('');
             }} className="text-sm text-cyan-400 hover:text-cyan-300">
                {isRegistering ? 'Já tem uma conta? Entrar' : 'Não tem uma conta? Cadastre-se'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;