import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { MapPin, Mail, Phone, Youtube, Instagram, Facebook } from "lucide-react";

const QUICK_LINKS = [
  { key: "about", href: "/about" },
  { key: "programmes", href: "/programmes" },
  { key: "players", href: "/players" },
  { key: "alumni", href: "/alumni" },
  { key: "competitions", href: "/competitions" },
  { key: "media", href: "/media" },
  { key: "partners", href: "/partners" },
] as const;

const SOCIAL = [
  { label: "YouTube", href: "https://www.youtube.com/@geniussoccerfoundation-bt9rd", Icon: Youtube },
  { label: "Instagram", href: "https://www.instagram.com/geniussoccerfoundation", Icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com/genius.soccer.foundation", Icon: Facebook },
];

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0A1A0F] text-white/75">
      {/* Bande top */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary via-gold to-primary" />

      <div className="container-gsf py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">

          {/* Colonne 1 — Identité */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-display font-bold text-xs shrink-0">
                GSF
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm tracking-wide">
                  Genius Soccer Foundation
                </p>
                <p className="text-xs text-gold font-semibold">
                  Building Careers. Building Lives.
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed font-serif">
              {t("footer.description")}
            </p>
            <div className="flex gap-3 mt-6">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-primary transition-colors text-white/60 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Colonne 2 — Liens rapides */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gold font-bold mb-5">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={`/${locale}${href}`}
                    className="text-sm hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 — Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gold font-bold mb-5">
              {t("footer.contactUs")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{t("contact.addressValue")}</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+237699000000" className="hover:text-white transition-colors">
                  +237 6 99 00 00 00
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a
                  href="mailto:contact@geniussoccerfoundation.org"
                  className="hover:text-white transition-colors break-all"
                >
                  contact@geniussoccerfoundation.org
                </a>
              </li>
            </ul>
            <Link
              href={`/${locale}/join`}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-gold text-[#0D0D0D] px-5 py-2.5 text-sm font-bold hover:bg-gold-light transition-colors shadow-gold"
            >
              {t("nav.join")} →
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
          <p>© {year} Genius Soccer Foundation. {t("footer.rights")}</p>
          <p className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            {t("footer.location")}
          </p>
        </div>
      </div>
    </footer>
  );
}
