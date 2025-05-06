import apiClient from "@/lib/axios";
import { API_ROUTES } from "../../lib/constants";
import { handleResponse } from "./helper";
import { AxiosProgressEvent } from "axios";

export const documentService = {
    uploadDocumet(spaceId: number, file: File, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) {
        const formData = new FormData();
        formData.append("space_id", spaceId.toString()); 
        formData.append("file", file);

        return apiClient.instance.post(API_ROUTES.DOCUMENT.UPLOAD, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json"
            },
            onUploadProgress: onUploadProgress,
            timeout: 0
        });
    },
    getDocumentById: async(documentId: number) => {
        const response = await apiClient.instance.get(API_ROUTES.DOCUMENT.DETAIL(documentId.toString()));
        return handleResponse(response.data);
    },
    deleteDocument: async(documentId: string)=> {
        const response = await apiClient.instance.delete(API_ROUTES.DOCUMENT.DELETE(documentId));
        return handleResponse(response.data);
    }
};
