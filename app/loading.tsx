export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4 text-muted-foreground">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 animate-pulse" />
        {/* Inner spinning ring */}
        <div className="absolute w-12 h-12 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
      <p className="text-sm font-medium animate-pulse">Loading...</p>
    </div>
  );
}
