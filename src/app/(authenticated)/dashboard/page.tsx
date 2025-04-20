"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { spaceService } from "@/services/api/space.service";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  MessageSquare,
  TrendingUp,
  Sparkles,
  BarChart3,
  Activity,
  Zap,
} from "lucide-react";
import SpaceCard from "../spaces/components/SpaceCard";

interface Space {
  id: number;
  name: string;
  description: string;
  privacy_status: boolean;
  created_at: string;
}

export default function Dashboard() {
  const [spaceCount, setSpaceCount] = useState<number | null>(null);
  const [chatSessionCount, setChatSessionCount] = useState<number | null>(null);
  const [popularSpaces, setPopularSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedSpaceIds, setJoinedSpaceIds] = useState<number[]>([]);
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [
          spaceCountData,
          chatSessionCountData,
          popularSpacesData,
          joinedSpacesData,
        ] = await Promise.all([
          spaceService.getCountMySpace(),
          spaceService.getCountMyChatSessions(),
          spaceService.getPopularSpaces(),
          spaceService.getYourSpaces(),
        ]);

        setSpaceCount(spaceCountData);
        setChatSessionCount(chatSessionCountData);
        setPopularSpaces(popularSpacesData.popular_spaces);
        setJoinedSpaceIds(
          joinedSpacesData.spaces.map((space: any) => space.id)
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
        // Set data ready after a small delay to ensure DOM is ready
        setTimeout(() => setIsDataReady(true), 100);
      }
    };

    fetchDashboardData();
  }, []);

  const handleJoinSpace = async (spaceId: number) => {
    try {
      await spaceService.joinSpace(spaceId.toString());
      setJoinedSpaceIds((prevJoinedSpaceIds) => [
        ...prevJoinedSpaceIds,
        spaceId,
      ]);
    } catch (error: any) {
      console.error("Failed to join space:", error);
    }
  };

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Animated Header - No dependency on data */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-5xl font-extrabold mb-2">
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
              Your Dashboard
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Welcome back! Here's what's happening in your spaces
            <Sparkles className="h-5 w-5 text-amber-500" />
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
          {/* Render stats cards without animations during loading */}
          {!isDataReady ? (
            <>
              <StatsCard
                title="My Spaces"
                value={spaceCount}
                description="Total spaces you've created or joined"
                icon={<Users className="h-6 w-6 text-white" />}
                loading={loading}
                color="from-violet-500 to-purple-600"
                accentColor="rgba(139, 92, 246, 0.3)"
                animate={false}
              />
              <StatsCard
                title="Chat Sessions"
                value={chatSessionCount}
                description="Total chat sessions you've participated in"
                icon={<MessageSquare className="h-6 w-6 text-white" />}
                loading={loading}
                color="from-cyan-500 to-blue-600"
                accentColor="rgba(14, 165, 233, 0.3)"
                animate={false}
              />
              <StatsCard
                title="Popular Spaces"
                value={popularSpaces.length}
                description="Number of trending spaces"
                icon={<TrendingUp className="h-6 w-6 text-white" />}
                loading={loading}
                color="from-pink-500 to-rose-600"
                accentColor="rgba(244, 114, 182, 0.3)"
                animate={false}
              />
            </>
          ) : (
            <AnimatePresence>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full"
                style={{ gridColumn: "1 / -1" }}
              >
                <motion.div variants={itemVariants}>
                  <StatsCard
                    title="My Spaces"
                    value={spaceCount}
                    description="Total spaces you've created or joined"
                    icon={<Users className="h-6 w-6 text-white" />}
                    loading={loading}
                    color="from-violet-500 to-purple-600"
                    accentColor="rgba(139, 92, 246, 0.3)"
                    animate={true}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <StatsCard
                    title="Chat Sessions"
                    value={chatSessionCount}
                    description="Total chat sessions you've participated in"
                    icon={<MessageSquare className="h-6 w-6 text-white" />}
                    loading={loading}
                    color="from-cyan-500 to-blue-600"
                    accentColor="rgba(14, 165, 233, 0.3)"
                    animate={true}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <StatsCard
                    title="Popular Spaces"
                    value={popularSpaces.length}
                    description="Number of trending spaces"
                    icon={<TrendingUp className="h-6 w-6 text-white" />}
                    loading={loading}
                    color="from-pink-500 to-rose-600"
                    accentColor="rgba(244, 114, 182, 0.3)"
                    animate={true}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Activity Section */}
        <div className="mb-10">
          {isDataReady ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="h-6 w-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Recent Activity
                  </h2>
                </div>
                <Button
                  variant="outline"
                  className="border-indigo-300 hover:bg-indigo-100 dark:border-indigo-700 dark:hover:bg-indigo-900"
                >
                  View All
                </Button>
              </div>

              <Card className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border-indigo-100 dark:border-indigo-900">
                <CardContent className="p-0">
                  <div className="divide-y divide-indigo-100 dark:divide-indigo-900">
                    {loading ? (
                      Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="p-4 flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-40" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        ))
                    ) : (
                      <>
                        <ActivityItem
                          icon={<Zap className="h-4 w-4 text-amber-500" />}
                          title="New space joined"
                          description="You joined the 'Design Systems' space"
                          time="2 hours ago"
                          color="bg-amber-100 dark:bg-amber-900/30"
                        />
                        <ActivityItem
                          icon={
                            <MessageSquare className="h-4 w-4 text-emerald-500" />
                          }
                          title="New chat session"
                          description="You started a new chat in 'Product Team'"
                          time="Yesterday"
                          color="bg-emerald-100 dark:bg-emerald-900/30"
                        />
                        <ActivityItem
                          icon={<Users className="h-4 w-4 text-blue-500" />}
                          title="Space invitation"
                          description="You were invited to join 'Marketing'"
                          time="3 days ago"
                          color="bg-blue-100 dark:bg-blue-900/30"
                        />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="h-6 w-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Recent Activity
                  </h2>
                </div>
                <Button
                  variant="outline"
                  className="border-indigo-300 hover:bg-indigo-100 dark:border-indigo-700 dark:hover:bg-indigo-900"
                >
                  View All
                </Button>
              </div>

              <Card className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border-indigo-100 dark:border-indigo-900">
                <CardContent className="p-0">
                  <div className="divide-y divide-indigo-100 dark:divide-indigo-900">
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="p-4 flex items-center gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Popular Spaces */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-fuchsia-600" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Popular Spaces
              </h2>
            </div>
            <Badge className="bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-200 dark:bg-fuchsia-900/30 dark:text-fuchsia-300">
              Trending Now
            </Badge>
          </div>

          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="mb-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i}>
                        <Card className="overflow-hidden border-t-4 border-t-indigo-400">
                          <CardHeader className="p-4">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2 mt-2" />
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <Skeleton className="h-16 w-full" />
                            <div className="flex justify-between mt-4">
                              <Skeleton className="h-4 w-1/4" />
                              <Skeleton className="h-8 w-1/4 rounded-md" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))
                ) : isDataReady ? (
                  <AnimatePresence>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full"
                      style={{ gridColumn: "1 / -1" }}
                    >
                      {popularSpaces.map((space) => (
                        <motion.div key={space.id} variants={itemVariants}>
                          <SpaceCard
                            space={space}
                            enableJoin={true}
                            onJoin={handleJoinSpace}
                            isMember={joinedSpaceIds.includes(space.id)}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  popularSpaces.map((space) => (
                    <div key={space.id}>
                      <SpaceCard
                        space={space}
                        enableJoin={true}
                        onJoin={handleJoinSpace}
                        isMember={joinedSpaceIds.includes(space.id)}
                      />
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <Card className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border-indigo-100 dark:border-indigo-900">
                <CardContent className="p-0">
                  <div className="divide-y divide-indigo-100 dark:divide-indigo-900">
                    {loading
                      ? Array(6)
                          .fill(0)
                          .map((_, i) => (
                            <div
                              key={i}
                              className="p-4 flex items-center gap-4"
                            >
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-60" />
                              </div>
                              <Skeleton className="h-8 w-16 rounded-md" />
                            </div>
                          ))
                      : popularSpaces.map((space) => (
                          <div
                            key={space.id}
                            className="p-4 flex items-center gap-4"
                          >
                            <Avatar>
                              <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                                {space.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-medium">{space.name}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                {space.description ||
                                  "No description available"}
                              </p>
                            </div>
                            {joinedSpaceIds.includes(space.id) ? (
                              <Badge
                                variant="outline"
                                className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                              >
                                Member
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleJoinSpace(space.id)}
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all"
                              >
                                Join
                              </Button>
                            )}
                          </div>
                        ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon,
  loading,
  color,
  accentColor,
  animate = true,
}: {
  title: string;
  value: number | null;
  description: string;
  icon: React.ReactNode;
  loading: boolean;
  color: string;
  accentColor: string;
  animate?: boolean;
}) {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 relative">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-90 z-0`}
      ></div>
      <div
        className="absolute right-0 top-0 w-32 h-32 rounded-full"
        style={{
          background: accentColor,
          filter: "blur(40px)",
          transform: "translate(30%, -30%)",
        }}
      ></div>

      <CardHeader className="relative z-10 pb-2 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-medium">{title}</CardTitle>
          <div className="rounded-full p-2 bg-white/20 backdrop-blur-sm">
            {icon}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 pt-0 text-white">
        {loading ? (
          <Skeleton className="h-12 w-28 bg-white/20 mb-2" />
        ) : (
          <div className="text-4xl font-bold mb-2 flex items-baseline">
            {value !== null ? value.toLocaleString() : "—"}
            <span className="text-sm ml-1 opacity-80">total</span>
          </div>
        )}
        <p className="text-sm text-white/80">{description}</p>

        <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
          {animate ? (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "70%" }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-full bg-white/60 rounded-full"
            />
          ) : (
            <div className="h-full bg-white/60 rounded-full w-[70%]" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  time,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  color: string;
}) {
  return (
    <div className="p-4 flex items-center gap-4 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors">
      <div className={`p-2 rounded-full ${color}`}>{icon}</div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500">{time}</span>
    </div>
  );
}
