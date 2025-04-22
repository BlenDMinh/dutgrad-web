"use client";

import { useState, ReactNode, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { FaPlus, FaFileUpload } from "react-icons/fa";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { documentService } from "@/services/api/document.service";
import { useRouter } from "next/navigation";
import { ALLOWED_FILE_TYPES, APP_ROUTES, SPACE_ROLE } from "@/lib/constants";
import { useSpace } from "@/context/space.context";
import { cn } from "@/lib/utils";

interface ImportDialogProps {
  spaceId: string;
  children?: ReactNode;
}

// Extensions to MIME type mappings for better validation
const ALLOWED_EXTENSIONS: Record<string, string[]> = {
  pdf: ["application/pdf"],
  doc: ["application/msword"],
  docx: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  xls: ["application/vnd.ms-excel"],
  xlsx: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  txt: ["text/plain"],
};

export default function ImportDialog({ spaceId, children }: ImportDialogProps) {
  const { role } = useSpace();
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const form = useForm({
    defaultValues: {
      file: undefined as unknown as FileList,
    },
  });

  // Function to get the correct MIME type based on file extension
  const getCorrectMimeType = (file: File): string => {
    // Get the file extension
    const extension = file.name.toLowerCase().split(".").pop();

    // If the file is detected as zip but has Office extensions, convert the MIME type
    if (
      file.type === "application/zip" ||
      file.type === "application/x-zip-compressed" ||
      file.type === "application/octet-stream"
    ) {
      if (extension === "docx") {
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      }

      if (extension === "xlsx") {
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      }
    }

    return file.type;
  };

  const validateFileType = (file: File): boolean => {
    // Check if the file's MIME type is directly in our allowed list
    if (ALLOWED_FILE_TYPES[file.type]) {
      return true;
    }

    // Get the file extension
    const extension = file.name.toLowerCase().split(".").pop();
    if (!extension) return false;

    // If file is detected as zip but has an Office extension
    if (
      (file.type === "application/zip" ||
        file.type === "application/x-zip-compressed" ||
        file.type === "application/octet-stream") &&
      (extension === "xlsx" || extension === "docx")
    ) {
      return true;
    }

    // Check if the extension is in our allowed list
    if (ALLOWED_EXTENSIONS[extension]) {
      return true;
    }

    return false;
  };

  const handleFileUpload = async (data: { file: FileList }) => {
    try {
      setFeedback({ type: null, message: "" });
      setIsUploading(true);

      let file = data.file?.[0];

      if (!file) {
        setFeedback({
          type: "error",
          message: "Please select a file to upload.",
        });
        setIsUploading(false);
        return;
      }

      // Validate file type
      if (!validateFileType(file)) {
        setFeedback({
          type: "error",
          message: `File type not supported. Please upload one of the following formats: PDF, DOC, DOCX, XLS, XLSX, or TXT.`,
        });
        setIsUploading(false);
        return;
      }

      // Check if MIME type needs to be corrected
      const correctMimeType = getCorrectMimeType(file);
      if (correctMimeType !== file.type) {
        // Create a new File object with the corrected MIME type
        file = new File([file], file.name, { type: correctMimeType });
        console.log(`Converted file MIME type to: ${correctMimeType}`);
      }

      const response = await documentService.uploadDocumet(
        parseInt(spaceId),
        file
      );

      if (response.data.status === 200 || response.data.status === 201) {
        setFeedback({
          type: "success",
          message: response.data.message || "Document uploaded successfully.",
        });

        form.reset();

        const document = response.data.data.document;
        const docId = document.id;

        setTimeout(() => {
          setIsOpen(false);
          setFeedback({ type: null, message: "" });
          router.push(APP_ROUTES.DOCUMENT.UPLOAD_PROGRESS(docId));
        }, 1000);
      } else {
        throw new Error(response.data.message || "Failed to upload document");
      }
    } catch (error: any) {
      console.error("Document upload error:", error);

      let errorMessage = "Failed to upload document. Please try again.";

      if (error.response?.data) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setFeedback({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFeedback({ type: null, message: "" });
      form.reset();
      setIsDragging(false);
    }
    setIsOpen(open);
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        form.setValue("file", e.dataTransfer.files);
      }
    },
    [form]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children
          ? children
          : (role?.id === SPACE_ROLE.OWNER ||
              role?.id === SPACE_ROLE.EDITOR) && (
              <Button variant="outline" className="flex items-center gap-2">
                <FaPlus size={16} />
                <span>Import</span>
              </Button>
            )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Document</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleFileUpload)}
          >
            <FormField
              name="file"
              control={form.control}
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Document</FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-md p-6 cursor-pointer transition-colors",
                        isDragging
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-primary/50",
                        isUploading && "opacity-50 cursor-not-allowed"
                      )}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() =>
                        !isUploading &&
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      <div className="flex flex-col items-center justify-center gap-2 max-w-full">
                        <FaFileUpload className="h-10 w-10 text-muted-foreground/50 flex-shrink-0" />
                        <div className="w-full max-w-[280px] text-center">
                          {value && value[0] ? (
                            <p
                              className="text-sm font-medium truncate overflow-hidden text-ellipsis"
                              title={value[0].name}
                            >
                              {value[0].name}
                            </p>
                          ) : (
                            <p className="text-sm font-medium">
                              Drag and drop your file here or click to browse
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: PDF, DOC, DOCX, XLS, XLSX, TXT
                        </p>
                      </div>
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                        onChange={(e) => onChange(e.target.files)}
                        disabled={isUploading}
                        className="hidden"
                        {...fieldProps}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {feedback.type === "success" && (
              <Alert
                variant="default"
                className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900"
              >
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{feedback.message}</AlertDescription>
              </Alert>
            )}

            {feedback.type === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{feedback.message}</AlertDescription>
              </Alert>
            )}

            <DialogFooter className="sm:justify-start gap-2">
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
