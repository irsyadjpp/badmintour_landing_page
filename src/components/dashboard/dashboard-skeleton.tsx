import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="bg-[#151515] p-6 rounded-[2rem] border border-white/5 flex items-center gap-6">
        <Skeleton className="w-20 h-20 rounded-full bg-white/10" />
        <div className="space-y-2">
           <Skeleton className="h-8 w-64 bg-white/10" />
           <Skeleton className="h-4 w-32 bg-white/10" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-64 w-full rounded-[2.5rem] bg-white/5" />
            <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-40 w-full rounded-[2rem] bg-white/5" />
                <Skeleton className="h-40 w-full rounded-[2rem] bg-white/5" />
            </div>
        </div>
        <div className="lg:col-span-4">
             <Skeleton className="h-full min-h-[400px] w-full rounded-[2.5rem] bg-white/5" />
        </div>
      </div>
    </div>
  );
}
