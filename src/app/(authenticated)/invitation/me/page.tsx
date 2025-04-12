'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCcw, XCircle, CheckCircle, Inbox } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { spaceService } from '@/services/api/space.service';

export default function MyInvitationsPage() {
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState([]);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const res = await spaceService.getMyInvitations();
      setInvitations(res.invitations);
    } catch (err: any) {
      toast.error('Failed to fetch invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (invitationId: string) => {
    try {
      await spaceService.acceptInvitation(invitationId);
      toast.success('Successfully joined the space!');
      fetchInvitations();
    } catch (err: any) {
      console.log(err)
      toast.error(err?.response?.data?.message || 'Failed to join space');
    }
  };

  const handleReject = async (invitationId: number) => {
    try {
      // await spaceService.rejectInvitation(invitationId)
      await fetchInvitations();
    } catch (err: any) {
      toast.error('Failed to reject invitation');
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Toaster position="top-right" richColors />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-10">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            My Invitations
          </span>
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchInvitations}
          disabled={loading}
          className="gap-1"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardFooter className="flex justify-end pt-2">
                <Skeleton className="h-10 w-24 mr-2" />
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : invitations.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-60">
            <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-1">No invitations</h3>
            <p className="text-muted-foreground">
              {"You don't have any pending space invitations at the moment."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invitations.map((invitation: any) => (
            <Card key={invitation.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <span className="mr-2">{invitation.space.name}</span>
                  {invitation.space.privacy_status === false && (
                    <Badge variant="secondary" className="text-xs">
                      Public
                    </Badge>
                  )}
                  {invitation.space.privacy_status === true && (
                    <Badge variant="secondary" className="text-xs">
                      Private
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="flex flex-row justify-between items-center">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 hover:bg-green-50"
                      >
                        {invitation.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Invited by{" "}
                      <span className="font-medium">
                        {invitation.inviter?.username || 'Unknown'}
                      </span>
                    </p>
                  </div>
                  <div className="flex">
                    <Button
                      variant="outline"
                      onClick={() => handleReject(invitation.id)}
                      className="mr-2 gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4" /> Decline
                    </Button>
                    <Button
                      onClick={() => handleJoin(invitation.id)}
                      className="gap-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4" /> Accept
                    </Button>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
