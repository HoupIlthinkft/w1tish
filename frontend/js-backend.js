async function registration(username, email, password) {
    const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    
    if (response.status === 200) {                      //при регестрации бекенд сразу возвращает токены!
        //await login(username, password)

        const data = await response.json();
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

    } else {                                            //TODO обработай ошибку 409 (пользователь уже существует)
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

    } else if (response.status === 500) {
        console.log("Виноват бэкэндер")

    } else {                            // статус 200 обрабатывай отдельно, а в этом блоке только ошибки
                                        // TODO обработай ошибку 401 (неверный логин или пароль)
        const data = await response.json();
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        await getProtectedData(localStorage.getItem("accessToken"))
    }
}

async function getProtectedData(token) {
    const response = await fetch('http://localhost:8000/user/data', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token }) 
    });

    if (response.status === 401) { 
        console.log("Нужно обновить токен (refresh)");
        await refreshToken(localStorage.getItem("refresh_token"))

    } else if (response.status === 500) {
        console.log("Виноват бэкэндер")

    } else if (response.status === 422) {
        console.log("Виноват фронтендер")

    } else {
        const data = await response.json();
        console.log(data);
    }
}

async function refreshToken(refresh_token) {
    const response = await fetch('http://localhost:8000/update_token', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh_token })
        
    });

    if (response.status === 500) {
        console.log("Виноват бэкэндер")

    } else if (response.status === 401 || response.status === 422) { 
        create_sign_in_container()

    } else {                                        // статус 200 обрабатывай отдельно, а в этом блоке только ошибки
        const data = await response.json();
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        await getProtectedData(localStorage.getItem("accessToken"))}
}