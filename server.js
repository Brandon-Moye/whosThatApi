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
        // const vitalsTable = $('main').get().map(val => $(val).text())
        // console.log(pokedexNumber)
        const nationalDexNum = $('td:first').text()
        const type = $('.itype:first').text()
        const species = $('td:nth-child(2)').text()
        res.status(200)
        return res.send([nationalDexNum, type, species])
    } catch (err) {
        console.log(`Looks like Team Rocket is blasting off again! ${err}`)
        res.sendStatus(500)
    }
})
app.listen(port, () => console.log(`Lets research some Pokemon! ${port}`))