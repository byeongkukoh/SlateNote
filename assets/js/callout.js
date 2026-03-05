export default function initCallouts() {
  const blockquotes = document.querySelectorAll('.tt_article_useless_p_margin blockquote');

  const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const promoteDashParagraphToList = (paragraph) => {
    const lines = (paragraph.innerHTML || '')
      .split(/<br\s*\/?>/i)
      .map((line) => line.replace(/&nbsp;/g, ' ').trim())
      .filter(Boolean);

    if (lines.length < 2) return;
    if (!lines.every((line) => /^[-*+]\s+/.test(line))) return;

    const ul = document.createElement('ul');
    lines.forEach((line) => {
      const li = document.createElement('li');
      li.innerHTML = line.replace(/^[-*+]\s+/, '').trim();
      ul.appendChild(li);
    });

    paragraph.replaceWith(ul);
  };

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
    const workingQuote = quote.cloneNode(true);
    const paragraphs = Array.from(workingQuote.querySelectorAll('p'));
    const first = paragraphs[0] || workingQuote;
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

      let cleanedFirst = (first.innerHTML || '')
        .replace(/^\s*\\?\[\s*!\w+\s*\]\\?(?:&nbsp;|\s)*/i, '')
        .trim();

      if (customTitle) {
        const titleAtStart = new RegExp(`^${escapeRegex(customTitle)}(?:&nbsp;|\\s)*(?:<br\\s*\\/?>)?`, 'i');
        cleanedFirst = cleanedFirst.replace(titleAtStart, '').trim();
      }

      if (first !== workingQuote) {
        if (cleanedFirst) {
          first.innerHTML = cleanedFirst;
        } else {
          first.remove();
        }
      } else {
        workingQuote.innerHTML = cleanedFirst;
      }

      Array.from(workingQuote.querySelectorAll('p')).forEach(promoteDashParagraphToList);
      bodyHtml = workingQuote.innerHTML;
    } else {
      Array.from(workingQuote.querySelectorAll('p')).forEach(promoteDashParagraphToList);
      bodyHtml = workingQuote.innerHTML;
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
        <span>${title || type}</span>
      </div>
      <div class="callout-content">${bodyHtml}</div>
    `;
  });
}
