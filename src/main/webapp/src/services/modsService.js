import http from "./httpService";
import config from "../config";

const apiEndpoint = config.apiUrl + "/mod";

export function getMods(filterByServerType) {
    const query = filterByServerType ? "?filter=" + filterByServerType
            : ""
    return http.get(apiEndpoint + query);
}

export function installMod(modId) {
    return http.post(apiEndpoint + "/" + modId);
}

export function updateMods(modIdsList) {
    return http.post(apiEndpoint + "?modIds=" + modIdsList);
}


export function uninstallMod(modId) {
    return http.delete(apiEndpoint + "/" + modId);
}

export function uninstallMods(modIdsList) {
    return http.delete(apiEndpoint + "?modIds=" + modIdsList);
}
