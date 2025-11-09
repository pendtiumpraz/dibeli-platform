// Card Image Slider JavaScript

function prevImage(button) {
  const container = button.closest('.slider-container')
  const images = container.querySelectorAll('.slider-images img')
  const dots = container.querySelectorAll('.dot')
  
  let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'))
  
  images[currentIndex].classList.remove('active')
  dots[currentIndex].classList.remove('active')
  
  currentIndex = (currentIndex - 1 + images.length) % images.length
  
  images[currentIndex].classList.add('active')
  dots[currentIndex].classList.add('active')
}

function nextImage(button) {
  const container = button.closest('.slider-container')
  const images = container.querySelectorAll('.slider-images img')
  const dots = container.querySelectorAll('.dot')
  
  let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'))
  
  images[currentIndex].classList.remove('active')
  dots[currentIndex].classList.remove('active')
  
  currentIndex = (currentIndex + 1) % images.length
  
  images[currentIndex].classList.add('active')
  dots[currentIndex].classList.add('active')
}

function goToSlide(dot, index) {
  const container = dot.closest('.slider-container')
  const images = container.querySelectorAll('.slider-images img')
  const dots = container.querySelectorAll('.dot')
  
  images.forEach(img => img.classList.remove('active'))
  dots.forEach(d => d.classList.remove('active'))
  
  images[index].classList.add('active')
  dots[index].classList.add('active')
}

function toggleWishlist(button) {
  const icon = button.querySelector('i')
  
  if (icon.classList.contains('far')) {
    icon.classList.remove('far')
    icon.classList.add('fas')
    button.classList.add('active')
  } else {
    icon.classList.remove('fas')
    icon.classList.add('far')
    button.classList.remove('active')
  }
}

function orderProduct(productName, price) {
  const whatsappNumber = '{{store.whatsappNumber}}'
  const storeName = '{{store.name}}'
  
  const message = 'Halo *' + storeName + '*!\n\n' +
    'Saya tertarik dengan:\n\n' +
    '*Produk:* ' + productName + '\n' +
    '*Harga:* ' + price + '\n\n' +
    'Apakah masih tersedia?'
  
  const whatsappUrl = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message)
  window.open(whatsappUrl, '_blank')
}
