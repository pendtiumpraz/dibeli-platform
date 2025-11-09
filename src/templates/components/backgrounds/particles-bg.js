// Particles Background - Lightweight custom implementation

class ParticlesBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    if (!this.canvas) {
      // Create canvas if doesn't exist
      this.canvas = document.createElement('canvas')
      this.canvas.id = canvasId
      const container = document.querySelector('.particles-background')
      if (container) {
        container.appendChild(this.canvas)
      }
    }
    
    this.ctx = this.canvas.getContext('2d')
    this.particles = []
    this.particleCount = 80
    
    this.resize()
    this.init()
    this.animate()
    
    window.addEventListener('resize', () => this.resize())
  }
  
  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }
  
  init() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
      })
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Update and draw particles
    this.particles.forEach(particle => {
      particle.x += particle.speedX
      particle.y += particle.speedY
      
      // Wrap around edges
      if (particle.x > this.canvas.width) particle.x = 0
      if (particle.x < 0) particle.x = this.canvas.width
      if (particle.y > this.canvas.height) particle.y = 0
      if (particle.y < 0) particle.y = this.canvas.height
      
      // Draw particle
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fill()
    })
    
    // Draw connections
    this.particles.forEach((p1, i) => {
      this.particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`
          this.ctx.lineWidth = 1
          this.ctx.beginPath()
          this.ctx.moveTo(p1.x, p1.y)
          this.ctx.lineTo(p2.x, p2.y)
          this.ctx.stroke()
        }
      })
    })
    
    requestAnimationFrame(() => this.animate())
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ParticlesBackground('particles-js')
})
