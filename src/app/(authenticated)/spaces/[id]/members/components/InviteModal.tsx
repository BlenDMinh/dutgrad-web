import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSpace } from "@/context/space.context";
import { spaceService } from "@/services/api/space.service";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Invitation, Member } from "../page";
import { userService, User } from "@/services/api/user.service";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CheckIcon,
  ChevronsUpDown,
  Copy,
  Link2,
  Loader2,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InviteModalProps {
  onSuccess: () => void | undefined;
  members: Member[];
  invitations: Invitation[];
}

export function InviteModal(props: InviteModalProps) {
  const { space } = useSpace();
  const id = space?.id?.toString() || "";

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [invitationLink, setInvitationLink] = useState("");
  const [isLoadingLink, setIsLoadingLink] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const { onSuccess, members, invitations } = props;

  // Filter out users who are already members or have pending invitations
  const filterExistingUsers = (users: User[]) => {
    const memberIds = new Set(members.map((member) => member.user_id));
    const invitationEmails = new Set(invitations.map((inv) => inv.email));

    return users.filter(
      (user) => !memberIds.has(user.id) && !invitationEmails.has(user.email)
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const resRoles = await spaceService.getSpaceRoles();
      setRoles(resRoles.roles);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const result = await userService.searchUsers(searchQuery);
        setSearchResults(filterExistingUsers(result.users));
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery, members, invitations]);

  const handleInvite = async () => {
    if (!selectedUser) {
      toast.error("Please select a user to invite");
      return;
    }

    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    try {
      await spaceService.inviteUser(id, selectedUser.id, selectedRole);
      toast.success("Invite sent successfully.");
      onSuccess?.();
      setSelectedUser(null);
      setSearchQuery("");
      setOpen(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send invitation.";
      toast.error(errorMessage);
    }
  };

  const handleRoleChange = async (value: string) => {
    const roleId = Number(value);
    setSelectedRole(roleId);
    setIsLoadingLink(true);

    try {
      const res = await spaceService.getOrCreateInviteLink(id, roleId);
      setInvitationLink(res.invitation_link);
    } catch (error) {
      toast.error("Failed to get invitation link.");
    } finally {
      setIsLoadingLink(false);
    }
  };

  const handleCopy = () => {
    if (invitationLink) {
      navigator.clipboard.writeText(invitationLink);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setPopoverOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Invite User to Space</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-1">User</p>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-full justify-between"
                >
                  {selectedUser ? (
                    <div className="flex items-center">
                      <span className="mr-2 font-medium">
                        {selectedUser.username}
                      </span>
                      <span className="text-muted-foreground">
                        ({selectedUser.email})
                      </span>
                    </div>
                  ) : (
                    "Search for users"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  {searching && (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2">Searching...</span>
                    </div>
                  )}
                  {!searching && (
                    <CommandEmpty>
                      {searchQuery.length > 1
                        ? "No users found."
                        : "Type at least 2 characters to search."}
                    </CommandEmpty>
                  )}
                  <CommandGroup>
                    {searchResults.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={`${user.id}`}
                        onSelect={() => handleSelectUser(user)}
                        className="flex justify-between"
                      >
                        <div className="flex flex-col">
                          <span>{user.username}</span>
                          <span className="text-sm text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                        {selectedUser?.id === user.id && (
                          <CheckIcon className="h-4 w-4" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-1">Role</p>
            <Select onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
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
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground mb-1">
                Invitation Link
              </p>
              {isLoadingLink && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            <div
              className={cn(
                "flex items-center gap-2 transition-opacity",
                !selectedRole ? "opacity-50" : "opacity-100"
              )}
            >
              <div className="relative flex-1">
                <Input
                  value={
                    invitationLink ||
                    "Select a role to generate invitation link"
                  }
                  readOnly
                  className="pr-10"
                  disabled={!selectedRole}
                />
                {selectedRole && invitationLink && (
                  <Link2 className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <Button
                onClick={handleCopy}
                disabled={!selectedRole || !invitationLink}
                variant="outline"
                size="icon"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedRole
                ? "Share this link to let others join your space with the selected role"
                : "Select a role above to generate an invitation link"}
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleInvite}
              disabled={!selectedUser || !selectedRole}
            >
              Send Invitation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
