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

        let type = $('.itype:first').text()
        const secondaryTyping = $('table[class="vitals-table"] > tbody > tr:nth(1) > td > a:nth(1)').text()
        const species = $('td:nth(2)').text()
        let eggGroup = $('[href*=egg]:first').text()
        // const eggGroupTwo = $('[href*=egg]:nth(1)').text()
        const eggGroupTwo = $('[href*=egg]:first + a').text()
        res.status(200)
        // return res.send([nationalDexNum, type, species])

        if (secondaryTyping) {
            type = [type, secondaryTyping]       
        }
        if (eggGroupTwo) {
            eggGroup = [eggGroup, eggGroupTwo]
        }
        if (type !== secondaryTyping) {
            return res.send({

                "Photo": pokemonImage,
                "Name": pokemonName,
                "Pokedex Num": nationalDexNum,
                "Type(s)": [type],
                // "Secondary Type": secondaryTyping,
                "Species": species,
                "Egg Group(s)": [eggGroup]
            })    
        } 
        if (secondaryTyping) {
        
        }
        else {
            // return res.send({
            //     "Photo": pokemonImage,
            //     "Name": pokemonName, 
            //     "Pokedex Num": nationalDexNum,
            //     "Type": type,
            //     "Species": species,
            //     "Egg Group(s)": [eggGroupOne, eggGroupTwo]

            // }) 
        }
    } catch (err) {
        console.log(`Looks like Team Rocket is blasting off again! ${err}`)
        res.sendStatus(500)
    }
})
app.listen(port, () => console.log(`Lets research some Pokemon! ${port}`))