const HEADING_DEMOTION_MAP = {
  H1: 'H2',
  H2: 'H3',
  H3: 'H4'
}

function replaceHeadingTag(heading, nextTag) {
  const replacement = document.createElement(nextTag.toLowerCase())

  for (const { name, value } of Array.from(heading.attributes)) {
    replacement.setAttribute(name, value)
  }

  replacement.innerHTML = heading.innerHTML
  heading.replaceWith(replacement)
}

export default function initHeadingNormalize() {
  const content = document.querySelector('.tt_article_useless_p_margin')
  if (!content) return

  const headings = Array.from(content.querySelectorAll('h1, h2, h3'))
  if (headings.length === 0) return

  headings.forEach((heading) => {
    const nextTag = HEADING_DEMOTION_MAP[heading.tagName]
    if (!nextTag) return
    replaceHeadingTag(heading, nextTag)
  })
}
