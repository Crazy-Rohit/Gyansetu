// client/src/components/ComingSoon.jsx
import "../styles/quiz.css";

export default function ComingSoon({ title = "Coming Soon", text, cta, icon = "rocket_launch" }) {
  return (
    <div className="coming-soon">
      <span className="coming-soon__icon material-symbols-outlined">{icon}</span>
      <h2 className="coming-soon__title">{title}</h2>
      {text && <p className="coming-soon__text">{text}</p>}
      {cta && <div className="coming-soon__cta">{cta}</div>}
    </div>
  );
}
