import { createServer } from 'http'
import { readFile } from 'fs/promises'
import { join } from 'path'

createServer(async function (req, res) {
	let route = req.url === '/' ? 'index.html' : req.url
	if (!route.match(/.html$|.css$/)) route = route.concat('.html')
	const file = join('pages', route)

	try {
		if (route.match(/.css$/)) {
			res.setHeader('Content-Type', 'text/css')
		} else {
			res.setHeader('Content-Type', 'text/html')
		}
		res.statusCode = 200
		res.write(await readFile(file, 'utf8'))
	} catch (error) {
		console.log(error)
		if (!error.message.match(/no such file or directory/)) {
			return res.end(500)
		}

		res.writeHead(404, { 'Content-Type': 'text/html' })
		res.write(await readFile(join('pages', '404.html'), 'utf8'))
	}

	res.end()
}).listen(5000)
