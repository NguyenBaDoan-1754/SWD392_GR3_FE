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
import { useLogin } from "@/features/auth/hook/useLogin";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSubmit,
    isLoading,
  } = useLogin();

  const emailValid = /^\S+@\S+\.\S+$/.test(email);
  const isFormValid = emailValid && password.trim().length > 0;

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
          <CardTitle className="mb-2">Welcome back</CardTitle>
          <CardDescription className="text-slate-300 text-base">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {error && (
                <div
                  className="rounded-lg px-4 py-3 border text-red-200"
                  style={{
                    background: "rgba(127, 29, 29, 0.2)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                  }}
                >
                  {error}
                </div>
              )}
              <div className="grid gap-6">
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
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm text-cyan-400 hover:text-cyan-300 transition-colors underline-offset-4 hover:underline font-semibold"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  variant={isFormValid ? "default" : "outline"}
                  disabled={!isFormValid || isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
              <div className="text-center text-slate-300">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  Sign up
                </a>
              </div>
              {/* Security indicators */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-[rgba(255,255,255,0.1)] mt-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <span>🔒</span> Secure login
                </div>
                <div className="flex items-center gap-1">
                  <span>🛡</span> Data protected
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-slate-400 [&_a]:text-cyan-400 [&_a]:underline-offset-2 [&_a]:hover:text-cyan-300 [&_a]:transition-colors">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
