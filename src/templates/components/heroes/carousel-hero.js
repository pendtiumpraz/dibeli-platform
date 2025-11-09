// Carousel Hero JavaScript

let currentCarouselIndex = 0

function prevCarousel() {
  const items = document.querySelectorAll('.carousel-item')
  const dots = document.querySelectorAll('.carousel-dot')
  
  items[currentCarouselIndex].classList.remove('active')
  dots[currentCarouselIndex].classList.remove('active')
  
  currentCarouselIndex = (currentCarouselIndex - 1 + items.length) % items.length
  
  items[currentCarouselIndex].classList.add('active')
  dots[currentCarouselIndex].classList.add('active')
}

function nextCarousel() {
  const items = document.querySelectorAll('.carousel-item')
  const dots = document.querySelectorAll('.carousel-dot')
  
  items[currentCarouselIndex].classList.remove('active')
  dots[currentCarouselIndex].classList.remove('active')
  
  currentCarouselIndex = (currentCarouselIndex + 1) % items.length
  
  items[currentCarouselIndex].classList.add('active')
  dots[currentCarouselIndex].classList.add('active')
}

function goToCarousel(index) {
  const items = document.querySelectorAll('.carousel-item')
  const dots = document.querySelectorAll('.carousel-dot')
  
  items[currentCarouselIndex].classList.remove('active')
  dots[currentCarouselIndex].classList.remove('active')
  
  currentCarouselIndex = index
  
  items[currentCarouselIndex].classList.add('active')
  dots[currentCarouselIndex].classList.add('active')
}

// Auto-play carousel
document.addEventListener('DOMContentLoaded', () => {
  setInterval(() => {
    nextCarousel()
  }, 5000)
})
