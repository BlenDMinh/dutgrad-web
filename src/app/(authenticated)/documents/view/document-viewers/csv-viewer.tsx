"use client";

import React from 'react';
import { BaseDocumentViewer } from './base-viewer';

interface CSVViewerProps {
  url: string;
  onLoadSuccess?: () => void;
  onError?: (error: string) => void;
}

export function CSVViewer({ url, onLoadSuccess, onError }: CSVViewerProps) {
  return (
    <BaseDocumentViewer
      url={url}
      title="CSV document"
      onLoadSuccess={onLoadSuccess}
      onError={onError}
      loadingText="Loading CSV document..."
      errorTitle="Cannot view CSV document online"
      googleViewerType={true}
    />
  );
}