import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import path from 'path';

const app = express()

const __dirname = import.meta.dirname
app.use(express.static(__dirname + '/public'))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', async (req, res) => {
    res.json({ok: true})
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Servidor andando en http://localhost:${PORT}`)
})
