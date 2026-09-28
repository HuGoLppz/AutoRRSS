import { Sparkles } from "lucide-react";
import { CONTENT_TYPES, GENERATION_COUNTS, PLATFORMS } from "../../models/idea";
import { useGeneration } from "../../store/GenerationContext";
import Button from "../ui/Button";
import Field from "../ui/Field";
import SegmentedControl from "../ui/SegmentedControl";

/** Formulario original de generación (mismos campos) + número de ideas. */
export default function GeneratorForm() {
  const { params, setParams, count, setCount, generate, status } = useGeneration();
  const loading = status === "loading";
  const set = (field) => (event) => setParams((p) => ({ ...p, [field]: event.target.value }));

  return (
    <form
      className="generator"
      onSubmit={(event) => {
        event.preventDefault();
        generate();
      }}
    >
      <Field label="Empresa">
        {(id) => <input id={id} type="text" placeholder="Ej. Gimnasio Fitness X" value={params.company} onChange={set("company")} required />}
      </Field>
      <Field label="Sector">
        {(id) => <input id={id} type="text" placeholder="Ej. Fitness" value={params.sector} onChange={set("sector")} required />}
      </Field>
      <Field label="Público objetivo">
        {(id) => <input id={id} type="text" placeholder="Ej. Jóvenes de 18 a 30 años" value={params.audience} onChange={set("audience")} required />}
      </Field>

      <div className="form-grid form-grid--2">
        <Field label="Red social">
          {(id) => (
            <select id={id} value={params.platform} onChange={set("platform")}>
              {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
            </select>
          )}
        </Field>
        <Field label="Tipo de contenido">
          {(id) => (
            <select id={id} value={params.contentType} onChange={set("contentType")}>
              {CONTENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          )}
        </Field>
      </div>

      <Field label="Cuántas ideas" hint={count > 1 ? "Generar varias ideas tarda más: cada una es una petición a Gemini." : undefined}>
        {() => (
          <SegmentedControl
            label="Número de ideas"
            value={count}
            onChange={setCount}
            options={GENERATION_COUNTS.map((n) => ({ value: n, label: String(n) }))}
          />
        )}
      </Field>

      <Button type="submit" variant="primary" icon={Sparkles} loading={loading} className="btn--block">
        {loading ? "Generando…" : count === 1 ? "Generar idea" : `Generar ${count} ideas`}
      </Button>
    </form>
  );
}
