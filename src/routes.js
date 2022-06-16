import {
  helloWorld,
  index,
  show,
  store,
  update,
  deleteById
} from './handler.js'

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: helloWorld
  },
  {
    method: 'GET',
    path: '/books',
    handler: index
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: show
  },
  {
    method: 'POST',
    path: '/books',
    handler: store
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: update
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteById
  }
]

export default routes
