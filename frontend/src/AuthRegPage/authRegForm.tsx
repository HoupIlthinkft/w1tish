import { useState, useRef } from 'react';

import { callNotification } from '../Notification/notifications.tsx';

import { login, register_user } from '../configurationFiles/requests.ts';

export function AuthRegFormComponent() {
  const [form, setForm] = useState<'auth' | 'reg'>('auth');

  const username = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);

  const email = useRef<HTMLInputElement | null>(null);
  const confPassword = useRef<HTMLInputElement | null>(null);

  const validationAuthRegForm = () => {
    if (username.current != null && password.current != null) {
      if (form == 'reg' && email.current != null && confPassword != null) {
        reg();
      } else if (form == 'auth') {
        auth();
      }
    }
  };

  const auth = () => {
    if (username.current.value.trim() == '') callNotification('Введите username', 'error');
    else if (password.current.value.length >= 8) {
      if (password.current.value.toLowerCase() == password.current.value)
        callNotification('Нету символа(ов) верхнего регистра в пароле', 'error');
      else if (password.current.value.toUpperCase() == password.current.value)
        callNotification('Нету символа(ов) нижнего регистра в пароле', 'error');
      else {
        login(username.current.value.trim(), password.current.value.trim());
      }
    } else callNotification('Длина пароля меньше 8', 'error');
  };

  const reg = () => {
    if (username.current.value.trim() == '') callNotification('Введите username', 'error');
    else if (password.current.value.length >= 8) {
      if (password.current.value.toLowerCase() == password.current.value) {
        callNotification('Нету символа(ов) верхнего регистра в пароле', 'error');
      } else if (password.current.value.toUpperCase() == password.current.value) {
        callNotification('Нету символа(ов) нижнего регистра в пароле', 'error');
      } else if (password.current.value == confPassword.current.value) {
        if (email.current.checkValidity()) {
          register_user(
            username.current.value.trim(),
            email.current.value.trim(),
            password.current.value.trim(),
          );
        } else callNotification('Электронная почта не валидна', 'error');
      } else callNotification('Пароли не совпадают', 'error');
    } else callNotification('Длина пароля меньше 8', 'error');
  };

  return (
    <div className="flex h-full w-screen flex-col justify-center gap-[clamp(5px,2vh,20px)] self-center px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] md:w-[40vw]">
      <p className="text-title self-center text-[clamp(2rem,22vw,12rem)] font-bold md:text-[clamp(2rem,10vw,12rem)]">
        W1TISH
      </p>
      <div className="bg-plate-muted border-border flex flex-col gap-[clamp(5px,2vh,20px)] rounded-[25px] px-[clamp(5px,3vw,60px)] py-[clamp(5px,3vh,30px)] md:h-auto md:border-2">
        <p className="self-center text-[clamp(2rem,4vw,4rem)] font-light">
          {form == 'auth' ? 'Вход' : 'Регистрация'}
        </p>
        {form == 'auth' ? (
          <div className="flex flex-col gap-[clamp(5px,3vh,30px)]">
            <div className="flex w-full flex-col gap-[clamp(5px,2vh,20px)]">
              <input
                ref={username}
                type="text"
                placeholder="LOGIN"
                className="focus:bg-plate-hover ease border-border rounded-[20px] border-2 bg-white px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] text-center text-[clamp(0.5rem,3vw,3rem)] font-light outline-0 transition-all duration-300 md:py-[clamp(5px,1.5vh,15px)] md:text-[clamp(0.5rem,1.25vw,1.25rem)]"
              />
              <input
                ref={password}
                type="password"
                placeholder="PASSWORD"
                className="focus:bg-plate-hover ease border-border rounded-[20px] border-2 bg-white px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] text-center text-[clamp(0.5rem,3vw,3rem)] font-light outline-0 transition-all duration-300 md:py-[clamp(5px,1.5vh,15px)] md:text-[clamp(0.5rem,1.25vw,1.25rem)]"
              />
            </div>
            <div className="flex flex-col gap-[clamp(5px,1vh,10px)]">
              <button
                onClick={() => validationAuthRegForm()}
                className="border-border ease w-[60%] self-center rounded-[15px] border-2 bg-white px-[clamp(5px,4vw,80px)] py-[clamp(5px,2vh,20px)] text-[clamp(0.5rem,4vw,4rem)] duration-300 hover:scale-[1.2] md:py-[clamp(5px,1.5vh,15px)] md:text-[clamp(0.5rem,1.5vw,1.5rem)]"
              >
                Вход
              </button>
              <button
                onClick={() => setForm('reg')}
                className="absolute bottom-0 self-center rounded-[30px] px-[clamp(5px,4vw,80px)] py-[clamp(5px,2vh,20px)] text-[clamp(0.5rem,5vw,2rem)] font-extralight md:relative md:py-[clamp(5px,1.5vh,15px)] md:text-[clamp(0.5rem,1.25vw,1.25rem)]"
              >
                Зарегистрировать аккаунт
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-[clamp(5px,4vh,40px)]">
            <div className="flex flex-col gap-[clamp(5px,2vh,20px)]">
              <input
                ref={username}
                type="text"
                placeholder="LOGIN"
                className="focus:bg-plate-hover ease border-border rounded-[20px] border-2 bg-white px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] text-center text-[clamp(0.5rem,3vw,3rem)] font-light outline-0 transition-all duration-300 md:py-[clamp(5px,1.5vh,15px)] md:text-[clamp(0.5rem,1.25vw,1.25rem)]"
              />
              <input
                ref={email}
                type="email"
                placeholder="EMAIL"
                className="focus:bg-plate-hover ease border-border rounded-[20px] border-2 bg-white px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] text-center text-[clamp(0.5rem,3vw,3rem)] font-light outline-0 transition-all duration-300 md:py-[clamp(5px,1.5vh,15px)] md:text-[clamp(0.5rem,1.25vw,1.25rem)]"
              />
              <input
                ref={password}
                type="password"
                placeholder="PASSWORD"
                className="focus:bg-plate-hover ease border-border rounded-[20px] border-2 bg-white px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] text-center text-[clamp(0.5rem,3vw,3rem)] font-light outline-0 transition-all duration-300 md:py-[clamp(5px,1.5vh,15px)] md:text-[clamp(0.5rem,1.25vw,1.25rem)]"
              />
              <input
                ref={confPassword}
                type="password"
                placeholder="CONFIRM PASSWORD"
                className="focus:bg-plate-hover ease border-border rounded-[20px] border-2 bg-white px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] text-center text-[clamp(0.5rem,3vw,3rem)] font-light outline-0 transition-all duration-300 md:py-[clamp(5px,1.5vh,15px)] md:text-[clamp(0.5rem,1.25vw,1.25rem)]"
              />
            </div>

            <div className="flex flex-col gap-[clamp(5px,1vh,10px)]">
              <button
                onClick={() => validationAuthRegForm()}
                className="border-border ease w-fit self-center rounded-[15px] border-2 bg-white px-[clamp(5px,4vw,80px)] py-[clamp(5px,2vh,20px)] text-[clamp(0.5rem,4vw,4rem)] duration-300 hover:scale-[1.2] md:py-[clamp(5px,1.5vh,15px)] md:text-[clamp(0.5rem,1.5vw,1.5rem)]"
              >
                Зарегистрироваться
              </button>
              <button
                onClick={() => setForm('auth')}
                className="absolute bottom-0 self-center rounded-[30px] px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] text-[clamp(0.5rem,5vw,2rem)] font-extralight md:relative md:py-[clamp(5px,1.5vh,15px)] md:text-[clamp(0.5rem,1.25vw,1.25rem)]"
              >
                Войти в аккаунт
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
