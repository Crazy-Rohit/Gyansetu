// src/components/FunFactsSlideViewer.jsx
//
// A PowerPoint-style slide viewer: a thumbnail rail on the left lists every
// card in the week, and clicking one shows it large on the right — with a
// soft glowing, gently floating "magic" treatment on the active slide.
import { useCallback, useEffect, useState } from "react";
import { renderFactBody } from "../utils/factMarkdown";
import FeatureIcon from "./FeatureIcon";

export default function FunFactsSlideViewer({ facts }) {
  const [index, setIndex] = useState(0);
  const total = facts.length;

  const goTo = useCallback(
    (next) => {
      setIndex(((next % total) + total) % total);
    },
    [total]
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  if (total === 0) return null;

  const fact = facts[index];
  const tone = index % 2 === 0 ? "a" : "b";

  return (
    <div className="fun-facts-viewer">
      <nav className="fun-facts-viewer__rail" aria-label="Slides">
        {facts.map((f, i) => {
          const thumbTone = i % 2 === 0 ? "a" : "b";
          return (
            <button
              type="button"
              key={f.id}
              className={`fun-facts-viewer__thumb fun-facts-viewer__thumb--${thumbTone} ${
                i === index ? "is-active" : ""
              }`}
              onClick={() => goTo(i)}
              aria-current={i === index}
            >
              <span className="fun-facts-viewer__thumb-number">{i + 1}</span>
              <span className="fun-facts-viewer__thumb-icon">
                <FeatureIcon name={f.icon} />
              </span>
              <span className="fun-facts-viewer__thumb-label">{f.cardLabel}</span>
            </button>
          );
        })}
      </nav>

      <div className="fun-facts-viewer__stage">
        <button
          type="button"
          className="fun-facts-viewer__arrow fun-facts-viewer__arrow--prev"
          onClick={goPrev}
          aria-label="Previous slide"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        <div className="fun-facts-viewer__slide-wrap">
          <div className={`fun-facts-viewer__slide fun-facts-viewer__slide--${tone}`}>
            <span className="fun-facts-viewer__sparkle material-symbols-outlined" aria-hidden="true">
              auto_awesome
            </span>

            <div className="fun-facts-viewer__slide-header">
              <div className="fun-fact-card__icon">
                <FeatureIcon name={fact.icon} />
              </div>
              <div>
                <span className="fun-facts-viewer__slide-eyebrow">Fact {index + 1}</span>
                <h2 className="fun-fact-card__breadcrumb">{fact.cardLabel}</h2>
              </div>
            </div>

            <div className="fun-facts-viewer__slide-divider" />

            <div className="fun-fact-card__body">{renderFactBody(fact.body)}</div>

            <div className="fun-facts-viewer__slide-footer">
              Week {fact.week} · {fact.weekTitle}
            </div>
          </div>

          <div className="fun-facts-viewer__status">
            Fact {index + 1} of {total}
          </div>
        </div>

        <button
          type="button"
          className="fun-facts-viewer__arrow fun-facts-viewer__arrow--next"
          onClick={goNext}
          aria-label="Next slide"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
