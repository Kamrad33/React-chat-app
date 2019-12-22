import React, { useRef, useEffect } from 'react';
import './Login.css';

export default function Login(props) {
  const { user, setUser, login, userCount = 0 } = props;

  function handleLogin(e) {
    e.preventDefault();
    if (user.trim().length < 2) return;

    login();
  }

  const input = useRef(null);

  useEffect(() => {
    input.current.select();
  }, []);

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h1 className="login-form__header">Чат</h1>
        <h2 className="login-form__info">Онлайн: {userCount}</h2>

        <input
          value={user}
          onChange={e => setUser(e.target.value.trimLeft())}
          placeholder="Ваше имя"
          maxLength="25"
          className="input-text"
          autoFocus
          ref={input}
        />
        <button className="login-form__button btn btn--primary">Войти</button>
      </form>
    </div>
  );
}
