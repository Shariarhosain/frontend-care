export default function EmptyState({ title, text, children }) {
  return (
    <div className="empty">
      <div className="empty-icon">✦</div>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}
