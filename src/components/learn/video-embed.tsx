"use client";

import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonVideo } from "@/types/game";

interface VideoEmbedProps {
  video: LessonVideo;
  className?: string;
}

export function VideoEmbed({ video, className }: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="overflow-hidden rounded-xl border-2 border-border">
        {!loaded ? (
          <button
            onClick={() => setLoaded(true)}
            className="relative w-full group"
            aria-label={`Play video: ${video.title}`}
          >
            <img
              src={thumbnailUrl}
              alt={video.title}
              className="w-full object-cover aspect-video"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
                <Play className="h-6 w-6 fill-white" />
              </div>
            </div>
          </button>
        ) : (
          <iframe
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full aspect-video"
          />
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-foreground">{video.title}</p>
          <p className="text-xs text-muted-foreground">
            {video.channelName} · {video.durationMinutes} min
          </p>
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
          aria-label="Open in YouTube"
        >
          <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </a>
      </div>
      <p className="text-[10px] font-mono text-muted-foreground/60">
        📚 {video.ceeStandard}
      </p>
    </div>
  );
}
