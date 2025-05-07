"use client";

import React from 'react';
import { BaseDocumentViewer } from './base-viewer';

interface ExcelViewerProps {
  url: string;
  onLoadSuccess?: () => void;
  onError?: (error: string) => void;
}

export function ExcelViewer({ url, onLoadSuccess, onError }: ExcelViewerProps) {
  const officeOnlineUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  
  return (
    <BaseDocumentViewer
      url={officeOnlineUrl}
      title="Excel document"
      onLoadSuccess={onLoadSuccess}
      onError={onError}
      loadingText="Loading Excel document..."
      errorTitle="Cannot view Excel document online"
      googleViewerType={false}
    />
  );
}