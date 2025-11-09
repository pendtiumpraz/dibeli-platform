// Ultimate Hero JavaScript

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

document.addEventListener('DOMContentLoaded', () => {
  // Animate title words on load
  const titleWords = document.querySelectorAll('.title-word, .title-gradient')
  
  titleWords.forEach((word, index) => {
    word.style.opacity = '0'
    word.style.transform = 'translateY(30px)'
    
    setTimeout(() => {
      word.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      word.style.opacity = '1'
      word.style.transform = 'translateY(0)'
    }, index * 200)
  })
})
