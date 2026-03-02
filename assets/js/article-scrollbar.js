export default function initArticleScrollbar() {
  const pane = document.querySelector('.article-scroll-pane')

  if (!pane) {
    return
  }

  let timer = null

  pane.addEventListener('scroll', () => {
    pane.classList.add('is-scrolling')

    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      pane.classList.remove('is-scrolling')
    }, 650)
  }, { passive: true })
}
