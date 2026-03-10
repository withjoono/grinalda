const withPWA = require('next-pwa')

module.exports = withPWA({
  pwa: {
		dest: 'public',
		importScripts: ['./worker/handlepush.js'],
		disable: process.env.NODE_ENV === 'development',
	}
})
