"use client";
import { useEffect, useState } from "react";
import { spaceService } from "@/services/api/space.service";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { APP_ROUTES } from "@/lib/constants";
import { useSearchParams, useRouter } from "next/navigation";

export default function InvitationPage() {
  const [loading, setLoading] = useState(true);
  const [canJoin, setCanJoin] = useState(false); 
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleJoin = async () => {
    if (!token) {
      toast.error("Token not found in URL.");
      return;
    }

    setLoading(true);
    try {
      await spaceService.joinSpaceWithToken(token);
    } catch (err: any) {
      const errMsg = err?.response?.data?.message;
      if (errMsg) {
        toast.error(errMsg);
        setCanJoin(true); 
      } else {
        toast.error("Failed to join space");
        setCanJoin(true);
      }
    } finally {
      router.push(APP_ROUTES.SPACES.MINE);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("No token provided");
      return;
    }

    handleJoin(); 
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Toaster position="top-right" richColors style={{ zIndex: 9999 }} />
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full text-center">
        <h1 className="text-xl font-semibold mb-4">{"You've been invited to join a space"}</h1>
        <p className="mb-6">Click the button below to accept the invitation.</p>
        {canJoin && (
          <Button onClick={handleJoin} disabled={loading}>
            {loading ? <Loader className="animate-spin mr-2 w-4 h-4" /> : "Join Space"}
          </Button>
        )}
        {!canJoin && loading && (
          <p className="text-gray-500 text-sm">Processing invitation...</p>
        )}
      </div>
    </div>
  );
}
