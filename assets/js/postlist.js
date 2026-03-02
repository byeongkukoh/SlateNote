export default function initPostListPreview() {
  const summaries = document.querySelectorAll('.post-list-summary');
  const maxChars = 200;

  summaries.forEach((summary) => {
    const text = summary.textContent.trim();
    if (text.length > maxChars) {
      summary.textContent = `${text.slice(0, maxChars).trimEnd()}...`;
    }
  });
}
