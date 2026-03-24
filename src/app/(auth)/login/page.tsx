"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Coins, Mail, Lock, Sparkles, UserRound } from "lucide-react";
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    // Store email in localStorage and set guest cookie for middleware
    localStorage.setItem("cashquest-email", email);
    localStorage.removeItem("cashquest-guest");
    document.cookie = "cashquest-guest=true; path=/; max-age=31536000";
    router.push("/dashboard");
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
        <CardHeader className="items-center gap-2 bg-gradient-to-r from-teal-50 to-emerald-50 pb-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent shadow-md">
            <Coins className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-foreground">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-base">
            Log in to continue your quest
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-sm font-bold text-foreground"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="player@cashquest.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-password"
                className="text-sm font-bold text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Your secret password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Login button */}
            <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 animate-spin" />
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Log In
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
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
