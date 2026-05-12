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
            <p className="text-[clamp(2rem,8vw,8rem)] text-white self-center font-bold">W1TISH</p>
            <div className="flex flex-col w-[40vw] gap-[clamp(5px,2vh,20px)] rounded-[25px] bg-plate-muted px-[clamp(5px,3vw,60px)] py-[clamp(5px,3vh,30px)]">
                <p className="text-[clamp(2rem,4vw,4rem)] self-center font-light">{form == "auth" ? "Вход" : "Регистрация"}</p>
                {
                    form == "auth" ? (
                        <div className="flex flex-col gap-[clamp(5px,3vh,30px)]">
                            <div className="flex flex-col gap-[clamp(5px,2vh,20px)] w-[100%]">
                                <input ref={username} type="text" placeholder="LOGIN" className="focus:bg-plate-hover transition-all duration-300 ease border-2 text-center font-light border-border px-[clamp(5px,1vw,20px)] outline-[0] py-[clamp(5px,1.5vh,15px)] rounded-[20px] bg-white text-[clamp(0.5rem,1.25vw,1.25rem)]" />
                                <input ref={password} type="password" placeholder="PASSWORD" className="focus:bg-plate-hover transition-all duration-300 ease border-2 text-center font-light border-border px-[clamp(5px,1vw,20px)] outline-[0] py-[clamp(5px,1.5vh,15px)] rounded-[20px] bg-white text-[clamp(0.5rem,1.25vw,1.25rem)]" />
                            </div>
                            <div className='flex flex-col gap-[clamp(5px,1vh,10px)]'>
                                <button onClick={() => validationAuthRegForm()} className="border-2 border-border py-[clamp(5px,1vh,10px)] px-[clamp(5px,4vw,80px)] w-[60%] rounded-[15px] bg-white self-center hover:scale-[1.2] duration-300 ease text-[clamp(0.5rem,1.5vw,1.5rem)]">Вход</button>
                                <button onClick={() => setForm("reg")} className="font-extralight py-[clamp(5px,1vh,10px)] px-[clamp(5px,4vw,80px)] rounded-[30px] text-[clamp(0.5rem,1.25vw,1.25rem)]">Зарегистрировать аккаунт</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-[clamp(5px,4vh,40px)]">
                            <div className="flex flex-col gap-[clamp(5px,2vh,20px)]">
                                <input ref={username} type="text" placeholder="LOGIN" className="focus:bg-plate-hover transition-all duration-300 ease border-2 text-center font-light border-border px-[clamp(5px,1vw,20px)] outline-[0] py-[clamp(5px,1.5vh,15px)] rounded-[20px] bg-white text-[clamp(0.5rem,1.25vw,1.25rem)]" />
                                <input ref={email} type="email" placeholder="EMAIL"  className="focus:bg-plate-hover transition-all duration-300 ease border-2 text-center font-light border-border px-[clamp(5px,1vw,20px)] outline-[0] py-[clamp(5px,1.5vh,15px)] rounded-[20px] bg-white text-[clamp(0.5rem,1.25vw,1.25rem)]" />
                                <input ref={password} type="password" placeholder="PASSWORD" className="focus:bg-plate-hover transition-all duration-300 ease border-2 text-center font-light border-border px-[clamp(5px,1vw,20px)] outline-[0] py-[clamp(5px,1.5vh,15px)] rounded-[20px] bg-white text-[clamp(0.5rem,1.25vw,1.25rem)]" />
                                <input ref={confPassword} type="password" placeholder="CONFIRM PASSWORD" className="focus:bg-plate-hover transition-all duration-300 ease border-2 text-center font-light border-border px-[clamp(5px,1vw,20px)] outline-[0] py-[clamp(5px,1.5vh,15px)] rounded-[20px] bg-white text-[clamp(0.5rem,1.25vw,1.25rem)]" />
                            </div>

                            <div className="flex flex-col gap-[clamp(5px,1vh,10px)]">
                                <button onClick={() => validationAuthRegForm()} className="w-[60%] border-2 border-border py-[clamp(5px,1vh,10px)] px-[clamp(5px,4vw,80px)] rounded-[15px] bg-white self-center hover:scale-[1.2] duration-300 ease text-[clamp(0.5rem,1.5vw,1.5rem)]">Зарегистрироваться</button>
                                <button onClick={() => setForm("auth")} className="font-extralight py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)] rounded-[30px] text-[clamp(0.5rem,1.25vw,1.25rem)]">Войти в аккаунт</button>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
