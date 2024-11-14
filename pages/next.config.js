// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/index.html', // Redirige la raíz a index.html
        permanent: true,
      },
    ]
  },
}