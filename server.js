const express = require('express')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const app = express()
const port = 5353

//Variables
const baseUrl = (pokemon) => `https://pokemondb.net/pokedex/${pokemon}`

//MIDDLEWARE
app.use(require('cors')())

//ROUTES
app.get('/', (req, res) => {
    res.status(200).send({message: 'Thank you for trying our API'})
})

app.get('/api/whosThatApi/Pokemon', async (req, res) => {
    const { pokemon } = req.query
    console.log(`Pokemon Name: ${pokemon}`)
    if(!pokemon) {
        return res.sendStatus(403)
    }


    try {
        const pokedexEntryUrl = baseUrl(pokemon)
        const pokemonRes = await fetch(pokedexEntryUrl)
        const pokemonDataInText = await pokemonRes.text()
        const $ = cheerio.load(pokemonDataInText)
        const vitalsTable = $('main').get().map(val => $(val).text())
        // console.log(pokedexNumber)
        res.status(200)
        return res.send($('td:first').text())
    } catch (err) {
        console.log(`Looks like Team Rocket is blasting off again! ${err}`)
        res.sendStatus(500)
    }
})
app.listen(port, () => console.log(`Lets research some Pokemon! ${port}`))