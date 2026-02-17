async function request_add_new_message(chat_id, message, user_id) {
    await fetch((window.ENV.API_URL + '/web/data/messages'), {
        method: 'POST',
        headers: {  'accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                    'Content-Type': 'application/json' },
        body: JSON.stringify()
    });

}


async function request_get_messages(chat_id) {
    var data = await fetch((window.ENV.API_URL + `/web/data/messages?chat_id=${String(chat_id)}&offset=0&limit=50`), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
    });

    if (data.status === 200) return data.json();
        else if (data.status === 422) console.log("422 Validation Error");
            else console.log(data.status, data.statusText);
}


async function request_create_new_chat(oponents_id) {
    const response = await fetch((window.ENV.API_URL + '/web/data/chats'), {
        method: 'POST',
        headers: {  'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                    'Content-Type': 'application/json' },
        body: JSON.stringify({
            "members_ids": oponents_id
        })
    });

    if ((response.status === 401) || (response.status === 422)) {
        await refreshToken();
        await request_create_new_chat(oponents_id);
    } 
    else if (response.status === 409) {
        console.log("Чат уже создан");
    }
}


async function request_reset_token() {
    await fetch((window.ENV.API_URL + '/web/auth/session/logout'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
}

async function requset_editing_nickname(new_nickname) {
    if (new_nickname != localStorage.getItem("nickname")) {
        await fetch((window.ENV.API_URL + '/web/data/nickname'), {
            method: 'PATCH',
            headers: {  'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                        'Content-Type': 'application/json' },
            body: JSON.stringify({
                "nickname": new_nickname
            })
        });
    }
}

async function requset_editing_avatar(new_avatar) {
    const response = await fetch((window.ENV.API_URL  + "/web/data/avatar"), {
        method: 'PATCH',
        headers: {
            'accept': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: new_avatar
    });

    if ((response.status === 422) || (response.status === 401)) getProtectedData();
        else return response.status; 
}
