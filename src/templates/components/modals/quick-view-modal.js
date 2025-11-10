// Quick View Modal JavaScript

let currentModalProduct = null;

function openQuickView(product) {
  currentModalProduct = product;
  
  // Update modal content
  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalProductPrice').textContent = product.price;
  document.getElementById('modalProductDescription').textContent = product.description || 'Deskripsi produk tidak tersedia.';
  document.getElementById('modalProductImage').src = product.image;
  document.getElementById('modalProductImage').alt = product.name;
  
  // Show modal
  const modal = document.getElementById('quickViewModal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Prevent body scroll
}

function closeQuickView() {
  const modal = document.getElementById('quickViewModal');
  modal.style.display = 'none';
  document.body.style.overflow = ''; // Restore body scroll
  currentModalProduct = null;
}

function orderFromModal() {
  if (!currentModalProduct) return;
  
  const whatsappNumber = '{{store.whatsappNumber}}';
  const storeName = '{{store.name}}';
  
  const message = 'Halo *' + storeName + '*!\n\n' +
    'Saya tertarik dengan:\n\n' +
    '*Produk:* ' + currentModalProduct.name + '\n' +
    '*Harga:* ' + currentModalProduct.price + '\n\n' +
    'Apakah masih tersedia?';
  
  const whatsappUrl = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message);
  window.open(whatsappUrl, '_blank');
}

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeQuickView();
  }
});
