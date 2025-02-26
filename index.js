const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json())
morgan.token('body', (req, res) => {
    return req.body ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
    },  
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
    }
]

const info = `<p>Phonebook has info for ${persons.length} people</p>`
const aika = new Date()

app.get('/info', (request, response) => {
    response.send(info + aika)
})


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
    const uusiId = persons.length > 0
        ? Math.floor(Math.random() * 1000000000) 
        : 1

    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'nimi puuttuu'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'numero puuttuu'
        })
    } else if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'nimi on jo luettelossa'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: String(uusiId)
    }

    persons = persons.concat(person)

    response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
