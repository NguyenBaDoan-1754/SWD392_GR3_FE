import { useNavigate } from "react-router-dom";
import { Button } from "@/features/auth/share/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="flex w-full max-w-md flex-col gap-6 text-center">
        <div className="space-y-4">
          <img
            src="/404_NotFound.png"
            alt="404 Not Found"
            className="w-full max-w-xs mx-auto"
          />
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate("/")} className="w-full">
            Go Home
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full"
          >
            Go Back
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          Need help?{" "}
          <a
            href="/"
            className="underline underline-offset-4 hover:text-primary"
          >
            Contact support
          </a>
        </div>
      </div>
    </div>
  );
}
