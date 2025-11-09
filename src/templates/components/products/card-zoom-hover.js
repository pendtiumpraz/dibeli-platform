// Card Zoom Hover JavaScript

function toggleWishlist(button) {
  const icon = button.querySelector('i')
  
  if (icon.classList.contains('far')) {
    icon.classList.remove('far')
    icon.classList.add('fas')
    button.classList.add('active')
    button.style.background = 'var(--primary-color)'
    button.style.color = 'white'
  } else {
    icon.classList.remove('fas')
    icon.classList.add('far')
    button.classList.remove('active')
    button.style.background = 'white'
    button.style.color = ''
  }
}

function quickView(productId) {
  alert('Quick View: ' + productId)
}

function shareProduct(productName) {
  if (navigator.share) {
    navigator.share({
      title: productName,
      text: 'Check out this product: ' + productName,
      url: window.location.href
    })
  } else {
    alert('Share: ' + productName)
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
