"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { spaceService } from "@/services/api/space.service";
import { documentService } from "@/services/api/document.service";
import { chatService } from "@/services/api/chat.service";
import {
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
  FaFileAlt,
  FaFileWord,
  FaFile,
  FaCheckCircle,
} from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import {
  Bot,
  Clock,
  AlertCircle,
  FileIcon,
  BotIcon as RobotIcon,
  Calendar,
  Edit,
  Eye,
  Trash2,
} from "lucide-react";
import ImportModal from "./components/ImportModal";
import { APP_ROUTES } from "@/lib/constants";
import { useSpace } from "@/context/space.context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface SpaceDocument {
  id: number;
  name: string;
  s3_url: string;
  privacy_status: boolean;
  created_at: string;
  mime_type: string;
  size: number;
  processing_status: number;
}

export default function SpaceDetailPage() {
  const { space } = useSpace();
  const spaceId = space?.id?.toString() || "";
  const [documents, setDocuments] = useState<SpaceDocument[]>([]);
  const [documentPage, setDocumentPage] = useState<number>(1);
  const [documentTotal, setDocumentTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [documentToDelete, setDocumentToDelete] =
    useState<SpaceDocument | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  useEffect(() => {
    if (!spaceId) return;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const res = await spaceService.getDocumentBySpace(
          spaceId,
          documentPage
        );
        setDocuments(res.documents);
        setDocumentTotal(res.total);
      } catch (err) {
        setError("Failed to fetch documents");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [documentPage, spaceId]);

  useEffect(() => {
    if (!spaceId) return;

    const fetchUserRole = async () => {
      try {
        const response = await spaceService.getUserRole(spaceId);
        setUserRole(response.role.name);
      } catch (err) {
        console.error("Failed to fetch user role:", err);
        setUserRole("");
      }
    };

    fetchUserRole();
  }, [spaceId]);

  const router = useRouter();

  const handleOpenChat = async () => {
    if (!spaceId) return;

    setIsStartingChat(true);
    try {
      const chatSession = await chatService.beginChatSession(
        Number.parseInt(spaceId)
      );
      router.push(APP_ROUTES.CHAT.SPACE(spaceId, chatSession.id.toString()));
    } catch (error) {
      console.error("Failed to start chat session:", error);
      console.log("Toast: Failed to start chat session. Please try again.");
    } finally {
      setIsStartingChat(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) {
      return <FaFilePdf className="text-red-500 h-16 w-16" />;
    } else if (
      mimeType.includes("excel") ||
      mimeType.includes("spreadsheet") ||
      mimeType.includes("xlsx")
    ) {
      return <FaFileExcel className="text-green-600 h-16 w-16" />;
    } else if (mimeType.includes("csv")) {
      return <FaFileCsv className="text-green-400 h-16 w-16" />;
    } else if (mimeType.includes("text/plain") || mimeType.includes("txt")) {
      return <FaFileAlt className="text-gray-500 h-16 w-16" />;
    } else if (mimeType.includes("word") || mimeType.includes("docx")) {
      return <FaFileWord className="text-blue-600 h-16 w-16" />;
    } else {
      return <FaFile className="text-gray-400 h-16 w-16" />;
    }
  };

  const getProcessingStatusInfo = (status: number) => {
    switch (status) {
      case 0:
        return {
          icon: <Clock className="mr-1" size={14} />,
          text: "Queued",
          variant: "outline" as const,
          progressValue: 5,
          progressColor: "bg-yellow-500",
        };
      case 1:
        return {
          icon: <AlertCircle className="mr-1" size={14} />,
          text: "Processing",
          variant: "secondary" as const,
          progressValue: 50,
          progressColor: "bg-blue-500",
        };
      case 2:
        return {
          icon: <FaCheckCircle className="mr-1" size={14} />,
          text: "Ready",
          variant: "default" as const,
          progressValue: 100,
          progressColor: "bg-green-500",
        };
      default:
        return {
          icon: <AlertCircle className="mr-1" size={14} />,
          text: "Unknown",
          variant: "outline" as const,
          progressValue: 0,
          progressColor: "bg-gray-500",
        };
    }
  };

  const handleProcessingStatusClick = (documentId: number) => {
    router.push(APP_ROUTES.DOCUMENT.UPLOAD_PROGRESS(documentId.toString()));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      await documentService.deleteDocument(documentToDelete.id.toString());
      setDocuments(documents.filter((doc) => doc.id !== documentToDelete.id));
      setDocumentTotal((prev) => prev - 1);
      toast.success(`${documentToDelete.name} has been successfully deleted.`);
    } catch (err) {
      console.error("Failed to delete document:", err);
      toast.error("Failed to delete document. Please try again.");
    } finally {
      setDocumentToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (document: SpaceDocument) => {
    setDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin">
            <FileIcon className="h-12 w-12 text-primary" />
          </div>
          <p className="text-xl font-medium text-primary">
            Loading documents...
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(documentTotal / documents.length) || 1;

  if (!space) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <Bot className="h-16 w-16 text-muted-foreground mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold mb-2">Oops! Space not found</h1>
        <p className="text-muted-foreground mb-6">
          {"We couldn't find the space you're looking for."}
        </p>
        <Button variant="default" onClick={() => window.history.back()}>
          ← Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-primary mb-2">
            {space.name}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {space.description}
          </p>
          <div className="flex justify-center mt-6 gap-4">
            <Button
              onClick={() => router.push(APP_ROUTES.SPACES.MEMBER(spaceId))}
              variant="outline"
            >
              Manage Members
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={handleOpenChat}
              disabled={isStartingChat}
            >
              <RobotIcon size={18} />
              {isStartingChat ? "Starting Chat..." : "Open Chat"}
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between w-full mb-6">
              <div className="flex">
                <SearchBar onSearch={(query) => console.log(query)} />
              </div>
              <ImportModal spaceId={spaceId} />
            </div>

            <Separator className="my-6" />

            <div className="mt-6">
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-medium text-muted-foreground">
                    No documents uploaded yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 mb-6">
                    Upload your first document to get started
                  </p>
                </div>
              ) : (
                <ul className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                  {documents.map((document) => {
                    const statusInfo = getProcessingStatusInfo(
                      document.processing_status
                    );
                    const fileDate = new Date(document.created_at);
                    const timeAgo = formatDistanceToNow(fileDate, {
                      addSuffix: true,
                    });

                    return (
                      <Card
                        key={document.id}
                        className="overflow-hidden transition-all duration-300 hover:shadow-md group border border-border/50"
                      >
                        <CardContent className="p-0">
                          <div className="flex items-stretch">
                            <div className="flex items-center justify-center p-4 bg-background w-24 border-r border-border/50">
                              <div className="relative">
                                {getFileIcon(document.mime_type)}
                                <div className="absolute -top-2 -right-2 text-xs font-medium bg-background px-1 rounded border border-border/50 text-muted-foreground">
                                  {formatFileSize(document.size)}
                                </div>
                              </div>
                            </div>

                            <div className="flex-1 p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                                    {document.name}
                                  </h3>
                                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                    <span>{timeAgo}</span>
                                  </div>
                                </div>

                                <div className="flex space-x-1">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-8 w-8"
                                          onClick={() => {}}
                                        >
                                          <Eye size={16} />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>View document</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>

                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-8 w-8"
                                          onClick={() => {}}
                                        >
                                          <Edit size={16} />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Edit document</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>

                                  {(userRole === "owner" ||
                                    userRole === "editor") && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                            onClick={() =>
                                              openDeleteDialog(document)
                                            }
                                          >
                                            <Trash2 size={16} />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Delete document</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center mt-3 space-x-2">
                                <Badge
                                  variant={
                                    document.privacy_status
                                      ? "outline"
                                      : "secondary"
                                  }
                                  className="px-2 py-0.5 text-xs"
                                >
                                  {document.privacy_status
                                    ? "Private"
                                    : "Public"}
                                </Badge>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        variant={statusInfo.variant}
                                        className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity px-2 py-0.5 text-xs"
                                        onClick={() =>
                                          handleProcessingStatusClick(
                                            document.id
                                          )
                                        }
                                      >
                                        {statusInfo.icon}
                                        {statusInfo.text}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Click to view processing details</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>

                              <div className="mt-3">
                                <Progress
                                  value={statusInfo.progressValue}
                                  className="h-1.5 w-full"
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-3">
            <Button
              variant="outline"
              onClick={() => setDocumentPage((prev) => Math.max(prev - 1, 1))}
              disabled={documentPage === 1}
              size="sm"
            >
              Previous
            </Button>
            <span className="flex items-center text-sm font-medium">
              Page {documentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setDocumentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={documentPage === totalPages}
              size="sm"
            >
              Next
            </Button>
          </div>
        )}

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this document?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                document
                {documentToDelete?.name} and remove it from the space.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteDocument}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
