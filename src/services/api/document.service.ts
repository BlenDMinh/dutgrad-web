import apiClient from "@/lib/axios";
import { handleResponse } from "./helper";
import { API_ROUTES } from "../../lib/constants";

export const documentService = {
    uploadDocumet(spaceId: number, file: File) {
        const formData = new FormData();
        formData.append("space_id", spaceId.toString()); 
        formData.append("file", file);

        return apiClient.instance.post("/documents/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json"
            }
        });
    }
};
