export const DEFAULT_TEMPLATE_HTML = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{store_name}}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      background: white;
      border-radius: 20px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .header h1 {
      font-size: 2.5rem;
      color: #667eea;
      margin-bottom: 10px;
    }
    
    .header p {
      color: #666;
      font-size: 1.1rem;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 25px;
      margin-bottom: 30px;
    }
    
    .product-card {
      background: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
      cursor: pointer;
    }
    
    .product-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 40px rgba(0,0,0,0.2);
    }
    
    .product-image {
      width: 100%;
      height: 250px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      color: white;
    }
    
    .product-info {
      padding: 20px;
    }
    
    .product-name {
      font-size: 1.3rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }
    
    .product-price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 15px;
    }
    
    .btn {
      display: inline-block;
      width: 100%;
      padding: 12px 24px;
      background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
      color: white;
      text-decoration: none;
      border-radius: 10px;
      font-weight: bold;
      text-align: center;
      transition: transform 0.2s;
    }
    
    .btn:hover {
      transform: scale(1.05);
    }
    
    .footer {
      background: white;
      border-radius: 20px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      color: #666;
    }
    
    @media (max-width: 768px) {
      .header h1 {
        font-size: 2rem;
      }
      
      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>{{store_name}}</h1>
      <p>{{store_description}}</p>
    </div>
    
    <div class="products-grid">
      <!-- Products will be inserted here -->
    </div>
    
    <div class="footer">
      <p>Powered by <strong style="color: #667eea;">dibeli.my.id</strong></p>
    </div>
  </div>
</body>
</html>
`

export const DEFAULT_TEMPLATE_CSS = `
/* Default Template Styles */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #25D366;
}
`

export const DEFAULT_TEMPLATE_JS = `
// Default Template JavaScript
console.log('Template loaded: Default Simple Store');
`
