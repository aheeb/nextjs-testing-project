// LatestPost.tsx
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "~/components/ui/card";
import { Loader2, Heart, MessageCircle, Share2, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";

export function LatestPost() {
    const [latestPost] = api.post.getLatest.useSuspenseQuery();
    const utils = api.useUtils();
    const [name, setName] = useState("");

    const createPost = api.post.create.useMutation({
        onSuccess: async () => {
            await utils.post.invalidate();
            setName("");
        },
    });

    return (
        <div className="space-y-6">
            {/* Create Post Card */}
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar>
                        <AvatarFallback>
                            <UserCircle className="w-full h-full" />
                        </AvatarFallback>
                    </Avatar>
                    <form
                        className="flex-1 flex gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            createPost.mutate({ name });
                        }}
                    >
                        <Input
                            type="text"
                            placeholder="What's on your mind?"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            type="submit"
                            disabled={createPost.isPending}
                        >
                            {createPost.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                "Post"
                            )}
                        </Button>
                    </form>
                </CardHeader>
            </Card>

            {/* Latest Post Card */}
            {latestPost && (
                <Card className="w-full">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar>
                            <AvatarFallback>
                                <UserCircle className="w-full h-full" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">You</p>
                            <p className="text-sm text-muted-foreground">Just now</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p>{latestPost.name}</p>
                    </CardContent>
                    <Separator />
                    <CardFooter className="justify-between py-4">
                        <Button variant="ghost" size="sm" className="flex gap-2">
                            <Heart className="w-4 h-4" /> Like
                        </Button>
                        <Button variant="ghost" size="sm" className="flex gap-2">
                            <MessageCircle className="w-4 h-4" /> Comment
                        </Button>
                        <Button variant="ghost" size="sm" className="flex gap-2">
                            <Share2 className="w-4 h-4" /> Share
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {!latestPost && (
                <Card className="w-full">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <p className="text-muted-foreground text-center">
                            No posts yet. Start sharing your thoughts!
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}