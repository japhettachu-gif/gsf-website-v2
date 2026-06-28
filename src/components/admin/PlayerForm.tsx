"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Field, SelectField, TextareaField } from "@/components/gsf/FormFields";
import { Loader2, Upload, X } from "lucide-react";
import type { Player } from "@/types";

interface PlayerFormProps {
  player?: Partial<Player>;
  mode: "create" | "edit";
}

const CATEGORY_OPTIONS = [
  { value: "U10_U12", label: "U10–U12 — Initiation" },
  { value: "U13_U15", label: "U13–U15 — Développement" },
  { value: "U16_U18", label: "U16–U18 — Élite" },
];

const POSITION_OPTIONS = [
  { value: "GK", label: "Gardien (GK)" },
  { value: "DEF", label: "Défenseur (DEF)" },
  { value: "MID", label: "Milieu (MID)" },
  { value: "FWD", label: "Attaquant (FWD)" },
];

const FOOT_OPTIONS = [
  { value: "right", label: "Droit" },
  { value: "left", label: "Gauche" },
  { value: "both", label: "Ambidextre" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Actif" },
  { value: "inactive", label: "Inactif" },
  { value: "on_loan", label: "Prêté" },
  { value: "alumni", label: "Alumni" },
];

export function PlayerForm({ player, mode }: PlayerFormProps) {
  const locale = useLocale();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(player?.photo_url ?? null);

  const [form, setForm] = useState({
    first_name: player?.first_name ?? "",
    last_name: player?.last_name ?? "",
    birth_date: player?.birth_date ?? "",
    category: player?.category ?? "U13_U15",
    position: player?.position ?? "MID",
    city: player?.city ?? "",
    nationality: player?.nationality ?? "Camerounaise",
    height_cm: player?.height_cm?.toString() ?? "",
    weight_kg: player?.weight_kg?.toString() ?? "",
    strong_foot: player?.strong_foot ?? "right",
    bio_fr: player?.bio_fr ?? "",
    bio_en: player?.bio_en ?? "",
    status: player?.status ?? "active",
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const uploadPhoto = async (playerId: string): Promise<string | null> => {
    if (!photoFile) return player?.photo_url ?? null;
    const ext = photoFile.name.split(".").pop();
    const path = `players/${playerId}.${ext}`;
    const { error } = await supabase.storage
      .from("photos")
      .upload(path, photoFile, { upsert: true });
    if (error) return null;
    const { data } = supabase.storage.from("photos").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...form,
        height_cm: form.height_cm ? parseInt(form.height_cm) : null,
        weight_kg: form.weight_kg ? parseInt(form.weight_kg) : null,
      };

      if (mode === "create") {
        const { data, error } = await supabase
          .from("players")
          .insert(payload as any)
          .select("id")
          .single() as unknown as { data: any | null, error: any | null };
        if (error) throw error;
        const photoUrl = await uploadPhoto(data.id);
        if (photoUrl) {
          await supabase.from("players").update({ photo_url: photoUrl }).eq("id", data.id);
        }
        router.push(`/${locale}/admin/players`);
      } else if (player?.id) {
        const photoUrl = await uploadPhoto(player.id);
        const { error } = await supabase
          .from("players")
          .update({ ...payload, photo_url: photoUrl } as any)
          .eq("id", player.id);
        if (error) throw error;
        router.push(`/${locale}/admin/players`);
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl bg-destructive/8 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Photo */}
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="font-display font-bold text-foreground mb-4">Photo du joueur</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            {photoPreview ? (
              <div className="relative">
                <img src={photoPreview} alt="Preview" className="h-24 w-24 rounded-full object-cover border-2 border-primary/20" />
                <button
                  type="button"
                  onClick={() => { setPhotoPreview(null); setPhotoFile(null); }}
                  className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="h-24 w-24 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-accent transition-colors">
              <Upload className="h-4 w-4" />
              {photoPreview ? "Changer la photo" : "Ajouter une photo"}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
            <p className="text-xs text-muted-foreground mt-1.5">JPG, PNG — max 2 MB</p>
          </div>
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="font-display font-bold text-foreground mb-5">Informations personnelles</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Prénom" value={form.first_name} onChange={set("first_name")} required />
          <Field label="Nom" value={form.last_name} onChange={set("last_name")} required />
          <Field label="Date de naissance" type="date" value={form.birth_date} onChange={set("birth_date")} required />
          <Field label="Ville" value={form.city} onChange={set("city")} required />
          <Field label="Nationalité" value={form.nationality} onChange={set("nationality")} required />
        </div>
      </div>

      {/* Informations sportives */}
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="font-display font-bold text-foreground mb-5">Informations sportives</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <SelectField label="Catégorie" value={form.category} onChange={set("category")} options={CATEGORY_OPTIONS} required />
          <SelectField label="Poste" value={form.position} onChange={set("position")} options={POSITION_OPTIONS} required />
          <SelectField label="Pied fort" value={form.strong_foot} onChange={set("strong_foot")} options={FOOT_OPTIONS} />
          <SelectField label="Statut" value={form.status} onChange={set("status")} options={STATUS_OPTIONS} required />
          <Field label="Taille (cm)" type="number" value={form.height_cm} onChange={set("height_cm")} placeholder="Ex: 175" />
          <Field label="Poids (kg)" type="number" value={form.weight_kg} onChange={set("weight_kg")} placeholder="Ex: 68" />
        </div>
      </div>

      {/* Biographies */}
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="font-display font-bold text-foreground mb-5">Biographie</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextareaField label="Biographie (FR)" value={form.bio_fr} onChange={set("bio_fr")} placeholder="Description du joueur en français..." />
          <TextareaField label="Biography (EN)" value={form.bio_en} onChange={set("bio_en")} placeholder="Player description in English..." />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-accent transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-elegant hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "create" ? "Créer le joueur" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
