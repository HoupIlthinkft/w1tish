import { useState, useRef } from "react";

import { callNotification } from "../Notification/notifications.tsx";

import { login, register_user } from "../configurationFiles/requests.ts";


export function AuthRegFormComponent() {
    const [form, setForm] = useState<"auth" | "reg">("auth");

    const username = useRef<HTMLInputElement | null>(null);
    const password = useRef<HTMLInputElement | null>(null);

    const email = useRef<HTMLInputElement | null>(null);
    const confPassword = useRef<HTMLInputElement | null>(null);

    const validationAuthRegForm = () => {
        if (username.current != null && password.current != null) {
            if (form == "reg" && email.current != null && confPassword != null) {
                if (username.current.value.trim() != "") { 
                    if (password.current.value.length >= 8) {
                        if (password.current.value.toLowerCase() != password.current.value) {
                            if (password.current.value.toUpperCase() != password.current.value) {
                                if (password.current.value == confPassword.current.value) {
                                    if (email.current.checkValidity()) {
                                        register_user(username.current.value, email.current.value, password.current.value);
                                    } else callNotification("Электронная почта не валидна", "error");       
                                } else callNotification("Пароли не совпадают", "error");
                            } else callNotification("Нету символа(ов) нижнего регистра в пароле", "error");
                        } else callNotification("Нету символа(ов) верхнего регистра в пароле", "error");
                    } else callNotification("Длина пароля меньше 8", "error");
                } else callNotification("Введите username", "error");
            } else if (form == "auth") {
                if (username.current.value.trim() != "") {
                    if (password.current.value.length >= 8) {
                        if (password.current.value.toLowerCase() != password.current.value) {
                            if (password.current.value.toUpperCase() != password.current.value) {
                                login(username.current.value, password.current.value);
                            } else callNotification("Нету символа(ов) нижнего регистра в пароле", "error");
                        } else callNotification("Нету символа(ов) верхнего регистра в пароле", "error");
                    } else callNotification("Длина пароля меньше 8", "error");
                } else callNotification("Введите username", "error")
            }
        }
    };  

    return (
        <div className="flex flex-col self-center gap-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)]">
            <p className="text-[clamp(2rem,8vw,8rem)] text-white self-center">W1tish</p>
            <div className="flex flex-col w-[30vw] gap-[clamp(5px,2vh,20px)] rounded-[25px] bg-plate-accent px-[clamp(5px,2vw,40px)] py-[clamp(5px,4vh,40px)]">
                <p className="text-[clamp(2rem,4vw,4rem)] self-center">{form == "auth" ? "Вход" : "Регистрация"}</p>
                {
                    form == "auth" ? (
                        <div className="flex flex-col gap-[clamp(5px,3vh,30px)]">
                            <div className="flex flex-col gap-[clamp(5px,2vh,20px)]">
                                <input ref={username} type="text" placeholder="Username..." className="px-[clamp(5px,1vw,20px)] outline-[0] py-[clamp(5px,2vh,20px)] rounded-[35px] bg-white text-[clamp(0.5rem,1.25vw,1.25rem)]" />
                                <input ref={password} type="password" placeholder="Password..." className="px-[clamp(5px,1vw,20px)] outline-[0] py-[clamp(5px,2vh,20px)] rounded-[35px] bg-white text-[clamp(0.5rem,1.25vw,1.25rem)]" />
                            </div>
                            <div className='flex flex-col gap-[clamp(5px,1vh,10px)]'>
                                <button onClick={() => validationAuthRegForm()} className="py-[clamp(5px,2vh,20px)] px-[clamp(5px,4vw,80px)] rounded-[30px] bg-white w-fit self-center hover:scale-[1.2] duration-300 ease  text-[clamp(0.5rem,1.5vw,1.5rem)]">Войти в аккаунт</button>
                                <button onClick={() => setForm("reg")} className="py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)] rounded-[30px] text-[clamp(0.5rem,1.25vw,1.25rem)]">Регистрация</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-[clamp(5px,4vh,40px)]">
                            <div className="flex flex-col gap-[clamp(5px,2vh,20px)]">
                                <input ref={username} type="text" placeholder="Username..." className="py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)] outline-[0] rounded-[35px] bg-white text-[clamp(0.5rem,1.25vw,1.25rem)]" />
                                <input ref={email} type="email" placeholder="E-mail..."  className="py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)] outline-[0] rounded-[35px] bg-white text-[clamp(0.5rem,1.25vw,1.25rem)]" />
                                <input ref={password} type="password" placeholder="Password..." className="py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)] outline-[0] rounded-[35px] bg-white text-[clamp(0.5rem,1.25vw,1.25rem)]" />
                                <input ref={confPassword} type="password" placeholder="Confirmation password..." className="py-[clamp(5px,2vh,20px)] outline-[0] px-[clamp(5px,1vw,20px)] rounded-[35px] bg-white text-[clamp(0.5rem,1.25vw,1.25rem)]" />
                            </div>

                            <div className="flex flex-col gap-[clamp(5px,1vh,10px)]">
                                <button onClick={() => validationAuthRegForm()} className="py-[clamp(5px,2vh,20px)] px-[clamp(5px,4vw,80px)] w-fit hover:scale-[1.2] self-center duration-300 ease rounded-[30px] bg-white text-[clamp(0.5rem,1.5vw,1.5rem)]">Регистрация</button>
                                <button onClick={() => setForm("auth")} className="py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px) rounded-[30px]] text-[clamp(0.5rem,1.25vw,1.25rem)]">Войти в аккаунт</button>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
