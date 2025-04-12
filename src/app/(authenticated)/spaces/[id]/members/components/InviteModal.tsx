import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useSpace } from '@/context/space.context';
import { spaceService } from '@/services/api/space.service';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface InviteModalProps {
  onSuccess: () => void | undefined;
}

export function InviteModal(props: InviteModalProps) {
  const { space } = useSpace();
  const id = space?.id?.toString() || '';

  const [open, setOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [selectedRole, setSelectedRole] = useState<number>(3);
  const [invitationLink, setInvitationLink] = useState('');

  const { onSuccess } = props;

  useEffect(() => {
    const fetchData = async () => {
      const resRoles = await spaceService.getSpaceRoles();
      setRoles(resRoles.roles);
    };
    fetchData();
  }, []);

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast.error('Please enter an email');
      return;
    }
    try {
      await spaceService.inviteUser(id, inviteEmail, selectedRole);
      toast.success('Invite successfully.');
      onSuccess?.();
      setInviteEmail('');
      setOpen(false);
    } catch (error) {
      toast.error('Invite failed. Email not exist.');
    }
  };

  const handleRoleChange = async (value: string) => {
    const roleId = Number(value);
    setSelectedRole(roleId);

    try {
      const res = await spaceService.getOrCreateInviteLink(id, roleId);
      setInvitationLink(res.invitation_link);
      console.log()
    } catch (error) {
      toast.error('Failed to get invitation link.');
    }
  };

  const handleCopy = () => {
    if (invitationLink) {
      navigator.clipboard.writeText(invitationLink);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User to Space</DialogTitle>
        </DialogHeader>

        <div className="flex flex-row items-center gap-4 mb-4">
          <Input
            placeholder="Enter email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1"
          />
          <Select onValueChange={handleRoleChange}>
            <SelectTrigger className="border rounded p-2 min-w-[150px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {roles.slice(1).map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={handleInvite}>Invite</Button>
        </div>

        {invitationLink && (
          <div className="flex items-center gap-2">
            <Input value={invitationLink} readOnly className="flex-1" />
            <Button onClick={handleCopy}>Copy</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
