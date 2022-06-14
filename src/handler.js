import { nanoid } from 'nanoid'
import books from './books.js'

const helloWorld = async (request, h) => {
  try {
    return h.response({
      message: 'Hello World'
    }).code(200)
  } catch (err) {
    console.error(err.message)
  }
}

const index = async (request, h) => {
  try {
    const queryName = request.query.name
    const queryReading = request.query.reading
    const queryFinished = request.query.finished
    const newBooks = []

    if ((queryName !== undefined)) {
      const search = queryName?.toLowerCase()
      const filtered = books.filter(book => (book.name).toLowerCase() === search)

      return h.response({
        message: 'show search result by name',
        status: 'success',
        data: {
          books: filtered
        }
      }).code(200)
    }

    if ((queryReading !== undefined)) {
      const search = Boolean(queryReading)
      const filtered = books.filter(book => book.reading === search)

      return h.response({
        message: 'show search result by reading',
        status: 'success',
        data: {
          books: filtered
        }
      }).code(200)
    }

    if ((queryFinished !== undefined)) {
      const search = Boolean(queryFinished)
      const filtered = books.filter(book => book.finished === search)

      return h.response({
        message: 'show search result by finished',
        status: 'success',
        data: {
          books: filtered
        }
      }).code(200)
    }

    books.forEach((book) => {
      const newBook = {}
      newBook.id = book.id
      newBook.name = book.name
      newBook.publisher = book.publisher

      newBooks.push(newBook)
    })

    return h.response({
      message: 'show all books',
      status: 'success',
      data: {
        books: newBooks
      }
    }).code(200)
  } catch (err) {
    console.error(err.message)
  }
}

const show = async (request, h) => {
  try {
    const { id } = request.params
    const book = books.filter(book => book.id === id)

    if (book.length > 0) {
      return h.response({
        message: 'show book details',
        status: 'success',
        data: book
      }).code(200)
    }

    return h.response({
      message: 'book not found',
      status: 'fail'
    }).code(404)
  } catch (err) {
    console.error(err.message)
  }
}

const store = async (request, h) => {
  try {
    const id = nanoid(16)
    const name = request.payload.name
    const year = request.payload.year
    const author = request.payload.author
    const summary = request.payload.summary
    const publisher = request.payload.publisher
    const pageCount = request.payload.pageCount
    const readPage = request.payload.readPage
    const finished = pageCount === readPage
    const reading = request.payload.reading
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const data = {
      id,
      name,
      year: parseInt(year),
      author,
      summary,
      publisher,
      pageCount: parseInt(pageCount),
      readPage: parseInt(readPage),
      finished,
      reading: Boolean(reading),
      insertedAt,
      updatedAt
    }

    if (name === '') {
      return h.response({
        status: 'fail',
        message: 'please fill the book name field'
      }).code(400)
    }

    if (data.readPage > data.pageCount) {
      return h.response({
        status: 'fail',
        message: 'invalid reading page'
      }).code(400)
    }

    books.push(data)
    const isSuccess = books.filter(book => book.id === data.id)

    if (isSuccess) {
      return h.response({
        status: 'success',
        message: 'success add new book',
        data: {
          bookId: data.id
        }
      }).code(201)
    }
  } catch (err) {
    console.error(err.message)
  }
}

const update = async (request, h) => {
  try {
    const { id } = request.params
    const name = request.payload.name
    const year = request.payload.year
    const author = request.payload.author
    const summary = request.payload.summary
    const publisher = request.payload.publisher
    const pageCount = request.payload.pageCount
    const readPage = request.payload.readPage
    const finished = pageCount === readPage
    const reading = request.payload.reading
    const insertedAt = new Date().toISOString()
    // const updatedAt = insertedAt

    console.log(name)

    const data = {
      name,
      year: parseInt(year),
      author,
      summary,
      publisher,
      pageCount: parseInt(pageCount),
      readPage: parseInt(readPage),
      finished,
      reading: Boolean(reading),
      updatedAt: new Date().toISOString()
    }

    const index = books.findIndex(book => book.id === id)
    console.log(index)

    if ((name === undefined) || (name === '') || (name === null)) {
      return h.response({
        status: 'fail',
        message: 'please fill the book name field'
      }).code(400)
    }

    if (data.readPage > data.pageCount) {
      return h.response({
        status: 'fail',
        message: 'invalid reading page'
      }).code(400)
    }

    if (index !== -1) {
      books[index] = {
        id,
        name: data.name,
        year: data.year,
        author: data.author,
        summary: data.summary,
        publisher: data.publisher,
        pageCount: data.pageCount,
        readPage: data.readPage,
        finished: data.finished,
        reading: data.reading,
        insertedAt,
        updatedAt: data.updatedAt
      }

      return h.response({
        status: 'success',
        message: 'success update book'
      }).code(200)
    }
    return h.response({
      status: 'fail',
      message: 'fail updating book, id not found'
    }).code(404)
  } catch (err) {
    console.error(err.message)
  }
}

const deleteById = async (request, h) => {
  try {
    const { id } = request.params
    const index = books.findIndex(book => book.id === id)

    if (index !== -1) {
      books.splice(index, 1)

      return h.response({
        status: 'success',
        message: 'success delete book'
      }).code(200)
    }
    return h.response({
      status: 'fail',
      message: 'fail deleting book, id not found'
    }).code(404)
  } catch (err) {
    console.error(err.message)
  }
}

export {
  helloWorld,
  index,
  show,
  store,
  update,
  deleteById
}
