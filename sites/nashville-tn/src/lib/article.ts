/** Parsed block types for the operator-supplied homepage article. */
export type Node =
  | { kind: 'h1' | 'h2' | 'h3' | 'p'; text: string }
  | { kind: 'list'; ordered: boolean; items: string[] }
  | { kind: 'table'; rows: string[][] };

export type Block =
  | { type: 'p'; style: string; list: boolean; ordered?: boolean; text: string }
  | { type: 'table'; rows: string[][] };

/** Converts the extracted .docx blocks into renderable nodes, grouping
 *  consecutive list paragraphs of the same kind into a single list. */
export function toNodes(blocks: Block[]): Node[] {
  const nodes: Node[] = [];
  for (const b of blocks) {
    if (b.type === 'table') { nodes.push({ kind: 'table', rows: b.rows }); continue; }
    if (b.list) {
      const ordered = b.ordered === true;
      const last = nodes[nodes.length - 1];
      if (last && last.kind === 'list' && last.ordered === ordered) last.items.push(b.text);
      else nodes.push({ kind: 'list', ordered, items: [b.text] });
      continue;
    }
    const kind = b.style === 'Heading1' ? 'h1' : b.style === 'Heading2' ? 'h2' : b.style === 'Heading3' ? 'h3' : 'p';
    nodes.push({ kind, text: b.text } as Node);
  }
  return nodes;
}
