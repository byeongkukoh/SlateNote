export default function initTOC() {
  const content = document.querySelector('.tt_article_useless_p_margin');
  const tocContainer = document.getElementById('toc');
  const tocWrapper = document.getElementById('toc-container');
  
  if (!content || !tocContainer) return;
  
  const headings = Array.from(content.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  if (headings.length === 0) {
    if (tocWrapper) tocWrapper.style.display = 'none';
    return;
  }
  
  let currentTopHeaderLevel = null;
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.replace('H', ''), 10);
    
    if (!heading.id) {
      // Use textContent or fallback to index
      const baseId = heading.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_가-힣]/g, '') || `heading-${index}`;
      heading.id = baseId;
    }
    
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    link.className = 'toc-link text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block py-0.5 break-words';
    
    if (currentTopHeaderLevel === null) {
      currentTopHeaderLevel = level;
    }
    const indent = Math.max(0, level - currentTopHeaderLevel);
    link.style.marginLeft = `${indent * 0.75}rem`;
    
    tocContainer.appendChild(link);
  });
  
  // Intersection Observer
  const links = document.querySelectorAll('.toc-link');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((link) => {
          link.classList.remove('text-blue-600', 'dark:text-blue-400', 'font-bold');
          link.classList.add('text-zinc-500', 'dark:text-zinc-400');
        });
        
        const activeLink = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
        if (activeLink) {
          activeLink.classList.add('text-blue-600', 'dark:text-blue-400', 'font-bold');
          activeLink.classList.remove('text-zinc-500', 'dark:text-zinc-400');
          
          // Auto scroll TOC
          const linkTop = activeLink.offsetTop;
          tocContainer.scrollTo({
            top: linkTop - tocContainer.clientHeight / 2,
            behavior: 'smooth'
          });
        }
      }
    });
  }, {
    rootMargin: '-5% 0px -85% 0px'
  });
  
  headings.forEach(h => observer.observe(h));
}
