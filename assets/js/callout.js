export default function initCallouts() {
  const blockquotes = document.querySelectorAll('.tt_article_useless_p_margin blockquote');
  
  blockquotes.forEach(quote => {
    const firstChild = quote.firstElementChild;
    // Tistory wraps texts in <p> tag inside blockquote
    if (!firstChild || firstChild.tagName !== 'P') return;
    
    const html = firstChild.innerHTML;
    // Match [!type] and optional title, and optional rest of the content
    const match = html.match(/^\[!(\w+)\](.*?)(?:<br>|<\/p><p>)([\s\S]*)$/i) || html.match(/^\[!(\w+)\](.*)$/i);
    
    if (match) {
      const type = match[1].toLowerCase();
      const title = match[2] ? match[2].trim() : type;
      let rest = match[3] || '';
      
      // If there are remaining <p> tags, gather them
      if (!match[3]) {
        const pTags = Array.from(quote.querySelectorAll('p')).slice(1);
        if (pTags.length > 0) {
          rest = pTags.map(p => p.outerHTML).join('');
          pTags.forEach(p => p.remove());
        }
      }
      
      quote.classList.add('callout', `callout-${type}`);
      // Remove default blockquote classes
      quote.classList.remove('italic', 'bg-zinc-50', 'dark:bg-zinc-800/50', 'border-zinc-300', 'dark:border-zinc-600', 'my-6', 'pl-4');
      
      // Select icons
      const icons = {
        info: 'fa-info-circle',
        note: 'fa-pencil-alt',
        tip: 'fa-lightbulb',
        warning: 'fa-exclamation-triangle',
        danger: 'fa-bolt',
        error: 'fa-times-circle',
        success: 'fa-check-circle',
        quote: 'fa-quote-left'
      };
      
      const iconClass = icons[type] || 'fa-info-circle';
      
      quote.innerHTML = `
        <div class="callout-title font-bold flex items-center mb-2">
          <i class="fa-solid ${iconClass} mr-2"></i>
          <span class="capitalize">${title || type}</span>
        </div>
        <div class="callout-content text-sm leading-relaxed">
          ${rest}
        </div>
      `;
    }
  });
}