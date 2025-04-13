"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { documentService } from "@/services/api/document.service";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  CheckCircle2,
  FileText,
  AlertCircle,
  Upload,
  Brain,
} from "lucide-react";
import { APP_ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Document {
  id: number;
  title: string;
  processing_status: number; 
  created_at: string;
  updated_at: string;
  space_id: number;
}

const PROCESSING_STAGES = [
  {
    title: "Upload Complete",
    description:
      "Your document has been successfully uploaded and is waiting to be processed.",
    icon: <Upload className="h-6 w-6 text-blue-500" />,
    status: 0,
  },
  {
    title: "Document Parsed",
    description: "We've extracted the text and structure from your document.",
    icon: <FileText className="h-6 w-6 text-yellow-500" />,
    status: 1,
  },
  {
    title: "Ready to Use",
    description:
      "Your document has been fully processed and is ready for searching and knowledge extraction.",
    icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
    status: 2,
  },
];

export default function DocumentUploadProgressPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params?.id as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const calculateProgress = (status: number) => {
    return Math.min(Math.round(((status + 1) / PROCESSING_STAGES.length) * 100), 100);
  };

  const fetchDocument = async () => {
    try {
      if (!documentId) return;

      if (document?.processing_status === 2) return;

      const response = await documentService.getDocumentById(
        parseInt(documentId)
      );

      if (response?.data?.data) {
        const documentData = response.data.data;
        setDocument(documentData);
        setProgressPercent(calculateProgress(documentData.processing_status));
      } else {
        throw new Error("Failed to fetch document data");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      setError("Failed to load document progress. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();

    const intervalId = setInterval(() => {
      fetchDocument();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [documentId]);

  const isComplete = document?.processing_status === 2;

  if (loading && !document) {
    return (
      <div className="container max-w-3xl mx-auto py-10 px-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle>Loading document information...</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-3xl mx-auto py-10 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => router.push(APP_ROUTES.DASHBOARD)}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Document Processing</CardTitle>
          {document?.title && (
            <p className="text-muted-foreground mt-2 text-lg font-medium">
              {document.title}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          <div className="space-y-6">
            {PROCESSING_STAGES.map((stage, index) => {
              const docStatus = document?.processing_status || 0;
              const isActive = docStatus === stage.status;
              const isCompleted = docStatus > stage.status;
              const isPending = docStatus < stage.status;

              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg transition-colors",
                    isActive && "bg-primary/10 border border-primary/20",
                    isCompleted && "bg-muted/30",
                    isPending && "opacity-60"
                  )}
                >
                  <div className="mt-1">
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : isActive ? (
                      stage.status === 1 ? (
                        <Brain className="h-6 w-6 text-primary animate-pulse" />
                      ) : (
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      )
                    ) : (
                      stage.icon
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3
                      className={cn(
                        "text-lg font-medium",
                        isActive && "text-primary font-semibold"
                      )}
                    >
                      {stage.title}
                      {isActive && " (In Progress)"}
                      {isCompleted && " (Completed)"}
                    </h3>
                    <p className="text-muted-foreground">{stage.description}</p>
                    {isActive && stage.status === 0 && (
                      <p className="text-xs text-primary mt-2">
                        Extracting text and structure from your document...
                      </p>
                    )}
                    {isActive && stage.status === 1 && (
                      <p className="text-xs text-primary mt-2">
                        Creating knowledge graph and enhancing searchability...
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {!isComplete && (
            <p className="text-sm text-center text-muted-foreground">
              This process may take a few minutes depending on the document size
              and complexity.
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-center gap-4">
          {isComplete ? (
            <>
              <Button
                onClick={() => router.push(`/documents/${document.id}`)}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                View Document
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/spaces/${document.space_id}`)}
              >
                Return to Space
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push(`/spaces/${document?.space_id}`)}
            >
              Continue in Background
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
