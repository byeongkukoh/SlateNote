export default function initProfileLinks() {
  const profileLinks = document.querySelectorAll('[data-profile-link="true"]')

  profileLinks.forEach((link) => {
    const href = (link.getAttribute('href') || '').trim()
    if (!href) {
      return
    }

    if (href.includes('[##_')) {
      return
    }

    const isEmailLink = link.getAttribute('data-email-link') === 'true'
    if (isEmailLink) {
      if (!href.startsWith('mailto:') && href.includes('@')) {
        link.setAttribute('href', `mailto:${href}`)
      }
      return
    }

    const hasProtocol = /^(https?:|mailto:|tel:|#|\/\/)/i.test(href)
    if (!hasProtocol) {
      link.setAttribute('href', `https://${href}`)
    }
  })
}
