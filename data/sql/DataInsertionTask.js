const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()

const dataBase = new sqlite3.Database("../AllergenFood.sqlite", sqlite3.OPEN_READWRITE)

const foodTableName = "Food"

dataBase.serialize(() => {
    dataBase.run(
        `DROP TABLE IF EXISTS ${foodTableName}`
    )

    dataBase.run(
        `
        CREATE TABLE ${foodTableName}(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text UNIQUE,
            chicken BOOLEAN DEFAULT false,
            beef BOOLEAN DEFAULT false,
            pork BOOLEAN DEFAULT false,
            poultry BOOLEAN DEFAULT false,
            dairy BOOLEAN DEFAULT false,
            buckwheat BOOLEAN DEFAULT false,
            peanut BOOLEAN DEFAULT false,
            walnut BOOLEAN DEFAULT false,
            soybean BOOLEAN DEFAULT false,
            flour BOOLEAN DEFAULT false,
            mackerel BOOLEAN DEFAULT false,
            crab BOOLEAN DEFAULT false,
            shrimp BOOLEAN DEFAULT false,
            squid BOOLEAN DEFAULT false,
            clam BOOLEAN DEFAULT false,
            peach BOOLEAN DEFAULT false,
            tomato BOOLEAN DEFAULT false,
            sulfite BOOLEAN DEFAULT false,
            pine_nut BOOLEAN DEFAULT false
        )
        `
    )

    const insertionStmt = dataBase.prepare(`
        INSERT INTO ${foodTableName} (name, chicken, beef, pork, poultry, dairy, buckwheat, peanut,
            walnut, soybean, flour, mackerel, crab, shrimp, squid, clam, peach, tomato, sulfite, pine_nut)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const ingredients = fs.readFileSync("./Origin.txt")
        .toString()
        .split("\n")
        .map(eachString => eachString.replace("\r", ""))
        .filter(eachString => eachString != '')
        .map(eachString => eachString.split('\t'))
        .forEach((eachFood) => {
            insertionStmt.run(...eachFood)
        })
    insertionStmt.finalize()
})
dataBase.close()


