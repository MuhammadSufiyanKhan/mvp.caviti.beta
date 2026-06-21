import { LoaderCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "pulse" | "bounce";
  fullScreen?: boolean;
  message?: string;
}

const sizeMap = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-16 h-16",
};

export function Loader({
  size = "md",
  variant = "default",
  fullScreen = false,
  message,
}: LoaderProps) {
  const iconClass = cn(sizeMap[size], "text-blue-500 animate-spin");

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className={iconClass} />
          {message && <p className="text-white text-lg font-medium">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {variant === "pulse" ? (
        <div className={cn(iconClass, "animate-pulse")}>
          <Loader2 />
        </div>
      ) : variant === "bounce" ? (
        <div className={cn(iconClass, "animate-bounce")}>
          <Loader2 />
        </div>
      ) : (
        <LoaderCircle className={iconClass} />
      )}
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
}

export function SkeletonLoader({
  count = 3,
  variant,
}: {
  count?: number;
  variant?: "card" | "text" | "avatar";
} = {}) {
  if (variant === "card") {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (variant === "avatar") {
    return (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse"
        />
      ))}
    </div>
  );
}

export function ButtonLoader({
  isLoading,
  children,
  className,
}: {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      disabled={isLoading}
      className={cn(
        "disabled:opacity-50 disabled:cursor-not-allowed transition-all",
        className
      )}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export function PageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center space-y-4">
        <LoaderCircle className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
        <h2 className="text-2xl font-semibold text-gray-900">{message}</h2>
      </div>
    </div>
  );
}
