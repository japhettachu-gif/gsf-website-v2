'use client'

import { useState } from 'react'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import type { ApplicationType, PlayerPosition, StrongFoot } from '@/types/applications'
import { POSITION_LABELS, STRONG_FOOT_LABELS } from '@/types/applications'
import { submitApplication } from '@/lib/applications'

interface ApplicationFormProps {
  type: ApplicationType
  eventId?: string
  locale: string
}

export function ApplicationForm({ type, eventId, locale }: ApplicationFormProps) {
  const isFr = locale === 'fr'
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    first_name: '', last_name: '', birth_date: '',
    position: 'MID' as PlayerPosition, strong_foot: 'right' as StrongFoot,
    city: '', country: 'Cameroun', nationality: '',
    height_cm: '', weight_kg: '',
    parent_name: '', parent_email: '', parent_phone: '', parent_relationship: '',
    current_club: '', years_playing: '', experience: '', previous_academies: '',
    message: '', how_did_you_hear: '',
  })

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true); setError(null)
    try {
      await submitApplication({
        type, event_id: eventId ?? null,
        first_name: form.first_name, last_name: form.last_name,
        birth_date: form.birth_date, position: form.position,
        strong_foot: form.strong_foot, city: form.city,
        country: form.country, nationality: form.nationality || null,
        height_cm: form.height_cm ? parseInt(form.height_cm) : null,
        weight_kg: form.weight_kg ? parseInt(form.weight_kg) : null,
        parent_name: form.parent_name, parent_email: form.parent_email,
        parent_phone: form.parent_phone, parent_relationship: form.parent_relationship || null,
        current_club: form.current_club || null,
        years_playing: form.years_playing ? parseInt(form.years_playing) : null,
        experience: form.experience || null,
        previous_academies: form.previous_academies || null,
        message: form.message || null,
        how_did_you_hear: form.how_did_you_hear || null,
      })
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : (isFr ? 'Une erreur est survenue.' : 'An error occurred.'))
    } finally { setSubmitting(false) }
  }

  const input = "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-white"
  const label = "block text-sm font-medium text-gray-700 mb-1"
  const required = <span className="text-red-500 ml-0.5">*</span>

  if (submitted) {
    return (
      <div className="text-center py-16 px-4">
        <CheckCircle size={56} className="mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isFr ? 'Candidature reçue !' : 'Application received!'}
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          {isFr
            ? `Merci ${form.first_name}. Nous avons bien reçu votre candidature et vous recontacterons à l'adresse ${form.parent_email} dans les plus brefs délais.`
            : `Thank you ${form.first_name}. We have received your application and will contact you at ${form.parent_email} shortly.`}
        </p>
      </div>
    )
  }

  const steps = [
    isFr ? 'Joueur' : 'Player',
    isFr ? 'Parent' : 'Parent',
    isFr ? 'Expérience' : 'Experience',
    isFr ? 'Motivation' : 'Motivation',
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <button type="button" onClick={() => i < step - 1 && setStep(i + 1)}
              className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition ${
                step === i + 1 ? 'bg-green-600 text-white' :
                step > i + 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
              }`}>
              {i + 1}
            </button>
            <span className={`text-xs hidden sm:block ${step === i + 1 ? 'text-green-700 font-semibold' : 'text-gray-400'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-px w-8 ${step > i + 1 ? 'bg-green-300' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />{error}
        </div>
      )}

      {/* Step 1 — Player */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={label}>{isFr ? 'Prénom' : 'First name'}{required}</label>
            <input required value={form.first_name} onChange={e => set('first_name', e.target.value)} className={input} /></div>
          <div><label className={label}>{isFr ? 'Nom' : 'Last name'}{required}</label>
            <input required value={form.last_name} onChange={e => set('last_name', e.target.value)} className={input} /></div>
          <div><label className={label}>{isFr ? 'Date de naissance' : 'Date of birth'}{required}</label>
            <input required type="date" value={form.birth_date} onChange={e => set('birth_date', e.target.value)} className={input} /></div>
          <div><label className={label}>{isFr ? 'Poste' : 'Position'}{required}</label>
            <select required value={form.position} onChange={e => set('position', e.target.value)} className={input}>
              {(Object.entries(POSITION_LABELS) as [PlayerPosition, {fr:string;en:string}][]).map(([k,v]) => (
                <option key={k} value={k}>{isFr ? v.fr : v.en}</option>
              ))}
            </select></div>
          <div><label className={label}>{isFr ? 'Pied fort' : 'Strong foot'}</label>
            <select value={form.strong_foot} onChange={e => set('strong_foot', e.target.value)} className={input}>
              {(Object.entries(STRONG_FOOT_LABELS) as [StrongFoot, {fr:string}][]).map(([k,v]) => (
                <option key={k} value={k}>{v.fr}</option>
              ))}
            </select></div>
          <div><label className={label}>{isFr ? 'Ville' : 'City'}{required}</label>
            <input required value={form.city} onChange={e => set('city', e.target.value)} className={input} /></div>
          <div><label className={label}>{isFr ? 'Pays' : 'Country'}{required}</label>
            <input required value={form.country} onChange={e => set('country', e.target.value)} className={input} /></div>
          <div><label className={label}>{isFr ? 'Nationalité' : 'Nationality'}</label>
            <input value={form.nationality} onChange={e => set('nationality', e.target.value)} className={input} /></div>
          <div><label className={label}>{isFr ? 'Taille (cm)' : 'Height (cm)'}</label>
            <input type="number" min="100" max="220" value={form.height_cm} onChange={e => set('height_cm', e.target.value)} className={input} /></div>
          <div><label className={label}>{isFr ? 'Poids (kg)' : 'Weight (kg)'}</label>
            <input type="number" min="20" max="120" value={form.weight_kg} onChange={e => set('weight_kg', e.target.value)} className={input} /></div>
        </div>
      )}

      {/* Step 2 — Parent */}
      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><label className={label}>{isFr ? 'Nom complet du parent/tuteur' : 'Parent/guardian full name'}{required}</label>
            <input required value={form.parent_name} onChange={e => set('parent_name', e.target.value)} className={input} /></div>
          <div><label className={label}>{isFr ? 'Email parent' : 'Parent email'}{required}</label>
            <input required type="email" value={form.parent_email} onChange={e => set('parent_email', e.target.value)} className={input} /></div>
          <div><label className={label}>{isFr ? 'Téléphone parent' : 'Parent phone'}{required}</label>
            <input required value={form.parent_phone} onChange={e => set('parent_phone', e.target.value)} className={input} placeholder="+237 6XX XXX XXX" /></div>
          <div><label className={label}>{isFr ? 'Lien de parenté' : 'Relationship'}</label>
            <select value={form.parent_relationship} onChange={e => set('parent_relationship', e.target.value)} className={input}>
              <option value="">{isFr ? '— Sélectionner —' : '— Select —'}</option>
              <option value="father">{isFr ? 'Père' : 'Father'}</option>
              <option value="mother">{isFr ? 'Mère' : 'Mother'}</option>
              <option value="guardian">{isFr ? 'Tuteur/Tutrice' : 'Guardian'}</option>
              <option value="other">{isFr ? 'Autre' : 'Other'}</option>
            </select></div>
        </div>
      )}

      {/* Step 3 — Experience */}
      {step === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={label}>{isFr ? 'Club actuel' : 'Current club'}</label>
            <input value={form.current_club} onChange={e => set('current_club', e.target.value)} className={input} /></div>
          <div><label className={label}>{isFr ? 'Années de pratique' : 'Years playing'}</label>
            <input type="number" min="0" max="20" value={form.years_playing} onChange={e => set('years_playing', e.target.value)} className={input} /></div>
          <div className="md:col-span-2"><label className={label}>{isFr ? 'Académies précédentes' : 'Previous academies'}</label>
            <input value={form.previous_academies} onChange={e => set('previous_academies', e.target.value)} className={input} /></div>
          <div className="md:col-span-2"><label className={label}>{isFr ? 'Décrivez votre parcours sportif' : 'Describe your sporting background'}</label>
            <textarea rows={4} value={form.experience} onChange={e => set('experience', e.target.value)} className={input} /></div>
        </div>
      )}

      {/* Step 4 — Motivation */}
      {step === 4 && (
        <div className="space-y-4">
          <div><label className={label}>{isFr ? 'Lettre de motivation' : 'Motivation letter'}</label>
            <textarea rows={5} value={form.message} onChange={e => set('message', e.target.value)} className={input}
              placeholder={isFr ? 'Pourquoi souhaitez-vous rejoindre la GSF Academy ?' : 'Why do you want to join GSF Academy?'} /></div>
          <div><label className={label}>{isFr ? 'Comment avez-vous entendu parler de nous ?' : 'How did you hear about us?'}</label>
            <select value={form.how_did_you_hear} onChange={e => set('how_did_you_hear', e.target.value)} className={input}>
              <option value="">— {isFr ? 'Sélectionner' : 'Select'} —</option>
              <option value="social_media">{isFr ? 'Réseaux sociaux' : 'Social media'}</option>
              <option value="friend">{isFr ? 'Ami/Famille' : 'Friend/Family'}</option>
              <option value="school">{isFr ? 'École' : 'School'}</option>
              <option value="event">{isFr ? 'Événement GSF' : 'GSF Event'}</option>
              <option value="other">{isFr ? 'Autre' : 'Other'}</option>
            </select></div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        {step > 1 ? (
          <button type="button" onClick={() => setStep(s => s - 1)} className="px-5 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            ← {isFr ? 'Précédent' : 'Previous'}
          </button>
        ) : <div />}

        {step < 4 ? (
          <button type="button" onClick={() => setStep(s => s + 1)} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow transition">
            {isFr ? 'Suivant' : 'Next'} →
          </button>
        ) : (
          <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow transition disabled:opacity-50">
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            {submitting ? (isFr ? 'Envoi...' : 'Submitting...') : (isFr ? 'Soumettre ma candidature' : 'Submit application')}
          </button>
        )}
      </div>
    </form>
  )
}
