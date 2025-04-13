"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation";

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
  }

export default function SpaceCard({ space, enableJoin, onJoin }: SpaceCardProps) {
    const router = useRouter()
    const handleCardClick = (spaceId: number) => {
        if (!enableJoin) {
          router.push(`/spaces/${spaceId}`)
        }
      }
    
      const handleJoin = (e: React.MouseEvent, spaceId: number) => {
        e.stopPropagation()
        onJoin?.(spaceId)
      }
    return (<Card
    key={space.id}
    onClick={() => handleCardClick(space.id)}
    className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] flex flex-col h-full ${enableJoin ? "hover:bg-muted/50" : ""}`}
  >
    <CardHeader>
      <CardTitle className="text-xl font-semibold hover:text-primary transition-colors">{space.name}</CardTitle>
      <CardDescription className="line-clamp-2">{space.description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow"></CardContent>
    <CardFooter className="flex justify-between items-center pt-2 mt-auto">
      <Badge variant={space.privacy_status ? "destructive" : "secondary"} className="px-3 py-1">
        {space.privacy_status ? "Private" : "Public"}
      </Badge>
      {enableJoin ? (
        <Button size="sm" onClick={(e) => handleJoin(e, space.id)} variant="outline">
          Join
        </Button>
      ) : (
        <span className="text-sm text-muted-foreground">{new Date(space.created_at).toLocaleDateString()}</span>
      )}
    </CardFooter>
  </Card>)
}
