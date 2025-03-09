"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAccessToken } from "@/lib/auth";
import { exchangeStateAction } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function SuccessCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const state = searchParams.get("state");

    if (!state) {
      setError("Invalid state parameter");
      setIsLoading(false);
      return;
    }

    const performStateExchange = async () => {
      try {
        setIsLoading(true);
        const result = await exchangeStateAction(state);

        if (!result.success || !result.data) {
          setError(result.error || "Authentication failed");
          setIsLoading(false);
          return;
        }

        // With Zod validation, we can be confident that these properties exist
        const { token, is_new_user } = result.data;

        // Store the token
        setAccessToken(token);

        // Redirect based on user status
        if (is_new_user) {
          router.push("/auth/complete-setup");
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        setError("Authentication failed. Please try again.");
        console.error("Authentication error:", err);
        setIsLoading(false);
      }
    };

    performStateExchange();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-primary">
              Authentication Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/login")} variant="default">
              Return to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-primary">
            Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 py-8">
          <div className="text-xl font-medium text-center">
            Authenticating...
          </div>
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}
