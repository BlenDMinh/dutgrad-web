"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSpace } from "@/context/space.context"
import { spaceService } from "@/services/api/space.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Trash2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { APP_ROUTES } from "@/lib/constants"
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
} from "@/components/ui/alert-dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function SpaceSettingsPage() {
  const { space } = useSpace()
  const router = useRouter()
  const [name, setName] = useState(space?.name || "")
  const [description, setDescription] = useState(space?.description || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [privacyStatus, setPrivacyStatus] = useState(space?.privacy_status ? "private" : "public")

  if (!space) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <AlertTriangle className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold mb-2">Space not found</h1>
        <p className="text-muted-foreground mb-6">{"We couldn't find the space you're looking for."}</p>
        <Button variant="default" onClick={() => router.push(APP_ROUTES.SPACES.MINE)}>
          ← Go to Spaces
        </Button>
      </div>
    )
  }

  const handleUpdateSpace = async () => {
    if (!space?.id) return

    setIsSubmitting(true)
    try {
      await spaceService.updateSpace(space.id.toString(), {
        name,
        description,
        privacy_status: privacyStatus === "private",
      })
      toast.success("Space updated successfully")
    } catch (error) {
      console.error("Failed to update space:", error)
      toast.error("Failed to update space. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSpace = async () => {
    if (!space?.id) return

    setIsDeleting(true)
    try {
    await spaceService.deleteSpace(space.id.toString())
      toast.success("Space deleted successfully")
      router.push(APP_ROUTES.SPACES.MINE)
    } catch (error) {
      console.error("Failed to delete space:", error)
      toast.error("Failed to delete space. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4 pl-0 flex items-center gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => router.push(APP_ROUTES.SPACES.DETAIL(space.id.toString()))}
          >
            <ArrowLeft size={16} />
            Back to Space
          </Button>
          <h1 className="text-3xl font-bold">Space Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your space settings and preferences</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Space Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter space name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter space description"
                  rows={4}
                />
              </div>

              <div className="space-y-3 pt-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Privacy Status</h3>
                  <RadioGroup
                    value={privacyStatus}
                    onValueChange={setPrivacyStatus}
                    className="flex flex-col space-y-3"
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="public" className="font-medium">
                          Public
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Anyone can find and join this space. The space will be visible in public listings.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="private" id="private" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="private" className="font-medium">
                          Private
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Only invited members can access this space. The space will not be visible in public listings.
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Button
                className="w-full sm:w-auto flex items-center gap-2 mt-6"
                onClick={handleUpdateSpace}
                disabled={isSubmitting}
              >
                <Save size={16} />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-destructive/30 p-4">
                <h3 className="font-medium">Delete this space</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Once you delete a space, there is no going back. All documents and data will be permanently deleted.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <Trash2 size={16} />
                      Delete Space
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the space
                        <span className="font-semibold"> {space.name} </span>
                        and all of its documents and data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteSpace}
                        className="bg-destructive hover:bg-destructive/90"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete Space"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
