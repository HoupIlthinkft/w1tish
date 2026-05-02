export function callNotification({content, type}) {
    useNotificationStore.getState().setNotification([content, type]);
}

export function NotificationComponent() {
    return (
        <div>
            <div>
                <p>{useNotificationStore.getState().notification[1] == "error" ? "Ошибка" : "Успешно"}</p>
                <span className="material-symbol-outlined">close</span>
            </div>
            <p>{useNotificationStore.getState().notification[0]}</p>
        </div>
    )
}
