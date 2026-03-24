"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Rocket,
  User,
  Mail,
  Lock,
  ShieldCheck,
  UserRound,
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
  const [displayName, setDisplayName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [errors, setErrors] = React.useState<FormErrors>({});
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

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    // Store in localStorage and redirect to avatar creation (no Supabase yet)
    localStorage.setItem("cashquest-email", email);
    localStorage.setItem("cashquest-display-name", displayName.trim());
    localStorage.removeItem("cashquest-guest");
    document.cookie = "cashquest-guest=true; path=/; max-age=31536000";
    router.push("/avatar");
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
                  type="password"
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
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
                  type="password"
                  placeholder="Type your password again"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs font-semibold text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Signup button */}
            <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
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
