import { useState, useRef } from "react";

import { callNotification } from "../Notification/notifications.tsx";


export function AuthRegFormComponent() {
    const [form, setForm] = useState<"auth" | "reg">("auth");

    const username = useRef<HTMLElement | null>(null);
    const password = useRef<HTMLElement | null>(null);

    const email = useRef<HTMLElement | null>(null);
    const confPassword = useRef<HTMLElement | null>(null);

    const validationAuthRegForm = () => {
        if (username.current != null && password.current != null) {
            if (form == "reg" && email.current != null && confPassword != null) {
                if (password.current.value.length >= 8) {
                    if (password.current.value.toLowerCase() != password) {
                        if (password.current.value.toUpperCase() != password) {
                            if (password == password_confirmation) {
                                if (email.current.checkValidity()) {
                                    register_user(username.current.value, email.current.value, password.current.value);
                                } else callNotification("Электронная почта не валидна", "error");       
                            } else callNotification("Пароли не совпадают", "error");
                        } else callNotification("Нету символа(ов) нижнего регистра в пароле", "error");
                    } else callNotification("Нету символа(ов) верхнего регистра в пароле", "error");
                } else callNotification("Длина пароля меньше 8", "error");
            } else if (form == "auth") {
                if (password.current.value.length >= 8) {
                    if (password.current.value.toLowerCase() != password) {
                        if (password.current.value.toUpperCase() != password) {
                            login(username, password);
                        } else callNotification("Нету символа(ов) нижнего регистра в пароле", "error");
                    } else callNotification("Нету символа(ов) верхнего регистра в пароле", "error");
                } else callNotification("Длина пароля меньше 8", "error");
            }
        }
    };  

    return (
        <div className="flex flex-col self-center gap-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)]">
            <p className="text-[clamp(2rem,6vw,6rem)] self-center">W1tish</p>
            <div className="flex flex-col gap-[clamp(5px,2vh,20px)]">
                <p className="text-[clamp(2rem,4vw,4rem)] self-center">{form == "auth" ? "Вход" : "Регистрация"}</p>
                {
                    form == "auth" ? (
                        <div className="flex flex-col gap-[clamp(5px,3vh,30px)]">
                            <div className="flex flex-col gap-[clamp(5px,1vh,10px)]">
                                <input ref={username} type="text" placeholder="Username..." className="px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] rounded-[15px]" />
                                <input ref={password} type="password" placeholder="Password..." className="px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] rounded-[15px]" />
                            </div>
                            <button onClick={() => validationAuthRegForm()} className="py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)] rounded-[20px]">Войти в аккаунт</button>
                            <button onClick={() => setForm("reg")} className="py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)] rounded-[20px]">Регистрация</button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-[clamp(5px,4vh,40px)]">
                            <div className="flex flex-col gap-[clamp(5px,2vh,20px)]">
                                <input ref={username} type="text" placeholder="Username..." className="py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)] rounded-[15px]" />
                                <input ref={email} type="email" placeholder="E-mail..."  className="py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)] rounded-[15px]" />
                                <input ref={password} type="password" placeholder="Password..." className="py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)] rounded-[15px]" />
                                <input ref={confPassword} type="password" placeholder="Confirmation password..." className="py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)] rounded-[15px]" />
                            </div>
                            <button onClick={() => validationAuthRegForm()} className="py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)] rounded-[20px]">Регистрация</button>
                            <button onClick={() => setForm("auth")} className="py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px) rounded-[20px]]">Войти в аккаунт</button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
