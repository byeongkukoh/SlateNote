export default function initCallouts() {
  const blockquotes = document.querySelectorAll('.tt_article_useless_p_margin blockquote');

  const normalizeType = (type) => {
    const key = (type || '').toLowerCase();
    if (key === 'warn') return 'warning';
    if (key === 'danger') return 'danger';
    if (key === 'info') return 'info';
    if (key === 'note') return 'note';
    return key || 'quote';
  };

  const iconMap = {
    info: 'fa-info-circle',
    note: 'fa-note-sticky',
    warning: 'fa-exclamation-triangle',
    danger: 'fa-bolt',
    error: 'fa-times-circle',
    success: 'fa-check-circle',
    quote: 'fa-quote-left'
  };

  const typeLabels = {
    info: 'Information',
    warning: 'Warning',
    danger: 'Danger',
    note: 'Note',
    error: 'Error',
    success: 'Success',
    quote: 'Quote'
  };

  blockquotes.forEach(quote => {
    const paragraphs = Array.from(quote.querySelectorAll('p'));
    const first = paragraphs[0] || quote;
    const firstText = (first.textContent || '').trim();
    const markerMatch = firstText.match(/^\s*\\?\[\s*!(\w+)\s*\]\\?\s*/i);

    let type = 'quote';
    let title = '';
    let bodyHtml = '';

    if (markerMatch) {
      type = normalizeType(markerMatch[1]);
      const markerLineMatch = (first.innerHTML || '').match(/^\s*\\?\[\s*!(\w+)\s*\]\\?(?:&nbsp;|\s)*(.*?)(?:<br\s*\/?>|$)/i);
      const customTitle = (markerLineMatch?.[2] || '').replace(/&nbsp;/g, ' ').trim();
      title = customTitle || (typeLabels[type] || type);

      const restInFirst = (first.innerHTML || '')
        .replace(/^\s*\\?\[\s*!\w+\s*\]\\?(?:&nbsp;|\s|<br\s*\/?>)*/i, '')
        .trim();
      if (restInFirst) {
        bodyHtml += `<p>${restInFirst}</p>`;
      }

      const others = paragraphs.length > 0
        ? paragraphs.slice(1).map(p => p.outerHTML).join('')
        : '';
      bodyHtml += others;
    } else {
      bodyHtml = quote.innerHTML;
    }

    quote.classList.add('callout', `callout-${type}`);

    if (type === 'quote') {
      quote.innerHTML = `<div class="callout-content">${bodyHtml}</div>`;
      return;
    }

    const iconClass = iconMap[type] || iconMap.info;
    quote.innerHTML = `
      <div class="callout-title">
        <i class="fa-solid ${iconClass}"></i>
        <span class="capitalize">${title || type}</span>
      </div>
      <div class="callout-content">${bodyHtml}</div>
    `;
  });
}
