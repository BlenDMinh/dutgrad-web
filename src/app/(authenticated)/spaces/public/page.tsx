"use client";
import React, { useEffect, useState } from "react";
import { spaceService } from "@/services/api/space.service";
import SpaceCard from "../components/SpaceCard";
import { toast } from "sonner";

interface PublicSpace {
  id: number;
  name: string;
  description: string;
  privacy_status: boolean;
  created_at: string;
}

export default function PublicSpacesPage() {
  const [publicSpaces, setPublicSpaces] = useState<PublicSpace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [joinedSpaceIds, setJoinedSpaceIds] = useState<number[]>([]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicSpaces = async () => {
      try {
        const [publicRes, joinedRes] = await Promise.all([
          spaceService.getSpacePublic(),
          spaceService.getYourSpaces(), 
        ]);
        setPublicSpaces(publicRes.public_spaces || []);
        setJoinedSpaceIds(joinedRes.spaces.map((space: any) => space.id)); 
      } catch (err) {
        setError("Failed to fetch public spaces");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicSpaces();
  }, []);

  const handleJoinSpace = async (spaceId: number) => {
    try {
      await spaceService.joinSpace(spaceId.toString());
      toast.success("Successfully joined the space!");
      setJoinedSpaceIds((prevJoinedSpaceIds) => [...prevJoinedSpaceIds, spaceId]);
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.info("You are already a member of this space.");
      } else if (error.response?.status === 403) {
        toast.error("This space is private and cannot be joined.");
      } else {
        toast.error("Failed to join the space.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-10">
        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Public Spaces
        </span>
      </h1>
      <p className="text-center text-primary text-lg mb-6">
        Explore a collection of amazing public spaces 🌍
      </p>

      {error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : publicSpaces.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          🚫 There is no public space.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {publicSpaces.map((space: PublicSpace) => (
            <SpaceCard
              key={space.id}
              space={space}
              enableJoin={true}
              onJoin={handleJoinSpace}
              isMember={joinedSpaceIds.includes(space.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
