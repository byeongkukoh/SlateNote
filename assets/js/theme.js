export default function initThemeToggle() {
  const toggleBtn = document.getElementById("dark-mode-toggle");
  const icon = document.getElementById("dark-mode-icon");
  if (!toggleBtn || !icon) return;

  const html = document.documentElement;
  
  // 초기 아이콘 상태 설정
  if (html.classList.contains("dark")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }

  toggleBtn.addEventListener("click", function() {
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    }
  });
}