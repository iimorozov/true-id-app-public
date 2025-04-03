import { useState, FormEvent, JSX } from 'react';
import { useNavigate } from 'react-router-dom';

interface SignInProps {
  setIsSignIn: (value: boolean) => void;
}

function SignIn({ setIsSignIn }: SignInProps): JSX.Element {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Здесь будет логика авторизации
    setIsSignIn(true);
    navigate('/dashboard');
  };

  return (
    <div className="sign-in-container">
      <h1>Вход в систему</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя пользователя:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default SignIn;
