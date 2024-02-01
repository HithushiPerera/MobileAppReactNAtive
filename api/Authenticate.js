import ApiManager from "./ApiManager";

export const user_login = async data => {
    try {
        const result = await ApiManager("/Authentication/AuthenticateMobile",{
            method:"POST",
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            data : data,
        });
        return result;
    } catch (error) {
        return error.response.data;
    }
}

export const user_signup = async data => {
    try {
        const result = await ApiManager("/Authentication/NewMobile",{
            method:"POST",
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            data: data,
        });
        return result;
    } catch (error) {
        return error.response.data;
    }
}