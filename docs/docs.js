import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import fretboardPlanMd from '../docs/fetch-docs.js';
// const fretboardPlanMd = await (await fetch('../docs/entity_feature_architecture_summary.md')).text();


export const renderMarkdown = (el) => {
  const output = el
  output.innerHTML = marked.parse(fretboardPlanMd);
}

// renderMarkdown();