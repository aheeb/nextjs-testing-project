// Home.tsx
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
    const hello = await api.post.hello({ text: "from tRPC" });
    const session = await auth();

    if (session?.user) {
        void api.post.getLatest.prefetch();
    }

    return (
        <HydrateClient>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <nav className="fixed top-0 w-full bg-white dark:bg-gray-800 shadow-sm z-10">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                        <h1 className="text-xl font-bold">Social Feed</h1>
                        <Button variant="outline" asChild>
                            <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
                                {session ? "Sign out" : "Sign in"}
                            </Link>
                        </Button>
                    </div>
                </nav>

                <main className="max-w-2xl mx-auto pt-20 px-4">
                    {session?.user && <LatestPost />}
                </main>
            </div>
        </HydrateClient>
    );
}