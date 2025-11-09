// Branded Cards Dynamic JavaScript

// WhatsApp Order Function
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

// Wishlist Toggle
function toggleWishlist(button) {
  const icon = button.querySelector('i')
  
  if (icon.classList.contains('far')) {
    icon.classList.remove('far')
    icon.classList.add('fas')
    button.classList.add('active')
    
    // Simple animation
    button.style.transform = 'scale(1.2)'
    setTimeout(() => {
      button.style.transform = ''
    }, 200)
  } else {
    icon.classList.remove('fas')
    icon.classList.add('far')
    button.classList.remove('active')
  }
}

// Card Hover Animation
document.addEventListener('DOMContentLoaded', () => {
  const productCards = document.querySelectorAll('.product-card')
  
  productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.zIndex = '10'
    })
    
    card.addEventListener('mouseleave', () => {
      card.style.zIndex = ''
    })
  })
  
  // Animate cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1'
          entry.target.style.transform = 'translateY(0)'
        }, index * 100)
        
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  productCards.forEach((card) => {
    card.style.opacity = '0'
    card.style.transform = 'translateY(30px)'
    card.style.transition = 'all 0.6s ease'
    observer.observe(card)
  })
})
