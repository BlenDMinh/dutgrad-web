"use client";

import { useEffect, useState } from "react";
import { spaceService } from "@/services/api/space.service";
import { FaTrash } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSpace } from "@/context/space.context";
import { SPACE_ROLE } from "@/lib/constants";
import { InviteModal } from "./components/InviteModal";
import { motion, AnimatePresence } from "framer-motion";

export interface Member {
  user: {
    username: string;
  };
  space_role: {
    name: string;
  };
  created_at: string;
}

export interface Invitation {
  invited_user: {
    username: string;
  };
  space_role: {
    name: string;
  };
  created_at: string;
  status: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const tableContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.3,
    },
  },
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function SpaceMembersPage() {
  const { space, role } = useSpace();
  const id = space?.id?.toString() || "";
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if(!id) return
    const fetchData = async () => {
      setLoading(true);
      const resMembers = await spaceService.getSpaceMembers(id);
      const resInvitations = await spaceService.getSpaceInvitations(id);
      setMembers(resMembers.members);
      setInvitations(resInvitations.invitations);
      setLoading(false);
    };
    fetchData();
  }, [id, refresh]);

  const refreshList = () => {
    setRefresh(!refresh);
  };

  const combinedData = [
    ...members.map((m) => ({
      username: m.user.username,
      role: m.space_role.name,
      joinDate: m.created_at,
      status: "",
    })),
    ...invitations
      .filter((i) => i.status !== "accepted" && i.status !== "rejected")
      .map((i) => ({
        username: i.invited_user.username,
        role: i.space_role.name,
        joinDate: i.created_at,
        status: i.status,
      })),
  ];

  return (
    <motion.div
      className="py-12 px-6"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <motion.h1
        className="text-3xl font-extrabold text-center text-gray-900 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Members
        </span>
      </motion.h1>

      {role?.id === SPACE_ROLE.OWNER && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <InviteModal
            members={members}
            invitations={invitations}
            onSuccess={() => {
              refreshList();
            }}
          />
        </motion.div>
      )}

      <motion.div
        className="bg-background shadow-lg rounded-xl p-6 overflow-x-auto mt-2"
        variants={tableContainerVariants}
        initial="hidden"
        animate="visible"
      >
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
            <AnimatePresence>
              {loading
                ? Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <motion.tr
                        key={`skeleton-${index}`}
                        variants={tableRowVariants}
                        className="bg-muted/50"
                        style={{ height: "56px" }}
                      >
                        {Array(4)
                          .fill(0)
                          .map((_, cellIndex) => (
                            <motion.td
                              key={`skeleton-cell-${cellIndex}`}
                              className="px-4 py-3"
                            >
                              <motion.div
                                className="h-4 bg-muted rounded"
                                animate={{
                                  opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1.5,
                                }}
                              />
                            </motion.td>
                          ))}
                      </motion.tr>
                    ))
                : combinedData.map((item, index) => (
                    <motion.tr
                      key={index}
                      className="hover:bg-muted/50 transition cursor-pointer"
                      variants={tableRowVariants}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        delay: index * 0.05,
                      }}
                    >
                      <TableCell className="flex items-center gap-3">
                        <motion.div
                          className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-semibold uppercase"
                          whileHover={{ scale: 1.1 }}
                        >
                          {item.username[0]}
                        </motion.div>
                        <span>{item.username}</span>
                        {item.status === "pending" && (
                          <motion.span
                            className="text-yellow-500 ml-2 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                          >
                            (Pending)
                          </motion.span>
                        )}
                      </TableCell>
                      <TableCell>{item.role}</TableCell>
                      <TableCell>
                        {new Date(item.joinDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        {role?.id !== SPACE_ROLE.VIEWER && (
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this user?"
                                )
                              ) {
                              }
                            }}
                          >
                            <FaTrash />
                          </Button>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}
