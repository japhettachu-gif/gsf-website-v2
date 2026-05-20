import { cn } from "@/lib/utils";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

// ─── PageLayout ────────────────────────────────────────────────────────────────
export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}

// ─── PageHero ─────────────────────────────────────────────────────────────────
interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  centered?: boolean;
  size?: "sm" | "md" | "lg";
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  centered = true,
  size = "md",
}: PageHeroProps) {
  const paddingMap = { sm: "py-12 md:py-16", md: "py-16 md:py-20", lg: "py-20 md:py-28" };

  return (
    <section className="relative overflow-hidden bg-[#0A1A0F] text-white">
      {image && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
            aria-hidden
          />
          <div className="absolute inset-0 gsf-hero-overlay" aria-hidden />
        </>
      )}
      {!image && (
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #1A7C4F 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C9A84C 0%, transparent 40%)",
          }}
          aria-hidden
        />
      )}
      <div className={cn("container-gsf relative", paddingMap[size], centered && "text-center")}>
        {eyebrow && (
          <p className="inline-block text-xs uppercase tracking-[0.25em] text-gold font-bold border border-gold/40 px-3 py-1.5 rounded-full mb-4">
            {eyebrow}
          </p>
        )}
        <h1 className={cn(
          "font-display font-bold leading-tight tracking-tight text-white",
          size === "lg" ? "text-4xl md:text-5xl lg:text-6xl" : "text-3xl md:text-4xl lg:text-5xl"
        )}>
          {title}
        </h1>
        {subtitle && (
          <p className={cn(
            "mt-4 text-base md:text-lg text-white/70 font-serif leading-relaxed",
            centered && "max-w-2xl mx-auto"
          )}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
interface SectionProps {
  children: React.ReactNode;
  bg?: "default" | "muted" | "dark";
  className?: string;
  id?: string;
  size?: "sm" | "md" | "lg";
}

export function Section({
  children,
  bg = "default",
  className,
  id,
  size = "md",
}: SectionProps) {
  const paddingMap = { sm: "py-10 md:py-12", md: "py-14 md:py-20", lg: "py-20 md:py-28" };
  return (
    <section
      id={id}
      className={cn(
        paddingMap[size],
        bg === "muted" && "bg-muted",
        bg === "dark" && "bg-[#0A1A0F] text-white",
        className
      )}
    >
      <div className="container-gsf">{children}</div>
    </section>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  action?: React.ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  action,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-10", centered && "text-center")}>
      {eyebrow && (
        <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">
          {eyebrow}
        </p>
      )}
      <div className={cn("flex flex-wrap items-end justify-between gap-4", centered && "justify-center")}>
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-muted-foreground max-w-xl">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
