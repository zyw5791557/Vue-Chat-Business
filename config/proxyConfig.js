module.exports = {
	proxyList: {
		'/api':{
	        target: 'http://chat.emlice.top',
	        changeOrigin:true,
	        pathRewrite: {
	        	'^/api': '/api'
	        }
	    },
		'/upload':{
	        target: 'http://static.emlice.top',
	        changeOrigin:true,
	        pathRewrite: {
	        	'^/upload': '/api'
	        }
	    },
	}
}