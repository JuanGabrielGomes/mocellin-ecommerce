import type { ReactNode } from 'react'

/**
 * Renderiza texto com suporte a formatação simples:
 *   **texto**        → negrito
 *   linha em branco  → novo parágrafo
 *   quebra simples   → <br />
 */
function parseInline(line: string): ReactNode[] {
  const parts = line.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-mj-text">{part.slice(2, -2)}</strong>
    }
    return part
  })
}

interface RichTextProps {
  text: string
  className?: string
}

export function RichText({ text, className }: RichTextProps) {
  const paragraphs = text.split(/\n{2,}/)

  return (
    <div className={className}>
      {paragraphs.map((para, pi) => {
        const lines = para.split('\n')
        return (
          <p key={pi} className={pi > 0 ? 'mt-3' : ''}>
            {lines.map((line, li) => (
              <span key={li}>
                {li > 0 && <br />}
                {parseInline(line)}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}
