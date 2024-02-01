import ApiManager from "./ApiManager";

export const mailbag_transaction = async data => {
    try {
        const result = await ApiManager("/Transaction/SetCollectionDelivery",{
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

export const parcel_transaction = async data => {
    try {
        const result = await ApiManager("/Transaction/SetCollectionDeliveryV2",{
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