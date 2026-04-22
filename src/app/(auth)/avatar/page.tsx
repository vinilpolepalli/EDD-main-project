"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Upload, User, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AvatarPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [preview, setPreview] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }
    setError(null);
    setPreview(URL.createObjectURL(file));
  }

  async function handleUpload() {
    const file = inputRef.current?.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setError(null);
    try {
      await user.setProfileImage({ file });
      router.push("/dashboard");
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleSkip() {
    router.push("/dashboard");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-extrabold text-white drop-shadow-md sm:text-3xl">
          Add a Profile Picture
        </h1>
        <p className="text-sm font-medium text-white/80">
          Put a face to your CashQuest name — or skip and use your initials.
        </p>
      </div>

      <Card className="w-full overflow-hidden border-2 border-white/20 shadow-2xl">
        <CardContent className="flex flex-col items-center gap-6 p-6">
          {/* Avatar preview / upload zone */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "group relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-dashed border-primary/40 bg-primary/5 transition-colors hover:border-primary hover:bg-primary/10",
              preview && "border-solid border-primary"
            )}
            aria-label="Choose profile picture"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary">
                <User className="h-12 w-12" />
                <span className="text-xs font-semibold">Click to choose</span>
              </div>
            )}

            {preview && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Upload className="h-8 w-8 text-white" />
              </div>
            )}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />

          {error && (
            <p className="text-sm font-semibold text-red-500">{error}</p>
          )}

          <p className="text-xs text-muted-foreground">
            PNG, JPG, WEBP or GIF · Max 5 MB
          </p>

          <div className="flex w-full flex-col gap-3">
            <Button
              type="button"
              size="lg"
              className="w-full"
              disabled={!preview || uploading || !isLoaded}
              onClick={handleUpload}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading ? "Uploading…" : "Save & Start Playing"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="w-full text-muted-foreground"
              onClick={handleSkip}
              disabled={uploading}
            >
              Skip for now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
