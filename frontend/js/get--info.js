async function get_data_by_user_id(user_id) {
    const data = await fetch((`http://localhost/api/data/user?user_id=${user_id}`), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (data.status === 200) return data.json();
        else if (data.status === 404 || data.status === 422) console.log(data.status, data.statusText);
}


async function get_data_users_ids(users_ids) {
    let user_id = []

    for (let i in users_ids) {
        user_id.push(`user_id=${users_ids[i]}`)
    }

    const data = await fetch((`http://localhost/api/data/user?${user_id.join("&")}`), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (data.status === 200) return data.json();
        else if (data.status === 404 || data.status === 422) console.log(data.status, data.statusText);
}


async function get_data_by_username(username) {
    const data = await fetch((`http://localhost/api/data/user?username=${username}`), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (data.status === 200) return data.json();
        else if (data.status === 404 || data.status === 422) console.log(data.status, data.statusText);
}


async function get_avatar_url_by_id(id) {
    const data = await get_data_by_user_id(id);
    return data["users"][0].avatar_url;
}


async function get_nickname_by_id(id) {
    const data = await get_data_by_user_id(id);
    return data["users"][0].nickname;
}