"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth.context";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  usernameUpdateSchema,
  type UsernameUpdateCredentials,
} from "@/schemas/auth";
import { userService } from "@/services/api/user.service";
import { APP_ROUTES } from "@/lib/constants";
import { MFASetup } from "./components/mfa-setup";
import { LockKeyhole } from "lucide-react";

export default function CompleteSetupPage() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("username");
  const router = useRouter();

  const usernameForm = useForm<UsernameUpdateCredentials>({
    resolver: zodResolver(usernameUpdateSchema),
    defaultValues: {
      username: user?.username || "",
    },
  });

  useEffect(() => {
    if (user?.username) {
      usernameForm.setValue("username", user.username);
    }
  }, [user]);

  async function onUsernameSubmit(data: UsernameUpdateCredentials) {
    try {
      if (!user) return;

      const updated = await userService.updateProfile({
        ...user,
        username: data.username,
      });

      setUser(updated);
      toast.success("Username updated successfully");

      // Move to the next tab
      setActiveTab("mfa");
    } catch (error) {
      console.error("Failed to update username:", error);
      toast.error("Failed to update username. Please try again.");
    }
  }

  const handleMfaSuccess = () => {
    toast.success("MFA setup completed successfully!");
    router.push(APP_ROUTES.DASHBOARD);
  };

  const handleMfaSkip = () => {
    // If user skips MFA setup, redirect to dashboard
    router.push(APP_ROUTES.DASHBOARD);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Account Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-none bg-muted/50 p-0">
              <TabsTrigger
                value="username"
                className="rounded-none data-[state=active]:bg-background py-3"
              >
                Username
              </TabsTrigger>
              <TabsTrigger
                value="mfa"
                className="rounded-none data-[state=active]:bg-background py-3"
              >
                Two-Factor Auth
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="username" className="mt-0 space-y-4">
                <Form {...usernameForm}>
                  <form
                    onSubmit={usernameForm.handleSubmit(onUsernameSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={usernameForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your username"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This is the name that will be displayed to other
                            users.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit">Continue to Security</Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="mfa" className="mt-0">
                <div className="space-y-6">
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex gap-3">
                      <LockKeyhole className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-sm mb-1">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {`Enable two-factor authentication to add an extra layer
                          of security to your account. You'll need an
                          authenticator app like Google Authenticator or Authy.`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleMfaSkip}>
                      Skip for now
                    </Button>
                    <Button onClick={() => setActiveTab("mfa-setup")}>
                      Set up MFA
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mfa-setup" className="mt-0">
                <MFASetup
                  onSuccess={handleMfaSuccess}
                  onSkip={() => setActiveTab("mfa")}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
