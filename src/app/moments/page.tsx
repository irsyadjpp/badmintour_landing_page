import { db } from "@/lib/firebase-admin";
import { getTikTokVideos } from "@/lib/tiktok";
import MomentsGallery from "@/components/social/moments-gallery";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getDynamicMoments() {
    let moments: any[] = [];

    try {
        // 1. Fetch TikTok Integration Config
        const tiktokConfigDoc = await db.collection("system_config").doc("tiktok_integration").get();

        if (tiktokConfigDoc.exists) {
            const data = tiktokConfigDoc.data();
            const accessToken = data?.accessToken;

            if (accessToken) {
                // 2. Fetch Videos from TikTok API
                const videos = await getTikTokVideos(accessToken);

                // 3. Map to Moment Format
                const tiktokMoments = videos.map((v: any) => ({
                    id: `tiktok-${v.id}`,
                    type: 'video',
                    src: v.cover_image_url || "https://picsum.photos/900/1600",
                    category: 'TikTok',
                    title: v.title || "TikTok Video",
                    user: data.displayName || "Badmintour TikTok",
                    likes: v.like_count || 0,
                    aspect: 'aspect-[9/16]',
                    embedLink: `https://www.tiktok.com/embed/v2/${v.id}`
                }));

                moments = [...moments, ...tiktokMoments];
            }
        }
    } catch (error) {
        console.error("Failed to fetch dynamic moments:", error);
        // Continue gracefully, gallery has fallbacks
    }

    // TODO: Add Instagram fetch logic here in future

    return moments;
}

export default async function MomentsPage() {
    const moments = await getDynamicMoments();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
            <Header />
            <main className="flex-1 pt-28 md:pt-36 pb-20">
                <MomentsGallery initialMoments={moments} />
            </main>
            <Footer />
        </div>
    );
}