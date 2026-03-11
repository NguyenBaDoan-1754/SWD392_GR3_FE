import { cn } from "@/lib/utils";
import { Button } from "@/features/auth/share/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/auth/share/ui/card";
import { Input } from "@/features/auth/share/ui/input";
import { Label } from "@/features/auth/share/ui/label";
import { useSignup } from "@/features/auth/hook/useSignup";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    handleSubmit,
  } = useSignup();

  const emailValid = /^\S+@\S+\.\S+$/.test(email);
  const nameValid = name.trim().length > 0;
  const passwordValid = password.trim().length > 0;
  const passwordsMatch = password === confirmPassword;
  const isFormValid =
    nameValid && emailValid && passwordValid && passwordsMatch;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center relative pb-2">
          {/* Glow effect behind card */}
          <div
            className="absolute -inset-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(circle, rgba(99,102,241,0.2), transparent)",
              filter: "blur(100px)",
              zIndex: -1,
            }}
          />
          <CardTitle className="mb-2">Create account</CardTitle>
          <CardDescription className="text-slate-300 text-base">
            Please fill in the details to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <div
                    className="rounded-lg px-4 py-3 border text-red-200 text-sm"
                    style={{
                      background: "rgba(127, 29, 29, 0.2)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                    }}
                  >
                    {error}
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                variant={isFormValid ? "default" : "outline"}
                disabled={!isFormValid || isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
              {/* Security indicators */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-[rgba(255,255,255,0.1)] mt-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <span>🔒</span> Secure signup
                </div>
                <div className="flex items-center gap-1">
                  <span>🛡</span> Data protected
                </div>
              </div>
            </div>
          </form>
          <div className="mt-4 text-center text-sm text-slate-300">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
