import { useMemo, useState } from "react";
import { CONTENT_TYPES, PLATFORMS } from "../../models/idea";
import { useIdeas } from "../../store/IdeasContext";
import { collectFacet } from "../../utils/ideaQuery";
import Button from "../ui/Button";
import Field from "../ui/Field";
import PrioritySelector from "./PrioritySelector";
import StatusSelector from "./StatusSelector";
import TagSelector from "./TagSelector";

/* Valores de la idea ⇄ valores planos del formulario */
const toForm = (v) => ({
  title: v.title ?? "",
  description: v.description ?? "",
  category: v.category ?? "",
  platform: v.platform,
  contentType: v.contentType,
  status: v.status,
  priority: v.priority,
  tags: v.tags ?? [],
  notes: v.notes ?? "",
  publishDate: v.publishDate ?? "",
  hook: v.generated?.hook ?? "",
  script: v.generated?.script ?? "",
  caption: v.generated?.caption ?? "",
  hashtags: (v.generated?.hashtags ?? []).join(" "),
});

const fromForm = (f, base) => {
  const hashtags = f.hashtags.split(/[\s,]+/).filter(Boolean).map((h) => (h.startsWith("#") ? h : `#${h}`));
  const hasGenerated = f.hook.trim() || f.script.trim() || f.caption.trim() || hashtags.length;
  return {
    ...base,
    title: f.title,
    description: f.description,
    category: f.category,
    platform: f.platform,
    contentType: f.contentType,
    status: f.status,
    priority: f.priority,
    tags: f.tags,
    notes: f.notes,
    publishDate: f.publishDate || null,
    generated: hasGenerated ? { hook: f.hook, script: f.script, caption: f.caption, hashtags } : null,
  };
};

/**
 * Formulario de idea, reutilizado para: revisar borradores de Gemini,
 * crear una idea a mano y editar una idea guardada.
 * `onChange` (opcional) recibe los valores en cada cambio.
 */
export default function IdeaForm({
  initialValues, onSubmit, onChange, onCancel, submitLabel = "Guardar", saving = false, footerExtra,
}) {
  const { ideas } = useIdeas();
  const [form, setForm] = useState(() => toForm(initialValues));
  const [errors, setErrors] = useState({});

  const categories = useMemo(() => collectFacet(ideas, (i) => i.category).map((c) => c.value), [ideas]);
  const knownTags = useMemo(() => collectFacet(ideas, (i) => i.tags).map((t) => t.value), [ideas]);
  const hashtagSuggestions = (initialValues.generated?.hashtags ?? []).map((h) => h.replace(/^#/, ""));
  const suggestions = [...hashtagSuggestions, ...knownTags];

  const set = (field, value) => {
    const next = { ...form, [field]: value };
    setForm(next);
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
    onChange?.(fromForm(next, initialValues));
  };

  const submit = (event) => {
    event.preventDefault();
    const found = {};
    if (!form.title.trim()) found.title = "Escribe un título para reconocer la idea.";
    if (!form.description.trim()) found.description = "Describe brevemente de qué trata.";
    setErrors(found);
    if (Object.keys(found).length) return;
    onSubmit(fromForm(form, initialValues));
  };

  const needsDate = form.status === "scheduled" && !form.publishDate;

  return (
    <form className="idea-form" onSubmit={submit} noValidate>
      <Field label="Título" error={errors.title}>
        {(id) => <input id={id} value={form.title} onChange={(e) => set("title", e.target.value)} maxLength={140} />}
      </Field>

      <Field label="Descripción" error={errors.description}>
        {(id) => <textarea id={id} rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />}
      </Field>

      <div className="form-grid">
        <Field label="Red social">
          {(id) => (
            <select id={id} value={form.platform} onChange={(e) => set("platform", e.target.value)}>
              {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
            </select>
          )}
        </Field>
        <Field label="Tipo de contenido">
          {(id) => (
            <select id={id} value={form.contentType} onChange={(e) => set("contentType", e.target.value)}>
              {CONTENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          )}
        </Field>
        <Field label="Categoría">
          {(id) => (
            <>
              <input id={id} list={`${id}-cats`} value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Ej. Fitness" />
              <datalist id={`${id}-cats`}>{categories.map((c) => <option key={c} value={c} />)}</datalist>
            </>
          )}
        </Field>
      </div>

      <div className="form-grid">
        <Field label="Estado">
          {(id) => <StatusSelector id={id} variant="select" value={form.status} onChange={(v) => set("status", v)} />}
        </Field>
        <Field label="Fecha prevista de publicación" hint={needsDate ? "Añade una fecha para verla en el calendario." : undefined}>
          {(id) => (
            <div className="date-field">
              <input id={id} type="date" value={form.publishDate} onChange={(e) => set("publishDate", e.target.value)} />
              {form.publishDate && <Button size="sm" variant="ghost" onClick={() => set("publishDate", "")}>Quitar</Button>}
            </div>
          )}
        </Field>
        <Field label="Prioridad">
          {() => <PrioritySelector value={form.priority} onChange={(v) => set("priority", v)} />}
        </Field>
      </div>

      <Field label="Etiquetas">
        {() => <TagSelector value={form.tags} onChange={(v) => set("tags", v)} suggestions={suggestions} />}
      </Field>

      <Field label="Notas">
        {(id) => <textarea id={id} rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Ideas de grabación, referencias, pendientes…" />}
      </Field>

      <details className="disclosure" open={Boolean(initialValues.generated)}>
        <summary>Contenido generado</summary>
        <div className="disclosure__body">
          <Field label="Hook">{(id) => <textarea id={id} rows={2} value={form.hook} onChange={(e) => set("hook", e.target.value)} />}</Field>
          <Field label="Guion">{(id) => <textarea id={id} rows={5} value={form.script} onChange={(e) => set("script", e.target.value)} />}</Field>
          <Field label="Caption">{(id) => <textarea id={id} rows={3} value={form.caption} onChange={(e) => set("caption", e.target.value)} />}</Field>
          <Field label="Hashtags" hint="Sepáralos con espacios.">{(id) => <input id={id} value={form.hashtags} onChange={(e) => set("hashtags", e.target.value)} />}</Field>
        </div>
      </details>

      <div className="form-actions">
        {footerExtra}
        {onCancel && <Button onClick={onCancel} disabled={saving}>Cancelar</Button>}
        <Button type="submit" variant="primary" loading={saving}>{saving ? "Guardando" : submitLabel}</Button>
      </div>
    </form>
  );
}
