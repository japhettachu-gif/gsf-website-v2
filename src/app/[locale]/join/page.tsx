export const runtime = 'edge';

import { getLocale } from 'next-intl/server'
import { ApplicationForm } from '@/components/applications/ApplicationForm'

export const metadata = {
  title: 'Rejoindre la GSF Academy | Candidature',
  description: 'Soumettez votre candidature pour intégrer la Genius Soccer Foundation Academy.',
}

export default async function JoinPage() {
  const locale = await getLocale()
  const isFr = locale === 'fr'

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/10 text-green-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            {isFr ? 'Rejoindre la GSF' : 'Join GSF'}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {isFr ? "Candidature à l'Académie" : 'Academy Application'}
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            {isFr
              ? "Vous avez du talent et de l'ambition ? Rejoignez la Genius Soccer Foundation."
              : "Do you have talent and ambition? Join the Genius Soccer Foundation."}
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-14">
        {/* Info banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex gap-3">
          <span className="text-2xl">ℹ️</span>
          <div className="text-sm text-green-800">
            <p className="font-semibold mb-1">{isFr ? 'Comment ça fonctionne ?' : 'How does it work?'}</p>
            <ol className="list-decimal list-inside space-y-0.5 text-green-700">
              <li>{isFr ? 'Remplissez le formulaire (4 étapes)' : 'Fill the form (4 steps)'}</li>
              <li>{isFr ? 'Notre équipe examine votre dossier' : 'Our team reviews your application'}</li>
              <li>{isFr ? "Invitation à une session d'évaluation" : 'Invitation to an evaluation session'}</li>
              <li>{isFr ? 'Décision finale communiquée par email' : 'Final decision communicated by email'}</li>
            </ol>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <ApplicationForm type="academy" locale={locale} />
        </div>
      </section>
    </main>
  )
}
