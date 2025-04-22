"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Unlock, Users, Calendar, Star } from "lucide-react";

interface Space {
  id: number;
  name: string;
  description: string;
  privacy_status: boolean;
  created_at: string;
}

interface SpaceCardProps {
  space: Space;
  enableJoin?: boolean;
  onJoin?: (spaceId: number) => void;
  isMember?: boolean;
}

export default function SpaceCard({
  space,
  enableJoin,
  onJoin,
  isMember,
}: SpaceCardProps) {
  const router = useRouter();
  const handleCardClick = (spaceId: number) => {
    if (!enableJoin) {
      router.push(`/spaces/${spaceId}`);
    }
  };

  const handleJoin = (e: React.MouseEvent, spaceId: number) => {
    e.stopPropagation();
    onJoin?.(spaceId);
  };

  const gradients = [
    "from-purple-500 to-indigo-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-amber-500",
    "from-pink-500 to-rose-500",
    "from-violet-500 to-purple-500",
  ];

  const randomGradient = gradients[space.id % gradients.length];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        key={space.id}
        onClick={() => handleCardClick(space.id)}
        className={`cursor-pointer h-full overflow-hidden group relative border-none shadow-lg ${
          enableJoin ? "hover:shadow-xl" : ""
        }`}
      >
        <div
          className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-br ${randomGradient} opacity-90`}
        />

        <div className="absolute top-16 right-4 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm" />

        <CardHeader className="relative z-10 pt-6 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${randomGradient} text-white font-bold`}
              >
                {space.name.substring(0, 2).toUpperCase()}
              </div>
              <CardTitle className="text-xl font-bold text-white group-hover:underline transition-all">
                {space.name}
              </CardTitle>
            </div>
          </div>
          <CardDescription className="text-foreground/30 mt-1">
            {new Date(space.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 bg-white dark:bg-background pt-6">
          <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 min-h-[4.5rem]">
            {space.description || "No description available for this space."}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Users className="h-3.5 w-3.5 mr-1" />
              <span>12 members</span>
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>5 sessions</span>
            </div>
            {space.id % 3 === 0 && (
              <div className="flex items-center text-xs text-amber-500 dark:text-amber-400">
                <Star className="h-3.5 w-3.5 mr-1 fill-amber-500 dark:fill-amber-400" />
                <span>Popular</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-2 mt-auto bg-white dark:bg-background border-t border-gray-100 dark:border-gray-700/50">
          <Badge
            variant={space.privacy_status ? "secondary" : "outline"}
            className={`px-3 py-1 flex items-center gap-1 ${
              !space.privacy_status
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-400"
                : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/70 dark:text-amber-400"
            }`}
          >
            {space.privacy_status ? (
              <>
                <Lock className="h-3 w-3" /> Private
              </>
            ) : (
              <>
                <Unlock className="h-3 w-3" /> Public
              </>
            )}
          </Badge>

          {enableJoin && !isMember ? (
            <Button
              size="sm"
              onClick={(e) => handleJoin(e, space.id)}
              className={`bg-gradient-to-r ${randomGradient} hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all`}
            >
              Join Space
            </Button>
          ) : isMember ? (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Member
            </Badge>
          ) : null}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
