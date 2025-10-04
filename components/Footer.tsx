import React, { useState } from 'react';

interface FooterProps {
  onLoginSuccess: () => void;
}

const Footer: React.FC<FooterProps> = ({ onLoginSuccess }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '1234') {
      onLoginSuccess();
      setIsLoginOpen(false);
      setError('');
    } else {
      setError('Login ou senha inválidos.');
    }
  };

  return (
    <footer className="bg-white mt-12 py-6 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-brand-brown-DEFAULT">
        <p>&copy; {new Date().getFullYear()} Sandy's Pet Shop. Todos os direitos reservados.</p>
        <p className="text-sm mt-1">Feito com ♥ para o seu melhor amigo.</p>
      </div>
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => setIsLoginOpen(!isLoginOpen)}
          className="text-xs text-gray-400 hover:text-brand-pink transition-colors"
          aria-label="Abrir formulário de login"
        >
          Login
        </button>
      </div>

      {isLoginOpen && (
        <div className="absolute bottom-12 right-4 bg-white p-4 rounded-lg shadow-2xl w-64 border border-gray-200 z-20">
          <form onSubmit={handleLogin}>
            <h4 className="font-bold text-brand-brown-dark text-center mb-2">Acesso Restrito</h4>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Login"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-2 py-1 border rounded-md text-sm focus:ring-brand-pink focus:border-brand-pink"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-2 py-1 border rounded-md text-sm focus:ring-brand-pink focus:border-brand-pink"
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs mb-2 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-brand-pink text-white py-1 rounded-md hover:bg-brand-pink-dark transition-colors text-sm font-bold"
            >
              Entrar
            </button>
          </form>
        </div>
      )}
    </footer>
  );
};

export default Footer;
