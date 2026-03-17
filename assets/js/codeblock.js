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

const LANGUAGE_ALIASES = {
  cplusplus: 'cpp',
  'c++': 'cpp',
  cs: 'csharp',
  htm: 'html',
  js: 'javascript',
  jsx: 'javascript',
  md: 'markdown',
  plaintext: 'text',
  plain: 'text',
  py: 'python',
  rs: 'rust',
  sh: 'bash',
  shell: 'bash',
  text: 'text',
  ts: 'typescript',
  tsx: 'typescript',
  txt: 'text',
  yml: 'yaml',
  zsh: 'bash'
};

const DISPLAY_LABELS = {
  cpp: 'CPP',
  csharp: 'C#',
  text: 'TEXT'
};

function normalizeLanguage(lang) {
  if (!lang) return '';
  const normalized = lang.trim().toLowerCase();
  return LANGUAGE_ALIASES[normalized] || normalized;
}

function getDisplayLabel(rawLang, normalizedLang) {
  const raw = rawLang?.trim();
  if (raw) {
    const rawNormalized = raw.toLowerCase();
    if (DISPLAY_LABELS[rawNormalized]) {
      return DISPLAY_LABELS[rawNormalized];
    }

    if (LANGUAGE_ALIASES[rawNormalized] === 'text') {
      return 'TEXT';
    }

    return raw.toUpperCase();
  }

  return DISPLAY_LABELS[normalizedLang] || normalizedLang.toUpperCase() || 'TEXT';
}

function extractLanguage(code, pre) {
  const candidates = [
    ...Array.from(code.classList)
      .filter(className => className.startsWith('language-') || className.startsWith('lang-'))
      .map(className => className.replace(/language-|lang-/, '')),
    ...Array.from(pre.classList).filter(className => !['tt_article_useless_p_margin', 'hljs'].includes(className))
  ];

  const rawLang = candidates.find(candidate => {
    const normalized = normalizeLanguage(candidate);
    return normalized === 'text' || Boolean(hljs.getLanguage(normalized));
  }) || '';

  return {
    raw: rawLang,
    normalized: normalizeLanguage(rawLang)
  };
}

export default function initCodeBlocks() {
  const codeBlocks = document.querySelectorAll('.tt_article_useless_p_margin pre > code');
  
  codeBlocks.forEach(code => {
    const pre = code.parentElement;
    const codeText = code.textContent || '';
    const { raw: rawLang, normalized: normalizedLang } = extractLanguage(code, pre);

    if (normalizedLang && normalizedLang !== 'text' && hljs.getLanguage(normalizedLang)) {
      const result = hljs.highlight(codeText, {
        language: normalizedLang,
        ignoreIllegals: true
      });
      code.innerHTML = result.value;
      code.classList.add('hljs', `language-${normalizedLang}`);
    } else {
      code.textContent = codeText;
      code.classList.add('hljs');
    }
    
    // Wrap pre in a container
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper my-12 rounded-xl overflow-hidden shadow-md bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700';
    // Header
    const header = document.createElement('div');
    header.className = 'code-block-header flex items-center justify-between px-4 py-3 bg-zinc-50 border-b border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700';
    const leftSection = document.createElement('div');
    leftSection.className = 'flex items-center';
    
    // Language label
    const label = document.createElement('div');
    label.className = 'text-sm text-zinc-700 dark:text-zinc-200 font-mono font-semibold leading-none select-none';
    label.innerText = getDisplayLabel(rawLang, normalizedLang);

    leftSection.appendChild(label);
    
    const rightSection = document.createElement('div');
    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2.5 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600 dark:hover:text-white';
    const copyIcon = document.createElement('i');
    copyIcon.className = 'fa-regular fa-copy';
    const copyText = document.createElement('span');
    copyText.textContent = '복사';
    copyButton.appendChild(copyIcon);
    copyButton.appendChild(copyText);
    let resetTimer = null;
    copyButton.addEventListener('click', async () => {
      const codeText = code.innerText || code.textContent || '';
      if (!codeText) return;

      try {
        await navigator.clipboard.writeText(codeText);
      } catch {
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        const temp = document.createElement('textarea');
        temp.value = codeText;
        temp.setAttribute('readonly', '');
        temp.style.position = 'fixed';
        temp.style.top = '0';
        temp.style.left = '0';
        temp.style.opacity = '0';
        temp.style.pointerEvents = 'none';
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        window.scrollTo(scrollX, scrollY);
      }

      if (resetTimer) {
        clearTimeout(resetTimer);
      }
      copyIcon.className = 'fa-solid fa-check';
      copyText.textContent = '복사됨';
      resetTimer = setTimeout(() => {
        copyIcon.className = 'fa-regular fa-copy';
        copyText.textContent = '복사';
      }, 1200);
    });
    rightSection.appendChild(copyButton);
    
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
