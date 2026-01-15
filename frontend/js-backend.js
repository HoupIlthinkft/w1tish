async function registration(username, email, password) {
    const response = await fetch('http://127.0.0.1:8000/reg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    
    if (response.status === 200) {
        login(username, password)
    } else {
        console.log("Ошибка: ", response.status)
    }
}

async function login(username, password) {
    const response = await fetch('http://127.0.0.1:8000/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    if (response.status === 422) {
        console.log("Виноват фронтендер")
    } else if (response.status === 404) { 
        error_text.textContent = "Вы не зарегистрированы"
        create_registration_container()
    } else if (response.status === 505) {
        console.log("Виноват бэкэндер")
    } else {
        const data = await response.json();
    // Сохраняем access token только в памяти приложения
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        getProtectedData()
    }
    
    
}

async function getProtectedData() {
    const response = await fetch('http://localhost:8000/user/data', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
    });

    if (response.status === 401) {
        console.log("Нужно обновить токен (refresh)");
    // Здесь вызывается функция обновления токена через куку
        refreshToken()
    } else if (response.status === 422) {
        console.log("Виноват фронтендер")
    } else if (response.status === 500) {
        console.log("Виноват бэкэндер")
    } else {
        const data = await response.json();
        console.log(data);
    }
}

async function refreshToken() {
    const response = await fetch('http://localhost:8000/update_token', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("refresh_token")}`
        }
    });

    if (response.status === 500) {
        console.log("Виноват бэкэндер")
    } else if (response.status === 401) {
        sign_in_account()
    } else {
        const data = await response.json();
    // Сохраняем access token только в памяти приложения
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
    }
}