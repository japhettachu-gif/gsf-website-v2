import { getLocale } from 'next-intl/server'
import { getPublicPartners } from '@/lib/partners'
import { TIER_CONFIG } from '@/types/partners'
import type { PartnerTier } from '@/types/partners'
import { ExternalLink } from 'lucide-react'

export const metadata = { title: 'Partenaires | GSF Academy' }

export default async function PartnersPage() {
  const locale = await getLocale()
  const partners = await getPublicPartners().catch(() => [])
  const isFr = locale === 'fr'

  const tiers: PartnerTier[] = ['title', 'official', 'supporter']
  const tierLabels = { title: isFr ? 'Partenaire Titre' : 'Title Partner', official: isFr ? 'Partenaires Officiels' : 'Official Partners', supporter: isFr ? 'Partenaires Soutien' : 'Supporters' }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{isFr ? 'Nos Partenaires' : 'Our Partners'}</h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            {isFr ? 'Merci à ceux qui croient en notre mission.' : 'Thank you to those who believe in our mission.'}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-14 space-y-14">
        {tiers.map(tier => {
          const tierPartners = partners.filter(p => p.tier === tier)
          if (!tierPartners.length) return null
          const config = TIER_CONFIG[tier]
          return (
            <section key={tier}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: config.bg, color: config.color }}>
                  {tierLabels[tier]}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className={`grid gap-6 ${tier === 'title' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                {tierPartners.map(partner => (
                  <div key={partner.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                    {partner.logo_url ? (
                      <img src={partner.logo_url} alt={partner.name} className="h-16 object-contain mb-4" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl mb-4 font-bold" style={{ backgroundColor: config.bg, color: config.color }}>
                        {partner.name[0]}
                      </div>
                    )}
                    <h3 className="font-bold text-gray-900 mb-1">{partner.name}</h3>
                    {(isFr ? partner.description_fr : partner.description_en) && (
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                        {isFr ? partner.description_fr : partner.description_en}
                      </p>
                    )}
                    {partner.website && (
                      <a href={partner.website} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium hover:underline" style={{ color: config.color }}>
                        <ExternalLink size={11} />Site web
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        })}
        {partners.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🤝</p>
            <p>{isFr ? 'Aucun partenaire pour l\'instant.' : 'No partners yet.'}</p>
          </div>
        )}
      </div>
    </main>
  )
}
