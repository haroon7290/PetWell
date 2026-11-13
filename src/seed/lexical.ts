/** Tiny Markdown → Lexical converter for the starter content (headings, paragraphs, bullet lists, links). */

type Node = Record<string, unknown>

const text = (value: string, format = 0): Node => ({
  type: 'text',
  text: value,
  format,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const inline = (line: string): Node[] => {
  const out: Node[] = []
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(text(line.slice(last, m.index)))
    if (m[1]) {
      out.push({
        type: 'link',
        fields: { linkType: 'custom', url: m[2], newTab: false },
        children: [text(m[1])],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 3,
      })
    } else if (m[3]) {
      out.push(text(m[3], 1))
    }
    last = m.index + m[0].length
  }
  if (last < line.length) out.push(text(line.slice(last)))
  return out
}

const block = (type: string, children: Node[], extra: Node = {}): Node => ({
  type,
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  ...extra,
})

export const markdownToLexical = (md: string) => {
  const children: Node[] = []
  let list: Node[] | null = null

  const flush = () => {
    if (list) {
      children.push(block('list', list, { listType: 'bullet', start: 1, tag: 'ul' }))
      list = null
    }
  }

  for (const raw of md.split('\n')) {
    const line = raw.trim()
    if (!line) {
      flush()
      continue
    }
    const heading = /^(#{2,4})\s+(.*)$/.exec(line)
    if (heading) {
      flush()
      children.push(block('heading', inline(heading[2]), { tag: `h${heading[1].length}` }))
      continue
    }
    if (line.startsWith('- ')) {
      list = list ?? []
      list.push(block('listitem', inline(line.slice(2)), { value: list.length + 1 }))
      continue
    }
    flush()
    children.push(block('paragraph', inline(line), { textFormat: 0, textStyle: '' }))
  }
  flush()

  return {
    root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 },
  } as never
}
