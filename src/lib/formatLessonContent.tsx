import React from 'react';

/**
 * Parses simple markdown-style content and returns formatted JSX elements.
 * Supports:
 * - **bold** text
 * - Numbered lists (1. Item, 2. Item)
 * - Bullet lists (- Item)
 * - Line breaks (\n\n for paragraphs)
 */
export function formatLessonContent(content: string): React.ReactNode {
  // Split by double newlines for paragraphs
  const paragraphs = content.split(/\n\n/);
  
  return (
    <div className="space-y-3">
      {paragraphs.map((paragraph, pIdx) => {
        // Check if it's a numbered list item (starts with number followed by period)
        const numberedListMatch = paragraph.match(/^(\d+)\.\s+(.+)$/);
        if (numberedListMatch) {
          const [, number, text] = numberedListMatch;
          return (
            <div key={pIdx} className="flex gap-2">
              <span className="font-semibold text-primary shrink-0">{number}.</span>
              <span>{formatInlineText(text)}</span>
            </div>
          );
        }
        
        // Check if it's a bullet list item (starts with -)
        const bulletMatch = paragraph.match(/^-\s+(.+)$/);
        if (bulletMatch) {
          return (
            <div key={pIdx} className="flex gap-2">
              <span className="text-primary shrink-0">•</span>
              <span>{formatInlineText(bulletMatch[1])}</span>
            </div>
          );
        }
        
        // Check if paragraph contains multiple bullet items
        if (paragraph.includes('\n- ')) {
          const lines = paragraph.split('\n');
          return (
            <div key={pIdx} className="space-y-1">
              {lines.map((line, lIdx) => {
                const lineBullet = line.match(/^-\s+(.+)$/);
                if (lineBullet) {
                  return (
                    <div key={lIdx} className="flex gap-2">
                      <span className="text-primary shrink-0">•</span>
                      <span>{formatInlineText(lineBullet[1])}</span>
                    </div>
                  );
                }
                return <p key={lIdx}>{formatInlineText(line)}</p>;
              })}
            </div>
          );
        }
        
        // Regular paragraph
        return (
          <p key={pIdx}>{formatInlineText(paragraph)}</p>
        );
      })}
    </div>
  );
}

/**
 * Formats inline text, handling **bold** markdown syntax
 */
function formatInlineText(text: string): React.ReactNode {
  // Match **bold** patterns
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  if (parts.length === 1) {
    return text;
  }
  
  return parts.map((part, idx) => {
    // Check if this part is bold (wrapped in **)
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={idx} className="font-semibold text-foreground">{boldText}</strong>;
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}
