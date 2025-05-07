"use client";

import React, { useState, useEffect } from 'react';
import { DocumentViewer } from '@/app/(authenticated)/documents/view/document-viewers';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Loader2 } from "lucide-react";
import { FaFilePdf, FaFileExcel, FaFileWord, FaFileCsv } from "react-icons/fa";
import { FileIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { documentService } from "@/services/api/document.service";

interface DocumentDetails {
  id: number;
  name: string;
  s3_url: string;
  mime_type: string;
  spaceId: number;
}

const DocumentIcon = ({ mimeType }: { mimeType: string }) => {
  const fileType = mimeType?.toLowerCase() || '';
  
  if (fileType.includes('pdf')) {
    return <FaFilePdf className="h-5 w-5 text-red-500" />;
  } else if (fileType.includes('excel') || fileType.includes('spreadsheet') || fileType.includes('xlsx')) {
    return <FaFileExcel className="h-5 w-5 text-green-600" />;
  } else if (fileType.includes('word') || fileType.includes('docx')) {
    return <FaFileWord className="h-5 w-5 text-blue-600" />;
  }else if (fileType.includes('csv')){
    return <FaFileCsv className="h-5 w-5 text-blue-600" />;
  }
  
  return <FileIcon className="h-5 w-5" />;
};

export default function DocumentViewerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentId = searchParams.get("id");
  const [document, setDocument] = useState<DocumentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingDocument, setLoadingDocument] = useState(true);
  const [showDirectDownload, setShowDirectDownload] = useState(false);

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
        setLoading(false);
        
        const timer = setTimeout(() => setShowDirectDownload(true), 5000);
        return () => clearTimeout(timer);
      } catch (err) {
        console.error("Failed to fetch document:", err);
        setError("Failed to load document");
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  useEffect(() => {
    if (document?.s3_url) {
      const timer = setTimeout(() => setLoadingDocument(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [document]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <div className="text-primary">Loading document information...</div>
        </div>
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
          <Button variant="outline" onClick={() => router.back()}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Go back
          </Button>
        </div>
      </div>
    );
  }

  const displayName = document.name.substring(0, document.name.lastIndexOf(".")) || document.name;

  return (
    <div className="min-h-screen w-full flex flex-col h-screen overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 py-2 px-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="flex items-center gap-2 ml-2">
            <span className="text-primary">
              <DocumentIcon mimeType={document.mime_type} />
            </span>
            <div className="font-medium text-base">{displayName}</div>
          </div>
        </div>
        <a
          href={document.s3_url}
          download={document.name}
          className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition flex items-center gap-1"
        >
          <Download size={16} />
          <span className="text-sm">Download</span>
        </a>
      </div>

      <div className="flex-1 w-full h-full relative overflow-hidden">
        {loadingDocument ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Loading document...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds for large documents</p>
            
            {showDirectDownload && (
              <div className="mt-6 text-center max-w-md">
                <p className="text-sm text-primary mb-3">
                  Taking too long? You can download the file directly and open it with an application on your computer.
                </p>
                <a
                  href={document.s3_url}
                  download={document.name}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                >
                  <Download size={16} />
                  <span>Download now</span>
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full">
            <DocumentViewer 
              url={document.s3_url} 
              fileName={document.name} 
              mimeType={document.mime_type} 
            />
          </div>
        )}
      </div>
    </div>
  );
}