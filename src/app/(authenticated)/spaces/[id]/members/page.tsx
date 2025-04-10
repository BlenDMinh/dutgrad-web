'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { spaceService } from '@/services/api/space.service';
import { FaTrash } from 'react-icons/fa';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface Member {
  user: {
    username: string;
  };
  space_role: {
    name: string;
  };
  created_at: string;
}

interface Invitation {
  invited_user: {
    username: string;
  };
  space_role: {
    name: string;
  };
  created_at: string;
  status: string;
}

export default function SpaceMembersPage() {
  const router = useRouter();
  const { id } = useParams();
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [selectedRole, setSelectedRole] = useState<number>(3);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const resRoles = await spaceService.getSpaceRoles();
      setRoles(resRoles.roles);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const resMembers = await spaceService.getSpaceMembers(id as string);
      const resInvitations = await spaceService.getSpaceInvitations(
        id?.toString() ?? ''
      );
      setMembers(resMembers.members);
      setInvitations(resInvitations.invitations);
    };
    fetchData();
  }, [id, refresh]);

  const refreshList = () => {
    setRefresh(!refresh);
  };

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast.error('Please enter an email');
      return;
    }
    try {
      const res = await spaceService.inviteUser(
        id as string,
        inviteEmail,
        selectedRole
      );
      toast.success('Invite successfully.');
      refreshList();
      setInviteEmail('');
      setOpen(false);
    } catch (error) {
      toast.error('Invite failed. Email not exist.');
    }
  };

  const combinedData = [
    ...members.map((m) => ({
      username: m.user.username,
      role: m.space_role.name,
      joinDate: m.created_at,
      status: '',
    })),
    ...invitations.map((i) => ({
      username: i.invited_user.username,
      role: i.space_role.name,
      joinDate: i.created_at,
      status: i.status,
    })),
  ];

  return (
    <div className="py-12 px-6">
      <Toaster position="top-right" richColors style={{ zIndex: 9999 }} />
      <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-10">
        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Members
        </span>
      </h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Invite User</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User to Space</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 mb-4">
            <Input
              placeholder="Enter email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <Select onValueChange={(value) => setSelectedRole(Number(value))}>
              <SelectTrigger className="border rounded p-2">
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
        </DialogContent>
      </Dialog>
      <div className="bg-background shadow-lg rounded-xl p-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {combinedData.map((item, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted/50 transition cursor-pointer"
              >
                <TableCell className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-semibold uppercase">
                    {item.username[0]}
                  </div>
                  <span>{item.username}</span>
                  {item.status === 'pending' && (
                    <span className="text-yellow-500 ml-2 text-sm">
                      (Pending)
                    </span>
                  )}
                </TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>
                  {new Date(item.joinDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      if (
                        confirm('Are you sure you want to delete this user?')
                      ) {
                      }
                    }}
                  >
                    <FaTrash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
