export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="topbar">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p className="subtitle">{description}</p>
      </div>
      {action && <div className="actions">{action}</div>}
    </div>
  );
}
