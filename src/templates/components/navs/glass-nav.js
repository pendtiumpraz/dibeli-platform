// Glass Nav JavaScript

function toggleGlassMenu() {
  // Mobile menu toggle (to be implemented)
  alert('Mobile menu - Coming soon!')
}

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.glass-nav')
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled')
    } else {
      nav.classList.remove('scrolled')
    }
  })
})
