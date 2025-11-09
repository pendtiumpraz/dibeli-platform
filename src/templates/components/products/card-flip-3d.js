// Card Flip 3D JavaScript

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
