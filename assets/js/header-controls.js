export default function initHeaderControls() {
  const ownerActions = document.getElementById('header-owner-actions')

  if (!ownerActions) {
    return
  }

  const isOwner = Boolean(window?.TistoryBlog?.isOwner)
    || Boolean(window?.T?.config?.USER?.name)

  if (isOwner) {
    ownerActions.classList.remove('hidden')
  }
}
