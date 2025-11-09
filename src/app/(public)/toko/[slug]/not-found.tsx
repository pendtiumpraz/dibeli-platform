export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <h1 style={{
        fontSize: '72px',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #10b981 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '20px',
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '10px',
      }}>
        Toko Tidak Ditemukan
      </h2>
      <p style={{
        fontSize: '16px',
        color: '#6b7280',
        marginBottom: '30px',
        maxWidth: '500px',
      }}>
        Toko yang Anda cari tidak tersedia atau belum dipublikasikan.
      </p>
      <a href="/" style={{
        padding: '14px 28px',
        background: 'linear-gradient(135deg, #667eea 0%, #10b981 100%)',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        fontSize: '16px',
        transition: 'transform 0.3s ease',
      }}>
        Kembali ke Beranda
      </a>
    </div>
  )
}
