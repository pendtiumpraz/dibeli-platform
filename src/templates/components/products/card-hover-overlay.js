// Card Hover Overlay JavaScript
// Note: Quick view modal functions are in quick-view-modal.js

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
