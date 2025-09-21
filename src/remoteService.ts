import axios from "axios";
//get full http url using baseURL
function resolveUrl(url: string) {
    const baseUrl = "http://localhost:4001/";
    return baseUrl + url;
}
//get function
export async function remoteGet(url: string) {
    try {
        const response = await axios.get(resolveUrl(url));
        return response.data;
    } catch (e) {
        throw new Error(e);
    }
}
//post function that takes data in form of JSON obj
export async function remotePost(url: string, data: any) {
    try {
        const response = await axios.post(resolveUrl(url), data);
        return response.data;
    } catch (e) {
        throw new Error(e);
    }
}
//delete function
export async function remoteDelete(url: string) {
    try {
        const response = await axios.delete(resolveUrl(url) );
    } catch (e) {
        throw new Error(e);
    }
}