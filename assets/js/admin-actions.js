function isResolvedToken(value) {
  return Boolean(value) && !value.includes('[##_')
}

export default function initAdminActions() {
  const rows = document.querySelectorAll('.article-meta-row')

  rows.forEach((row) => {
    const editSource = row.querySelector('.admin-edit-source')
    const deleteSource = row.querySelector('.admin-delete-source')

    const editHref = (editSource?.getAttribute('href') || '').trim()
    const deleteOnclick = (deleteSource?.getAttribute('onclick') || '').trim()

    const hasEdit = isResolvedToken(editHref) && editHref !== '#'
    const hasDelete = isResolvedToken(deleteOnclick)

    if (!hasEdit && !hasDelete) {
      return
    }

    const actions = document.createElement('div')
    actions.className = 'admin-actions flex items-center gap-2'

    if (hasEdit) {
      const editButton = document.createElement('a')
      editButton.className = 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white transition-colors hover:bg-white/30'
      editButton.href = editHref
      editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i><span>수정</span>'
      actions.appendChild(editButton)
    }

    if (hasDelete) {
      const deleteButton = document.createElement('a')
      deleteButton.className = 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white transition-colors hover:bg-red-500/70'
      deleteButton.href = '#'
      deleteButton.setAttribute('onclick', deleteOnclick)
      deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i><span>삭제</span>'
      actions.appendChild(deleteButton)
    }

    row.appendChild(actions)
    editSource?.remove()
    deleteSource?.remove()
  })
}
