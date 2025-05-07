"use client";

import React, { useState, useMemo } from 'react';
import { PdfViewer } from './pdf-viewer';
import { DocxViewer } from './docx-viewer';
import { ExcelViewer } from './excel-viewer';
import { CSVViewer } from './csv-viewer';
import { Download } from 'lucide-react';

interface DocumentViewerProps {
  url: string;
  fileName: string;
  mimeType: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ url, fileName, mimeType }) => {
  const [error, setError] = useState<string | null>(null);
  
  const fileType = useMemo(() => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const mime = (mimeType || '').toLowerCase();
    const urlLower = url.toLowerCase();
    
    const typePatterns = {
      pdf: [
        () => mime.includes('pdf'),
        () => ext === 'pdf',
        () => urlLower.includes('.pdf')
      ],
      csv: [
        () => ext === 'csv',
        () => mime.includes('csv'),
        () => urlLower.match(/\.csv($|\?)/) !== null
      ],
      excel: [
        () => mime.includes('excel') || mime.includes('spreadsheet') || mime.includes('xlsx') || mime.includes('xls') || mime.includes('sheet'),
        () => ['xlsx', 'xls'].includes(ext),
        () => urlLower.match(/\.(xlsx|xls)($|\?)/) !== null
      ],
      word: [
        () => mime.includes('word') || mime.includes('document') || mime.includes('docx') || mime.includes('doc'),
        () => ['docx', 'doc', 'rtf'].includes(ext),
        () => urlLower.match(/\.(docx|doc|rtf)($|\?)/) !== null
      ]
    };
    
    for (const [type, checks] of Object.entries(typePatterns)) {
      if (checks.some(check => check())) {
        return type;
      }
    }
    
    return 'unknown';
  }, [fileName, mimeType, url]);
  
  const handleViewerError = (errorMessage: string) => {
    console.error("Viewer error:", errorMessage);
    setError(errorMessage);
  };

  const viewerComponents = {
    pdf: <PdfViewer url={url} onError={handleViewerError} />,
    word: <DocxViewer url={url} onError={handleViewerError} />,
    csv: <CSVViewer url={url} onError={handleViewerError} />,
    excel: <ExcelViewer url={url} onError={handleViewerError} />
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-medium mb-2">Cannot view document</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-xs text-gray-500 mb-4">
            Details: Document type = {fileType}, 
            MIME type = {mimeType || 'none'}
          </p>
          <a 
            href={url} 
            download={fileName}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Download className="h-4 w-4 mr-2 inline" />
            Download document
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden">
      {fileType in viewerComponents ? (
        viewerComponents[fileType as keyof typeof viewerComponents]
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-muted/10">
          <div className="text-center max-w-md p-8 bg-background rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-2">Document type not supported</h3>
            <p className="text-muted-foreground mb-4">
              This document type is not yet supported for direct viewing.
            </p>
            <div className="bg-muted text-xs text-gray-500 p-2 rounded-md mb-4">
              <p>Document info: {fileName} ({mimeType || 'unknown type'})</p>
            </div>
            <a 
              href={url} 
              download={fileName}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 w-full block"
            >
              <Download className="h-4 w-4 mr-2 inline" />
              Download document
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;