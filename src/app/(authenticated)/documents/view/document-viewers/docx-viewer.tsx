"use client";

import React from 'react';
import { BaseDocumentViewer } from './base-viewer';

interface DocxViewerProps {
  url: string;
  onLoadSuccess?: () => void;
  onError?: (error: string) => void;
}

export function DocxViewer({ url, onLoadSuccess, onError }: DocxViewerProps) {
  const officeOnlineUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  
  return (
    <BaseDocumentViewer
      url={officeOnlineUrl}
      title="Word document"
      onLoadSuccess={onLoadSuccess}
      onError={onError}
      loadingText="Loading Word document..."
      errorTitle="Cannot view Word document online"
      googleViewerType={false}
    />
  );
}