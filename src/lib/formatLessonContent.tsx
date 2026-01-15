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
  // First, normalize inline numbered lists: "1. Item 2. Item" → "1. Item\n2. Item"
  const normalizedContent = content.replace(/(\d+)\.\s+/g, (match, num, offset) => {
    // If this is at the start or preceded by newline, keep as is
    // Otherwise, add a newline before it
    if (offset === 0) return match;
    const prevChar = content[offset - 1];
    if (prevChar === '\n') return match;
    // Add newline before the numbered item (except for the first one)
    if (num === '1') return match;
    return `\n${match}`;
  });

  // Split by double newlines for paragraphs
  const paragraphs = normalizedContent.split(/\n\n/);
  
  return (
    <div className="space-y-3">
      {paragraphs.map((paragraph, pIdx) => {
        // Check if paragraph contains numbered list items (could be multi-line)
        const hasNumberedList = /^\d+\.\s/.test(paragraph) || /\n\d+\.\s/.test(paragraph);
        if (hasNumberedList) {
          const lines = paragraph.split('\n');
          return (
            <div key={pIdx} className="space-y-2">
              {lines.map((line, lIdx) => {
                const numberedMatch = line.match(/^(\d+)\.\s*(.+)$/);
                if (numberedMatch) {
                  const [, number, text] = numberedMatch;
                  return (
                    <div key={lIdx} className="flex gap-2">
                      <span className="font-semibold text-primary shrink-0 min-w-[1.25rem]">{number}.</span>
                      <span>{formatInlineText(text)}</span>
                    </div>
                  );
                }
                // Non-numbered line in the paragraph
                if (line.trim()) {
                  return <p key={lIdx}>{formatInlineText(line)}</p>;
                }
                return null;
              })}
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
        if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
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
                if (line.trim()) {
                  return <p key={lIdx}>{formatInlineText(line)}</p>;
                }
                return null;
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
