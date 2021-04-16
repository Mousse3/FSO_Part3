require('dotenv').config()
const express = require('express')

const app = express()
app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

var morgan = require('morgan')

app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const Person = require('./models/person')

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
      })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(person => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }
    
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(result => {
        console.log('person saved!')
    })

    res.json(person)
})

app.get('/info', (req, res) => {
    let personAmount = persons.length
    var d = new Date()
    res.send(`<b1>Phonebook has info for ${personAmount} people</b1>
              <h1></h1>
              <b2>${d}</b2>`)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})