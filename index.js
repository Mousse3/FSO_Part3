const express = require('express')
const app = express()
app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

var morgan = require('morgan')

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "1353546324"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "06435134234"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "0643534675"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number:"46594775657"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    let dupe = false
    
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    persons.map(person => {
        if (person.name === body.name) {
            dupe = true
        }
    })

    if (dupe) {
        return res.status(400).json({
            error: 'Name must be unique'
        })
    }
    
    const person = {
        id: generateId(5000),
        name: body.name,
        number: body.number
    }
    console.log(typeof body.name)
    console.log(typeof persons[1].name)
    persons = persons.concat(person)

    res.json(person)
})

app.get('/info', (req, res) => {
    let personAmount = persons.length
    var d = new Date()
    res.send(`<b1>Phonebook has info for ${personAmount} people</b1>
              <h1></h1>
              <b2>${d}</b2>`)
})

const generateId = (max) => {
    return Math.floor(Math.random() * Math.floor(max))
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})