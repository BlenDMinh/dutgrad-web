"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSpace } from "@/context/space.context";
import { spaceService } from "@/services/api/space.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Save,
  Trash2,
  AlertTriangle,
  Lock,
  Globe,
  CheckCircle2,
  Info,
  Settings2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { APP_ROUTES } from "@/lib/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function SpaceSettingsPage() {
  const { space } = useSpace();
  const router = useRouter();
  const [name, setName] = useState(space?.name || "");
  const [description, setDescription] = useState(space?.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [privacyStatus, setPrivacyStatus] = useState(
    space?.privacy_status ? "private" : "public"
  );
  const [activeTab, setActiveTab] = useState("general");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Reset success message after 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  // Simulate progress for saving
  useEffect(() => {
    if (isSubmitting) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isSubmitting]);

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Space name is required");
      isValid = false;
    } else if (name.length > 50) {
      setNameError("Space name must be less than 50 characters");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!description.trim()) {
      setDescriptionError("Description is required");
      isValid = false;
    } else if (description.length > 500) {
      setDescriptionError("Description must be less than 500 characters");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    return isValid;
  };

  const handleUpdateSpace = async () => {
    if (!space?.id) return;
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    setIsSubmitting(true);
    setProgress(0);

    try {
      await spaceService.updateSpace(space.id.toString(), {
        name,
        description,
        privacy_status: privacyStatus === "private",
      });

      // Simulate a delay to show progress
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSaveSuccess(true);
      toast.success("Space updated successfully", {
        description: "Your changes have been saved",
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
    } catch (error) {
      console.error("Failed to update space:", error);
      toast.error("Failed to update space", {
        description: "Please try again later",
        icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSpace = async () => {
    if (!space?.id) return;

    setIsDeleting(true);
    try {
      await spaceService.deleteSpace(space.id.toString());
      toast.success("Space deleted successfully", {
        description: "You'll be redirected to your spaces",
      });
      router.push(APP_ROUTES.SPACES.MINE);
    } catch (error) {
      console.error("Failed to delete space:", error);
      toast.error("Failed to delete space", {
        description: "Please try again later",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!space) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-[70vh] text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-6">
          <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Space not found</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          {
            "We couldn't find the space you're looking for. It may have been deleted or you don't have access to it."
          }
        </p>
        <Button
          variant="default"
          onClick={() => router.push(APP_ROUTES.SPACES.MINE)}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Go to My Spaces
        </Button>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <AnimatePresence>
      {!isPageLoaded ? (
        <motion.div
          className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
          exit={{ opacity: 0 }}
          key="loading"
        >
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading space settings...</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-muted/30"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          key="content"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div className="mb-8" variants={itemVariants}>
              <Button
                variant="ghost"
                className="mb-4 pl-0 flex items-center gap-2 text-muted-foreground hover:text-foreground"
                onClick={() =>
                  router.push(APP_ROUTES.SPACES.DETAIL(space.id.toString()))
                }
              >
                <ArrowLeft size={16} />
                Back to Space
              </Button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <motion.h1
                    className="text-3xl font-bold bg-gradient-to-r from-primary to-indigo-500 text-transparent bg-clip-text mb-2"
                    variants={itemVariants}
                  >
                    Space Settings
                  </motion.h1>
                  <motion.p
                    className="text-muted-foreground"
                    variants={itemVariants}
                  >
                    Manage your space settings and preferences
                  </motion.p>
                </div>

                <motion.div variants={itemVariants}>
                  <Badge
                    variant={
                      privacyStatus === "private" ? "outline" : "secondary"
                    }
                    className="flex items-center gap-1 px-3 py-1 text-sm"
                  >
                    {privacyStatus === "private" ? (
                      <>
                        <Lock size={14} />
                        Private Space
                      </>
                    ) : (
                      <>
                        <Globe size={14} />
                        Public Space
                      </>
                    )}
                  </Badge>
                </motion.div>
              </div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger
                    value="general"
                    className="flex items-center gap-2"
                  >
                    <Settings2 size={16} />
                    General Settings
                  </TabsTrigger>
                  <TabsTrigger
                    value="danger"
                    className="flex items-center gap-2"
                  >
                    <AlertTriangle size={16} />
                    Danger Zone
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <motion.div variants={itemVariants}>
                    <Card className="overflow-hidden backdrop-blur-sm bg-card/80 shadow-sm">
                      {isSubmitting && (
                        <Progress
                          value={progress}
                          className="h-1 rounded-none"
                        />
                      )}

                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Settings2 className="h-5 w-5 text-primary" />
                          <CardTitle>General Information</CardTitle>
                        </div>
                        <CardDescription>
                          Basic details about your space
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="name"
                              className="text-sm font-medium"
                            >
                              Space Name
                            </Label>
                            <span className="text-xs text-muted-foreground">
                              {name.length}/50
                            </span>
                          </div>

                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              if (e.target.value.trim()) setNameError("");
                            }}
                            placeholder="Enter space name"
                            className={
                              nameError
                                ? "border-destructive focus-visible:ring-destructive/30"
                                : ""
                            }
                          />

                          <AnimatePresence>
                            {nameError && (
                              <motion.div
                                className="flex items-center gap-2 text-sm font-medium text-destructive"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                              >
                                <AlertTriangle size={14} />
                                {nameError}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="description"
                              className="text-sm font-medium"
                            >
                              Description
                            </Label>
                            <span className="text-xs text-muted-foreground">
                              {description.length}/500
                            </span>
                          </div>

                          <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => {
                              setDescription(e.target.value);
                              if (e.target.value.trim())
                                setDescriptionError("");
                            }}
                            placeholder="Enter space description"
                            rows={4}
                            className={
                              descriptionError
                                ? "border-destructive focus-visible:ring-destructive/30"
                                : ""
                            }
                          />

                          <AnimatePresence>
                            {descriptionError && (
                              <motion.div
                                className="flex items-center gap-2 text-sm font-medium text-destructive"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                              >
                                <AlertTriangle size={14} />
                                {descriptionError}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="pt-2">
                          <h3 className="text-sm font-medium mb-3">
                            Privacy Settings
                          </h3>
                          <div className="bg-muted/40 rounded-lg p-4">
                            <RadioGroup
                              value={privacyStatus}
                              onValueChange={setPrivacyStatus}
                              className="flex flex-col space-y-4"
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex h-5 items-center">
                                  <RadioGroupItem value="public" id="public" />
                                </div>
                                <div className="grid gap-1.5">
                                  <div className="flex items-center gap-2">
                                    <Globe size={16} className="text-primary" />
                                    <Label
                                      htmlFor="public"
                                      className="font-medium"
                                    >
                                      Public
                                    </Label>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Anyone can find and join this space. The
                                    space will be visible in public listings.
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start space-x-3">
                                <div className="flex h-5 items-center">
                                  <RadioGroupItem
                                    value="private"
                                    id="private"
                                  />
                                </div>
                                <div className="grid gap-1.5">
                                  <div className="flex items-center gap-2">
                                    <Lock size={16} className="text-primary" />
                                    <Label
                                      htmlFor="private"
                                      className="font-medium"
                                    >
                                      Private
                                    </Label>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Only invited members can access this space.
                                    The space will not be visible in public
                                    listings.
                                  </p>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Info size={14} />
                          <span>
                            Last updated: {new Date().toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <AnimatePresence>
                            {saveSuccess && (
                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400"
                              >
                                <CheckCircle2 size={14} />
                                Saved successfully
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <Button
                            className="flex items-center gap-2 min-w-[120px]"
                            onClick={handleUpdateSpace}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save size={16} />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="danger">
                  <motion.div variants={itemVariants}>
                    <Card className="overflow-hidden backdrop-blur-sm bg-card/80 shadow-sm">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          <CardTitle className="text-destructive">
                            Danger Zone
                          </CardTitle>
                        </div>
                        <CardDescription>
                          Destructive actions that cannot be undone
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="rounded-md p-5 bg-destructive/5 border border-destructive/20">
                          <h3 className="font-medium flex items-center gap-2">
                            <Trash2 size={16} className="text-destructive" />
                            Delete this space
                          </h3>

                          <p className="text-sm text-muted-foreground mt-2 mb-6">
                            Once you delete a space, there is no going back. All
                            documents, conversations, and data will be
                            permanently deleted.
                          </p>

                          <div className="bg-background/80 p-4 rounded-md mb-6 border border-border">
                            <div className="flex items-center gap-2 mb-2">
                              <Info
                                size={16}
                                className="text-muted-foreground"
                              />
                              <h4 className="font-medium">
                                What will be deleted:
                              </h4>
                            </div>
                            <ul className="text-sm text-muted-foreground space-y-2 ml-6 list-disc">
                              <li>All documents and files in this space</li>
                              <li>All conversation history</li>
                              <li>All member access and permissions</li>
                              <li>All space settings and configurations</li>
                            </ul>
                          </div>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                className="flex items-center gap-2"
                              >
                                <Trash2 size={16} />
                                Delete Space
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                  <AlertTriangle size={18} />
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the space
                                  <span className="font-semibold">
                                    {" "}
                                    {space.name}{" "}
                                  </span>
                                  and all of its documents and data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <div className="bg-muted/30 p-3 rounded-md border text-sm my-2">
                                To confirm, please type{" "}
                                <span className="font-bold">{space.name}</span>{" "}
                                below:
                                <Input
                                  className="mt-2"
                                  placeholder={`Type "${space.name}" to confirm`}
                                />
                              </div>

                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteSpace}
                                  className="bg-destructive hover:bg-destructive/90 gap-2"
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? (
                                    <>
                                      <Loader2
                                        size={16}
                                        className="animate-spin"
                                      />
                                      Deleting...
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 size={16} />
                                      Delete Space
                                    </>
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
