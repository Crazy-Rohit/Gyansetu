// src/utils/factMarkdown.js
//
// Tiny markdown-lite renderer for funFactsData.js card bodies:
// blank-line-separated blocks, each either a "- " bullet list or a
// paragraph (single "\n"s inside a paragraph become line breaks), with
// bold/italic inline markup.

/** Renders `**bold**` / `*italic*` spans inside a single line of text. */
function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${keyPrefix}-${i}`}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export function renderFactBody(body) {
  const blocks = body.trim().split(/\n\s*\n/);

  return blocks.map((block, blockIndex) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const isList = lines.length > 0 && lines.every((l) => l.startsWith("- "));

    if (isList) {
      return (
        <ul className="fun-fact-card__list" key={blockIndex}>
          {lines.map((line, i) => (
            <li key={i}>{renderInline(line.slice(2), `${blockIndex}-${i}`)}</li>
          ))}
        </ul>
      );
    }

    return (
      <p className="fun-fact-card__paragraph" key={blockIndex}>
        {lines.map((line, i) => (
          <span key={i}>
            {renderInline(line, `${blockIndex}-${i}`)}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  });
}
