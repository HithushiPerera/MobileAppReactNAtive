import ApiManager from "./ApiManager";

export const get_banks = async () => {
    try {
        const result = await ApiManager("/Utility/GetMailbagBanks",{
            method:"GET",
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return result;
    } catch (error) {
        return error.response.data;
    }
}

export const get_mailbag_status = async () => {
    try {
        const result = await ApiManager("/Utility/GetMailbagStatus",{
            method:"GET",
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return result;
    } catch (error) {
        return error.response.data;
    }
}

export const get_parcel_status = async () => {
    try {
        const result = await ApiManager("/Utility/GetParcelStatus",{
            method:"GET",
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return result;
    } catch (error) {
        return error.response.data;
    }
}

export const get_parcel_statusv2 = async () => {
    try {
        const result = await ApiManager("/Utility/GetParcelNotDeliveredStatus",{
            method:"GET",
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return result;
    } catch (error) {
        return error.response.data;
    }
}

export const get_missingdata = async () => {
    try {
        const result = await ApiManager("/Utility/GetHandOverList",{
            method:"GET",
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return result;
    } catch (error) {
        return error.response.data;
    }
}