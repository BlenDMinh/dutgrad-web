'use client';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

export default function SpaceDetailPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <Bot className="h-16 w-16 text-muted-foreground mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold mb-2">Oops! Space not found</h1>
        <p className="text-muted-foreground mb-6">
            {"We couldn't find the space you're looking for."}
        </p>
        <Button variant="default" onClick={() => window.history.back()}>
            ← Go Back
        </Button>
        </div>
    );
}
