import IdeaCard from "./IdeaCard";

export default function IdeaList({ ideas, view = "grid" }) {
  return (
    <div className={`idea-list idea-list--${view}`}>
      {ideas.map((idea) => <IdeaCard key={idea.id} idea={idea} layout={view} />)}
    </div>
  );
}
