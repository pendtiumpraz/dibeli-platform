// Modern Nav JavaScript

function toggleMobileMenu() {
  const menu = document.querySelector('.nav-menu')
  const hamburger = document.querySelector('.hamburger')
  
  menu.classList.toggle('active')
  hamburger.classList.toggle('active')
}

// Close mobile menu when clicking nav links
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-menu a')
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const menu = document.querySelector('.nav-menu')
      const hamburger = document.querySelector('.hamburger')
      
      if (menu.classList.contains('active')) {
        menu.classList.remove('active')
        hamburger.classList.remove('active')
      }
    })
  })
  
  // Add scrolled class on scroll
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.modern-nav')
    
    if (window.scrollY > 50) {
      nav.classList.add('scrolled')
    } else {
      nav.classList.remove('scrolled')
    }
  })
})
