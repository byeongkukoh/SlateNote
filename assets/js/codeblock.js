import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import markdown from 'highlight.js/lib/languages/markdown';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import kotlin from 'highlight.js/lib/languages/kotlin';
import swift from 'highlight.js/lib/languages/swift';
import yaml from 'highlight.js/lib/languages/yaml';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('css', css);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('c', cpp);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('swift', swift);
hljs.registerLanguage('yaml', yaml);

export default function initCodeBlocks() {
  const codeBlocks = document.querySelectorAll('.tt_article_useless_p_margin pre > code');
  
  codeBlocks.forEach(code => {
    // Highlight
    hljs.highlightElement(code);
    
    const pre = code.parentElement;
    
    // Language extraction
    // 티스토리는 보통 <pre class="java"><code>...</code> 또는 <code class="language-java"> 형식으로 출력함
    let lang = '';
    const codeClass = Array.from(code.classList).find(c => c.startsWith('language-') || c.startsWith('lang-'));
    if (codeClass) {
      lang = codeClass.replace(/language-|lang-/, '');
    } else {
      const preClass = Array.from(pre.classList).find(c => !['tt_article_useless_p_margin'].includes(c));
      if (preClass) lang = preClass;
    }
    
    // Wrap pre in a container
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper my-12 rounded-xl overflow-hidden shadow-lg bg-[#1e1e1e] border border-zinc-700/50';
    // Header
    const header = document.createElement('div');
    header.className = 'code-block-header flex items-center justify-between px-5 py-4 bg-[#252526] border-b border-zinc-700/50';
    // Left section: Mac OS dots + Language name
    const leftSection = document.createElement('div');
    leftSection.className = 'flex items-center gap-4';
    
    // Mac OS like dots
    const dots = document.createElement('div');
    dots.className = 'flex space-x-2 items-center opacity-80';
    dots.innerHTML = `
      <div class="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm"></div>
      <div class="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm"></div>
      <div class="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm"></div>
    `;
    
    // Language label
    const label = document.createElement('div');
    label.className = 'text-sm text-zinc-300 font-mono tracking-wider font-bold select-none';
    label.innerText = lang.toUpperCase() || 'TEXT';
    
    leftSection.appendChild(dots);
    leftSection.appendChild(label);
    
    // Right section (Empty for now, could be Copy button)
    const rightSection = document.createElement('div');
    rightSection.className = 'text-xs text-zinc-500 font-mono select-none';
    // rightSection.innerText = 'Copy';
    
    header.appendChild(leftSection);
    header.appendChild(rightSection);
    
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(header);
    
    // Remove default margins and styles on pre
    pre.classList.remove('my-12', 'my-8', 'shadow-md', 'rounded-lg');
    pre.style.marginTop = '0';
    pre.style.marginBottom = '0';
    pre.style.setProperty('margin-top', '0', 'important');
    pre.style.setProperty('margin-bottom', '0', 'important');
    pre.classList.add('!my-0', 'rounded-none', 'border-0', '!bg-transparent');
    pre.style.setProperty('padding', '1rem 1.25rem', 'important');
    code.classList.add('!bg-transparent');
    code.style.display = 'block';
    
    wrapper.appendChild(pre);
  });
}
