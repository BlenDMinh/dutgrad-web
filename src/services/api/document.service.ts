import apiClient from "@/lib/axios";
import { API_ROUTES } from "../../lib/constants";
import { handleResponse } from "./helper";

export const documentService = {
    uploadDocumet(spaceId: number, file: File) {
        const formData = new FormData();
        formData.append("space_id", spaceId.toString()); 
        formData.append("file", file);

        return apiClient.instance.post(API_ROUTES.DOCUMENT.UPLOAD, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json"
            }
        });
    },
    getDocumentById(documentId: number) {
        return apiClient.instance.get(API_ROUTES.DOCUMENT.DETAIL(documentId.toString()))
    },
    deleteDocument: async(documentId: string)=> {
        const response = await apiClient.instance.delete(API_ROUTES.DOCUMENT.DELETE(documentId));
        return handleResponse(response.data);
    }
};
