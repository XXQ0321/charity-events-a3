
  initializeApp();
  setupDeleteModal();

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-primary') && 
        (e.target.textContent.includes('View Details') || e.target.closest('.btn-primary')?.textContent.includes('View Details'))) {
      
      const button = e.target.classList.contains('btn-primary') ? e.target : e.target.closest('.btn-primary');
      if (button) {
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes('showEventDetail')) {
          const match = onclickAttr.match(/showEventDetail\((\d+)\)/);
          if (match && match[1]) {
            const eventId = parseInt(match[1]);
            showEventDetail(eventId);
          }
        } else {
          const eventId = button.getAttribute('data-event-id');
          if (eventId) {
            showEventDetail(parseInt(eventId));
          }
        }
      }
    }
  });
});

async function initializeApp() {
  await loadCategories();
  await loadAllEvents();
  showPage("home");
}

function showPage(pageName) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => (page.style.display = "none"));

  const pageElement = document.getElementById(pageName + "-page");
  if (pageElement) {
    pageElement.style.display = "block";
    if (pageName === "home") {
      displayEventsByCategory();
    } else if (pageName === "search") {
      const resultsContainer = document.getElementById("search-results");
      if (resultsContainer) {
        resultsContainer.innerHTML = "";
      }
    } else if (pageName === "event-detail") {
