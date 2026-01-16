if (localStorage.getItem("accessToken") != "undefined") {
    console.log(localStorage.getItem("accessToken"));
    getProtectedData();
} else if (localStorage.getItem("refreshToken") != "undefined") {
    console.log(localStorage.getItem("refreshToken"));
    refreshToken();
} else create_sign_in_container();
