// Premium Nav JavaScript

function toggleSearch() {
  const overlay = document.getElementById('searchOverlay')
  overlay.classList.toggle('active')
  
  if (overlay.classList.contains('active')) {
    const input = overlay.querySelector('.search-input')
    setTimeout(() => input.focus(), 100)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.premium-nav')
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled')
    } else {
      nav.classList.remove('scrolled')
    }
  })
  
  // Close search with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const overlay = document.getElementById('searchOverlay')
      if (overlay.classList.contains('active')) {
        toggleSearch()
      }
    }
  })
})
