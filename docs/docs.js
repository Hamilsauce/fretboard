import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

const fretboardPlanMd = await (await fetch('../docs/entity_feature_architecture_summary.md')).text();


const renderMarkdown = () => {
  const output = document.querySelector('#markdown-output');
  output.innerHTML = marked.parse(fretboardPlanMd);
}

renderMarkdown();