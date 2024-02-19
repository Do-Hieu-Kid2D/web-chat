const baseUrl = "http://127.0.0.1:5000/api";

export const postRequest = async (url, body) => {
    try {
        // body cần là 1 đối tượng Json mang data đã được stringify thành text
        // console.log(`===>`, url, body);

        const response = await fetch(`${baseUrl}${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // Hoặc địa chỉ nguồn cụ thể của bạn
            },
            body: body,
        });
        const responseData = await response.json();
        // console.log(`===>response: `, response);
        console.log(`===>DATA`, JSON.stringify(responseData));
        // Lôi oke = 0
        return responseData;
    } catch (error) {
        console.error("===>LỖI KHI POST request:", error);
        throw error;
    }
};

export const getRequest = async (url) => {
    try {
        const response = await fetch(`${baseUrl}${url}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error while making GET request:", error);
        throw error;
    }
};
