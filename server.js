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
    if(!pokemon) {
        return res.sendStatus(403)
    }

    // if (pokemon === "national") {
    //     const mainInfo = baseUrl(pokemon)
    //     const pokemonRes = await fetch(mainInfo)
    //     const pokemonDataInText = await pokemonRes.text()
    //     const $ = cheerio.load(pokemonDataInText)
    //     const image = $(`img[src*=${pokemon}]`)
    // }
    try {
        const pokedexEntryUrl = baseUrl(pokemon)
        const pokemonRes = await fetch(pokedexEntryUrl)
        const pokemonDataInText = await pokemonRes.text()
        const $ = cheerio.load(pokemonDataInText)
        // const vitalsTable = $('main').get().map(val => $(val).text())
        // console.log(pokedexNumber)
        const pokemonName = $(`main > h1`).text()
        console.log(`Pokemon Name: ${pokemonName}`)
        const nationalDexNum = $('td:first').text()
        const pokemonImage = $(`[src*=${pokemonName} i]`).attr('src')
        // const pokemonImage = $(`img:nth(1)`).attr('src');

        const type = $('.itype:first').text()
        const secondaryTyping = $('.itype:nth(1)').text()
        const species = $('td:nth(2)').text()
        res.status(200)
        // return res.send([nationalDexNum, type, species])

        if (type !== secondaryTyping) {
            return res.send({
                "Photo": pokemonImage,
                "Name": pokemonName,
                "Pokedex Num": nationalDexNum,
                "Type": type,
                "Secondary Type": secondaryTyping,
                "Species": species
            })    
        } else {
            return res.send({
                "Photo": pokemonImage,
                "Name": pokemonName, 
                "Pokedex Num": nationalDexNum,
                "Type": type,
                // "Secondary Type": "",
                "Species": species
            }) 
        }
    } catch (err) {
        console.log(`Looks like Team Rocket is blasting off again! ${err}`)
        res.sendStatus(500)
    }
})
app.listen(port, () => console.log(`Lets research some Pokemon! ${port}`))