if (localStorage.getItem("accessToken") != null) {
    if (window.location.pathname != "/app.html") window.location.replace("app.html");
} else {
    if (window.location.pathname != "/index.html") {
        window.location.replace("index.html");
    }
}