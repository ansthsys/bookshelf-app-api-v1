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
    const {
      queryName,
      queryReading,
      queryFinished
    } = request.query
    let newBooks = books

    if (queryName !== undefined) {
      const search = queryName.toLowerCase()
      let filteredBooks = books.filter(book => book.name.toLowerCase().includes(search))
      let newFilteredObj = filteredBooks.map(function (book){
        return {
          name : book.name,
          publisher : book.publisher
        }
      })
      let res = h.response({
        "status": "success",
        "data": {
          "books": newFilteredObj
        }
      })
      res.code(200)
      return res
    }

    if ((queryReading !== undefined)) {
      const search = Boolean(queryReading)
      let filteredBooks = books.filter(book => book.reading == search)
      let newFilteredObj = filteredBooks.map(function (book){
        return {
          name : book.name,
          publisher : book.publisher
        }
      })
      let res = h.response({
        "status": "success",
        "data": {
          "books": newFilteredObj
        }
      })
      res.code(200)
      return res
    }

    if ((queryFinished !== undefined)) {
      const search = Boolean(queryFinished)
      let filteredBooks = books.filter(book => book.finished == search)
      let newFilteredObj = filteredBooks.map(function (book){
        return {
          name : book.name,
          publisher : book.publisher
        }
      })
      let res = h.response({
        "status": "success",
        "data": {
          "books": newFilteredObj
        }
      })
      res.code(200)
      return res
    }

    let res = h.response({
      "status": "success",
      "data": {
        "books": newBooks.map(book => ({
          id : book.id,
          name : book.name,
          publisher : book.publisher
        }))
      }
    })
    res.code(200)
    return res
  } catch (err) {
    console.error(err.message)
    let res = h.response({
      "status": "error",
      "message": "Buku gagal dimuat"
    })
    res.code(500)
    return res
  }
}

const show = async (request, h) => {
  try {
    const { id } = request.params
    const index = books.findIndex(param => param.id === id)
    let book = books[index]

    if (index != -1) {
      let res = h.response({
        "status": "success",
        "data": {
          book
        }
      })
      res.code(200)
      return res
    }

    let res = h.response({
      "status": "fail",
      "message": "Buku tidak ditemukan"
    })
    res.code(404)
    return res
  } catch (err) {
    console.error(err.message)
  }
}

const store = async (request, h) => {
  try {
    const { 
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading
    } = request.payload

    const data = {
      id : nanoid(16),
      name : name,
      year: parseInt(year),
      author : author,
      summary : summary,
      publisher : publisher,
      pageCount: parseInt(pageCount),
      readPage: parseInt(readPage),
      finished : pageCount === readPage,
      reading: Boolean(reading),
      insertedAt : new Date().toISOString(),
      updatedAt : new Date().toISOString()
    }

    if (name === undefined) {
      let res = h.response({
        "status": "fail",
        "message": "Gagal menambahkan buku. Mohon isi nama buku"
      })
      res.code(400)
      return res
    } 

    if (data.readPage > data.pageCount) {
      let res = h.response({
        "status": "fail",
        "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
      })
      res.code(400)
      return res
    }

    books.push(data)
    const isSuccess = books.filter(book => book.id === data.id)

    if (isSuccess.length != 0) {
      let oobjek = {
        "status": "success",
        "message": "Buku berhasil ditambahkan",
        "data": {
          "bookId": data.id
        }
      }
      let res = h.response(oobjek)
      res.code(201)
      return res
    }
  } catch (err) {
    console.error(err.message)
    let res = h.response({
      "status": "error",
      "message": "Buku gagal ditambahkan"
    })
    res.code(500)
    return res
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

    if ((name === undefined) || (name === '') || (name === null)) {
      let res = h.response({
        "status": "fail",
        "message": "Gagal memperbarui buku. Mohon isi nama buku"
      })
      res.code(400)
      return res
    }

    if (data.readPage > data.pageCount) {
      let res = h.response({
        "status": "fail",
        "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
      })
      res.code(400)
      return res
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

      let res = h.response({
        "status": "success",
        "message": "Buku berhasil diperbarui"
      })
      res.code(200)
      return res
    }
    let res = h.response({
      "status": "fail",
      "message": "Gagal memperbarui buku. Id tidak ditemukan"
    })
    res.code(404)
    return res
  } catch (err) {
    console.error(err.message)
    let res = h.response({
      "status": "error",
      "message": "Buku gagal diperbaharui"
    })
    res.code(500)
    return res
  }
}

const deleteById = async (request, h) => {
  try {
    const { id } = request.params
    const index = books.findIndex(book => book.id === id)

    if (index !== -1) {
      books.splice(index, 1)

      let res = h.response({
        "status": "success",
        "message": "Buku berhasil dihapus"
      })
      res.code(200)
      return res
    }
    let res = h.response({
      "status": "fail",
      "message": "Buku gagal dihapus. Id tidak ditemukan"
    })
    res.code(404)
    return res
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
