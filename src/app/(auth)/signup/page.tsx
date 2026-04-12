"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSignUp } from "@clerk/nextjs/legacy";
import {
  Rocket,
  User,
  Mail,
  Lock,
  ShieldCheck,
  UserRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface FormErrors {
  displayName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();
  const [displayName, setDisplayName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (displayName.trim().length === 0) {
      newErrors.displayName = "Display name is required";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoaded || !validate()) return;

    setServerError(null);
    setIsLoading(true);

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName: displayName.trim(),
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        localStorage.setItem("cashquest-display-name", displayName.trim());
        router.push("/avatar");
      } else {
        // Email verification required — tell the user
        setServerError("Check your email for a verification link, then log in.");
        setIsLoading(false);
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { longMessage?: string; message?: string }[] };
      const msg =
        clerkError?.errors?.[0]?.longMessage ??
        clerkError?.errors?.[0]?.message ??
        "Something went wrong. Please try again.";
      setServerError(msg);
      setIsLoading(false);
    }
  }

  function handleGuest() {
    localStorage.setItem("cashquest-guest", "true");
    document.cookie = "cashquest-guest=true; path=/; max-age=31536000";
    router.push("/dashboard");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <Card className="overflow-hidden border-2 border-white/20 shadow-2xl">
        <CardHeader className="items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 pb-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-learn shadow-md">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-foreground">
            Start Your Quest!
          </CardTitle>
          <CardDescription className="text-base">
            Create an account to save your progress
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            {/* Display name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-name"
                className="text-sm font-bold text-foreground"
              >
                Display Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="CashHero42"
                  autoComplete="username"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10"
                />
              </div>
              {errors.displayName && (
                <p className="text-xs font-semibold text-destructive">
                  {errors.displayName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-email"
                className="text-sm font-bold text-foreground"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="player@cashquest.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-xs font-semibold text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-password"
                className="text-sm font-bold text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-semibold text-destructive">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-confirm"
                className="text-sm font-bold text-foreground"
              >
                Confirm Password
              </label>
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Type your password again"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs font-semibold text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Server error */}
            {serverError && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">
                {serverError}
              </p>
            )}

            {/* Signup button */}
            <Button type="submit" className="mt-2 w-full" disabled={isLoading || !isLoaded}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 animate-bounce" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Create Account
                </span>
              )}
            </Button>

            {/* Guest button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGuest}
            >
              <UserRound className="h-5 w-5" />
              Play as Guest
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center pb-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-primary underline-offset-4 hover:underline"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
