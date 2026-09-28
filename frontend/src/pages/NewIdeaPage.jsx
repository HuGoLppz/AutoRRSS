import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import IdeaForm from "../components/ideas/IdeaForm";
import { emptyIdeaValues } from "../models/idea";
import { useIdeas } from "../store/IdeasContext";

/** Alta manual de una idea (sin pasar por Gemini). */
export default function NewIdeaPage() {
  const navigate = useNavigate();
  const { createIdea, isPending } = useIdeas();

  const submit = async (values) => {
    const idea = await createIdea(values);
    if (idea) navigate(`/ideas/${idea.id}`);
  };

  return (
    <div className="page page--narrow">
      <Link to="/ideas" className="back-link"><ArrowLeft size={16} aria-hidden /> Mis ideas</Link>
      <header className="page__header"><h1>Nueva idea</h1></header>
      <section className="panel">
        <IdeaForm
          initialValues={emptyIdeaValues()}
          onSubmit={submit}
          onCancel={() => navigate("/ideas")}
          submitLabel="Guardar idea"
          saving={Boolean(isPending("new"))}
        />
      </section>
    </div>
  );
}
