const express = require('express')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
require('dotenv').config()
const app = express()
const port = 5353

//Variables
const baseUrl = (pokemon) => `https://pokemondb.net/pokedex/${pokemon}`
const secretApiKey = process.env.APIKEY




//MIDDLEWARE
app.use(require('cors')())

function middlewareInterceptor(req, res, next) {
    const { password } = req.query
    if (password !=='mudkip-rules') { return res.sendStatus(403)}
    next()
}


//ROUTES
app.get('/', (req, res) => {
    res.status(200).send({message: 'Thank you for trying our API'})
})

app.get('/api/whosThatApi/Pokemon', middlewareInterceptor ,async (req, res) => {
    const { pokemon } = req.query
    if(!pokemon) {
        return res.sendStatus(403)
    }

    try {
        const pokedexEntryUrl = baseUrl(pokemon)
        const pokemonRes = await fetch(pokedexEntryUrl)
        const pokemonDataInText = await pokemonRes.text()
        const $ = cheerio.load(pokemonDataInText)
        function getPokemonDetails($, selectors) {    
            const details = {};

            const pokemonImage = $(`[src*=${pokemon} i]`).attr('src')
            details.pokemonImage = pokemonImage

            selectors.forEach(selector => {
                const key = selector.key
                const cheerioSelector = selector.selector
                details[key] = $(cheerioSelector).text()
            })

            return details;
        }

        const selectors = [
            { key: 'pokemonName', selector: 'main > h1' },
            { key: 'nationalDexNum', selector: 'td:first' },
            { key: 'type', selector: '.itype:first' },
            { key: 'secondaryTyping', selector: 'table[class="vitals-table"] > tbody > tr:nth(1) > td > a:nth(1)' },
            { key: 'species', selector: 'td:nth(2)' },
            { key: 'eggGroup', selector: '[href*=egg]:first' },
            { key: 'eggGroupTwo', selector: '[href*=egg]:first + a' }        ]

        const pokemonDetails = getPokemonDetails($, selectors)
        res.status(200)
            return res.send({
                "Pokemon Details": pokemonDetails,
            })    
        // } 
    } catch (err) {
        console.log(`Looks like Team Rocket is blasting off again! ${err}`)
        res.sendStatus(500)
    }
})

app.listen(port, () => console.log(`Lets research some Pokemon! ${port}`))