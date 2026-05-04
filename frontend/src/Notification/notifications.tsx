import { useState, useEffect, useRef} from "react";

import { useNotificationStore } from "../configurationFiles/config.ts";

export function callNotification(content : string, typeNotification : "error" | "success") {
    useNotificationStore.getState().setNotificationContent([typeNotification, content]);
    useNotificationStore.getState().setNotificationActivity(true);
}


export function NotificationComponent() {

    const notificationRef = useRef<HTMLDivElement>(null);
    const notification : boolean = useNotificationStore((state) => state.notificationActivity);

    const [typeNotification, setTypeNotification] = useState<"error" | "success" | null>(null);
    const [content, setContent] = useState<string | null>(null);

    useEffect(() => {
        if (notificationRef.current !== null) {
            if (notification) {
                setTypeNotification(useNotificationStore.getState().notificationContent.typeNotification as "error" | "success");
                setContent(useNotificationStore.getState().notificationContent.content as string);

                notificationRef.current.style.display = "initial"
                notificationRef.current.style.opacity = "1";
                notificationRef.current.style.translate = "0 clamp(5px,15vh,150px)";
                notificationRef.current.style.transitionDuration = "1s"


                setTimeout(() => {
                    useNotificationStore.getState().setNotificationActivity(false);
                }, 3000);
            } else {
                notificationRef.current.style.display = "initial";
                notificationRef.current.style.opacity = "0";
                notificationRef.current.style.translate = "";
                notificationRef.current.style.transitionDuration = "3s,10s"
                
            }
        }
    }, [notification])

    return (
        <div ref={notificationRef} 
            className={`hidden border-2 border-solid px-[clamp(5px,2vw,20px)] md:px-[clamp(5px,1vw,20px)] py-[clamp(1px,1vh,10px)] md:py-[clamp(5px,2vh,20px)] mx-[clamp(5px,1vw,20px)] rounded-[15px] absolute z-[5] ease-in right-[0%] top-[-10%] [transition:opacity_1s,translate_0.5s]`}
            style={{ "borderColor": `var(--color-notification-${typeNotification}-text)`, "background": `var(--color-notification-${typeNotification}-plate)`}}>
            <div className='flex flex-row gap-[clamp(10px,2vw,30px)] justify-between'>
                <p className="font-semibold text-[clamp(0.75rem,1.5vw,1.5rem)]" style={{color: `var(--color-notification-${typeNotification}-text)`}}>{typeNotification == "error" ? "Ошибка" : "Успешно"}</p>
                <span onClick={() => {notificationRef!.current!.style.display = "none"}} className="material-symbols-outlined cursor-pointer scale-[0.5] md:scale-[1]">close</span>
            </div>
            <p className="font-medium text-[clamp(0.5rem,1vw,1rem)]">{content}</p>
        </div>
    )
}

