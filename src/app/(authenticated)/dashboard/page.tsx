'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { spaceService } from '@/services/api/space.service';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, MessageSquare, TrendingUp, Lock, Unlock } from 'lucide-react';


interface Space {
  id: string;
  name: string;
  description: string;
  privacy_status: boolean;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const [spaceCount, setSpaceCount] = useState<number | null>(null);
  const [chatSessionCount, setChatSessionCount] = useState<number | null>(null);
  const [popularSpaces, setPopularSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [spaceCountData, chatSessionCountData, popularSpacesData] =
          await Promise.all([
            spaceService.getCountMySpace(),
            spaceService.getCountMyChatSessions(),
            spaceService.getPopularSpaces(),
          ]);

        setSpaceCount(spaceCountData);
        setChatSessionCount(chatSessionCountData);
        setPopularSpaces(popularSpacesData.popular_spaces);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-auto">
        <main className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-5">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                Dashboard Overview
              </span>
            </h1>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="My Spaces"
              value={spaceCount}
              description="Total spaces you've created or joined"
              icon={<Users className="h-5 w-5 text-white" />}
              loading={loading}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatsCard
              title="Chat Sessions"
              value={chatSessionCount}
              description="Total chat sessions you've participated in"
              icon={<MessageSquare className="h-5 w-5 text-white" />}
              loading={loading}
              color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            />
            <StatsCard
              title="Popular Spaces"
              value={popularSpaces.length}
              description="Number of trending spaces"
              icon={<TrendingUp className="h-5 w-5 text-white" />}
              loading={loading}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Popular Spaces</h2>
            </div>
            <Tabs defaultValue="grid" className="w-full">
              <TabsContent value="grid" className="mt-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {loading
                    ? Array(6)
                        .fill(0)
                        .map((_, i) => (
                          <Card key={i} className="overflow-hidden">
                            <CardHeader className="p-4">
                              <Skeleton className="h-5 w-3/4" />
                              <Skeleton className="h-4 w-1/2 mt-2" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <Skeleton className="h-16 w-full" />
                              <div className="flex justify-between mt-4">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-1/4" />
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    : popularSpaces.map((space) => (
                        <SpaceCard key={space.id} space={space} />
                      ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
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
}: {
  title: string;
  value: number | null;
  description: string;
  icon: React.ReactNode;
  loading: boolean;
  color: string;
}) {
  return (
    <Card className="overflow-hidden">
      <div className={`${color} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{title}</h3>
          <div className="rounded-full p-2 bg-white/20">{icon}</div>
        </div>
        {loading ? (
          <Skeleton className="h-10 w-24 bg-white/20 mt-2" />
        ) : (
          <div className="text-3xl font-bold mt-2">
            {value !== null ? value.toLocaleString() : '—'}
          </div>
        )}
        <p className="text-sm text-white/80 mt-1">{description}</p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1"></div>
        </div>
      </div>
    </Card>
  );
}

function SpaceCard({ space }: { space: Space }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-t-4 border-t-primary">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {space.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg truncate">{space.name}</CardTitle>
          </div>
          {space.privacy_status ? (
            <Badge
              variant="outline"
              className="gap-1 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400"
            >
              <Lock className="h-3 w-3" /> Private
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
            >
              <Unlock className="h-3 w-3" /> Public
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm text-muted-foreground line-clamp-3 min-h-[4.5rem]">
          {space.description || 'No description available for this space.'}
        </div>
      </CardContent>
    </Card>
  );
}
