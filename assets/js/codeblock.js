import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import markdown from 'highlight.js/lib/languages/markdown';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('css', css);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('markdown', markdown);

export default function initCodeBlocks() {
  const codeBlocks = document.querySelectorAll('.tt_article_useless_p_margin pre > code');
  
  codeBlocks.forEach(code => {
    // Highlight
    hljs.highlightElement(code);
    
    const pre = code.parentElement;
    
    // Extract language
    const langClass = Array.from(code.classList).find(c => c.startsWith('language-'));
    const lang = langClass ? langClass.replace('language-', '').trim() : '';
    
    // Wrap pre in a container
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper my-8 rounded-lg overflow-hidden shadow-md bg-zinc-900 border border-zinc-800';
    
    // Header
    const header = document.createElement('div');
    header.className = 'code-block-header flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-zinc-700/50';
    
    // Mac OS like dots
    const dots = document.createElement('div');
    dots.className = 'flex space-x-2 items-center';
    dots.innerHTML = `
      <div class="w-3 h-3 rounded-full bg-red-500"></div>
      <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
      <div class="w-3 h-3 rounded-full bg-green-500"></div>
    `;
    
    // Language label
    const label = document.createElement('div');
    label.className = 'text-xs text-zinc-400 font-mono uppercase tracking-wider font-bold';
    label.innerText = lang || 'CODE';
    
    header.appendChild(dots);
    header.appendChild(label);
    
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(header);
    
    // Remove default margins on pre
    pre.classList.remove('my-8', 'shadow-md', 'rounded-lg');
    pre.classList.add('my-0', 'rounded-none', 'border-0', '!bg-zinc-900');
    
    wrapper.appendChild(pre);
  });
}