async function show_notifications(content, state) {
    const notification = document.createElement("div");
    notification.className = "notification";

    const notification_header = document.createElement("div");
    notification_header.className = "notification_header";

    const notification_header_content = document.createElement("p");
    notification_header_content.className = "notification_header_content";

    if (state == "error") {
        notification.className += " error";
        notification_header_content.textContent = "Ошибка: ";
    } else if (state == "great") {
        notification.className += " great";
        notification_header_content.textContent = "Замечательно!"
    } else notification_header_content.textContent = "Уведомление";

    const close_btn = document.createElement("i");
    close_btn.className = "fas fa-solid fa-times used_logo";
    close_btn.id = "close_notification";

    notification_header.append(notification_header_content, close_btn);

    const notification_content = document.createElement("p");
    notification_content.className = "notification_content";
    notification_content.textContent = content;
    
    notification.append(notification_header, notification_content);
    
    if (document.getElementsByClassName("notification").item(0) != null) clearTimeout(sessionStorage.getItem("timeout_notification")), document.body.removeChild(document.getElementsByClassName("notification").item(0));
    document.body.append(notification);

    close_btn.addEventListener("click", close_notification);

    sessionStorage.setItem("timeout_notification", setTimeout(() => {
        notification.style.opacity = 0;
    }, 3000));

}


async function close_notification() {
    document.body.removeChild(document.getElementsByClassName("notification").item(0));
}
