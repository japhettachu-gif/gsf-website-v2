import { cn, getInitials } from "@/lib/utils";

// ─── PartnerLogo ──────────────────────────────────────────────────────────────
interface PartnerLogoProps {
  name: string;
  logo?: string | null;
  className?: string;
}

export function PartnerLogo({ name, logo, className }: PartnerLogoProps) {
  return (
    <div className={cn(
      "flex items-center justify-center rounded-xl border border-border bg-card px-4 py-5",
      "hover:border-primary hover:shadow-elegant transition-all group",
      className
    )}>
      {logo ? (
        <img
          src={logo}
          alt={name}
          className="max-h-10 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all"
        />
      ) : (
        <p className="text-xs font-bold text-center text-muted-foreground group-hover:text-primary transition-colors leading-tight">
          {name}
        </p>
      )}
    </div>
  );
}

// ─── PlayerAvatar ─────────────────────────────────────────────────────────────
const SIZE_MAP = {
  sm:  { wrapper: "h-10 w-10",  text: "text-xs",  img: "h-10 w-10"  },
  md:  { wrapper: "h-14 w-14",  text: "text-sm",  img: "h-14 w-14"  },
  lg:  { wrapper: "h-20 w-20",  text: "text-lg",  img: "h-20 w-20"  },
  xl:  { wrapper: "h-28 w-28",  text: "text-2xl", img: "h-28 w-28"  },
};

const AVATAR_COLORS = [
  "bg-primary/15 text-primary",
  "bg-gold/20 text-amber-700",
  "bg-blue-500/15 text-blue-700",
  "bg-emerald-500/15 text-emerald-700",
  "bg-violet-500/15 text-violet-700",
  "bg-orange-500/15 text-orange-700",
];

function nameToColor(name: string): string {
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

interface PlayerAvatarProps {
  name: string;
  photo?: string | null;
  size?: keyof typeof SIZE_MAP;
  className?: string;
}

export function PlayerAvatar({ name, photo, size = "md", className }: PlayerAvatarProps) {
  const s = SIZE_MAP[size];
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={cn("rounded-full object-cover shrink-0", s.img, className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center shrink-0 font-bold",
        s.wrapper, s.text, nameToColor(name), className
      )}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}
