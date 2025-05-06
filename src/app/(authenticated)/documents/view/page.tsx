"use client"
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { documentService } from "@/services/api/document.service";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download } from "lucide-react";
import {
  FaFilePdf,
  FaFileExcel,
  FaFileWord,
  FaFile,
} from "react-icons/fa";
import { FileIcon } from "lucide-react";

interface DocumentDetails {
  id: number;
  name: string;
  s3_url: string;
  mime_type: string;
  spaceId: number;
}

export default function DocumentViewerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentId = searchParams.get("id");
  const [document, setDocument] = useState<DocumentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!documentId) {
      setError("Document ID is missing");
      setLoading(false);
      return;
    }

    const fetchDocument = async () => {
      try {
        const response = await documentService.getDocumentById(parseInt(documentId));
        setDocument(response as DocumentDetails);
      } catch (err) {
        console.error("Failed to fetch document:", err);
        setError("Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  const handleGoBack = () => {
    router.back();
  };

  const getFileType = (mimeType: string): string => {
    if (mimeType?.includes("pdf")) {
      return "pdf";
    } else if (
      mimeType?.includes("excel") ||
      mimeType?.includes("spreadsheet") ||
      mimeType?.includes("xlsx")
    ) {
      return "excel";
    } else if (mimeType?.includes("word") || mimeType?.includes("docx")) {
      return "word";
    } else {
      return "other";
    }
  };

  const getDocumentViewerUrl = (document: DocumentDetails) => {
    if (document.mime_type.includes("pdf")) {
      return document.s3_url;
    }
    return `https://docs.google.com/viewer?url=${encodeURIComponent(
      document.s3_url
    )}&embedded=true`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading document...</div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive mb-2">
            {error || "Document not found"}
          </h2>
          <Button variant="outline" onClick={handleGoBack}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="bg-gray-100 dark:bg-gray-800 py-2 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="flex items-center gap-2 ml-2">
            <span className="text-primary">
              {getFileType(document.mime_type) === "pdf" ? (
                <FaFilePdf className="h-5 w-5 text-red-500" />
              ) : getFileType(document.mime_type) === "excel" ? (
                <FaFileExcel className="h-5 w-5 text-green-600" />
              ) : getFileType(document.mime_type) === "word" ? (
                <FaFileWord className="h-5 w-5 text-blue-600" />
              ) : (
                <FileIcon className="h-5 w-5" />
              )}
            </span>
            <div className="font-medium text-base">
              {document.name.substring(0, document.name.lastIndexOf(".")) ||
                document.name}
            </div>
          </div>
        </div>
        <a
          href={document.s3_url}
          target="_blank"
          rel="noopener noreferrer"
          download={document.name}
          className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition flex items-center gap-1"
        >
          <Download size={16} />
          <span className="text-sm">Download</span>
        </a>
      </div>

      <div className="flex-1 w-full relative">
        <iframe
          src={getDocumentViewerUrl(document)}
          className="absolute inset-0 w-full h-full border-none"
          title={document.name}
          sandbox="allow-scripts allow-same-origin allow-forms"
          onLoad={() => setIframeLoading(false)}
          style={{ display: iframeLoading ? 'none' : 'block' }}
        />
        
        {iframeLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background">
            <div className="relative">
              {getFileType(document.mime_type) === "pdf" ? (
                <FaFilePdf className="h-16 w-16 text-red-500 animate-pulse" />
              ) : getFileType(document.mime_type) === "excel" ? (
                <FaFileExcel className="h-16 w-16 text-green-600 animate-pulse" />
              ) : getFileType(document.mime_type) === "word" ? (
                <FaFileWord className="h-16 w-16 text-blue-600 animate-pulse" />
              ) : (
                <FileIcon className="h-16 w-16 text-primary animate-pulse" />
              )}
            </div>
            <p className="mt-4 text-lg font-medium text-muted-foreground">Loading document...</p>
          </div>
        )}
      </div>
    </div>
  );
}