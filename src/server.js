import Hapi from '@hapi/hapi'
import routes from './routes.js'

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  server.route(routes)

  await server.start()
  console.log('server is running on %s', server.info.uri)
}

init()
