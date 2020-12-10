const puppeteer = require('puppeteer')
const sqlite3 = require('sqlite3')
const { KoconutArray } = require('koconut')

const menus = {
    ramen : [
        ["일반라면", 2000],
        ["떡만두라면", 2500],
        ["치즈라면", 2500],
        ["해장라면", 3000],
        ["가락우동", 2000],
        ["꼬치어묵우동", 3000],
        ["새우튀김우동", 3000],
        ["꼬치어묵", 1500],
        ["공기밥", 500],
        ["고기만두", 1500],
        ["김치만두", 1500],
        ["떡볶이", 2000],
        ["라볶이", 3000],
        ["치즈라볶이", 3500],
        ["야채김밥", 1800],
        ["소고기김밥", 2500],
        ["참치김밥", 2500],
        ["돈까스김밥", 3000],
        ["추억의도시락", 3000]
    ],
    western : [
        ["돈까스", 4000],
        ["치즈돈까스", 4500],
        ["치킨스테이크", 4000],
        ["새우튀김오므라이스", 3500],
        ["불닭오므라이스", 3500],
        ["토마토 해물 파스타", 4000]
    ],
    snack : [
        ["별리달리 알밥", 3900],
        ["떡갈비 추가", 800],
        ["수제 떡갈비 버거(단품)", 3500],
        ["수제 떡갈비 버거(세트)\n<버거+감자튀김+콜라>", 4500],
        ["콜라/사이다", 600],
        ["콜팝치킨", 2600],
        ["치킨커리 샌드위치", 3000],
        ["크리스피 치킨텐더(6PCS)", 3700],
        ["크리스피 치킨텐더(세트)\n<치킨텐더+감자튀김+음료>", 4700],
        ["순살 후라이드 치킨(세트)", 8400],
        ["순살 양념치킨(세트)", 9400],
        ["순살 반반치킨(세트)", 9400]
    ],
    korean : [
        ["바지락된장찌개", 4000],
        ["불고기비빔밥", 4700],
        ["해물순두부찌개", 4200],
        ["돈육김치찌개", 4200],
        ["부대찌개", 5000],
        ["뚝불고기", 4500]
    ],
    japanese : [
        ["치킨마요덮밥(미니우동)", 3900],
        ["제육덮밥(미니우동)", 4200],
        ["카츠돈부리(미니우동)", 4200],
        ["치킨돈부리(미니우동)", 4200],
        ["김치카츠라이스(미니우동)", 4500],
        ["카라아게카레(미니우동)", 4700],
        ["카츠카레(미니우동)", 4700]
    ],
    chinese : [
        ["옛날짜장", 3900],
        ["짜장곱배기", 4500],
        ["해물짬뽕", 4200],
        ["짬뽕곱배기", 4700],
        ["짬짜면", 4700],
        ["짬짜면곱배기", 5200],
        ["볶음밥", 4500],
        ["볶음밥곱배기+소스", 5000],
        ["탕수육", 5800],
        ["군만두", 3200],
        ["공기밥(중식)", 500]
    ]
}

const mealPeriod = {
    Launch : "CCS02.20", 
    LaunchCourse : "CCS02.40"
}

let instance
const url = "http://cnuis.cnu.ac.kr/jsp/etc/weekMenuFrame.jsp"

class Crawler {

    page
    currentMealPeriod = mealPeriod.Launch
    database

    static async getInstance() {
        if(!instance)  {
            instance = new Crawler()
            await instance.initialize()
        }
        return instance
    }

    async initialize() {
        const browser = await puppeteer.launch({
            headless : true
        })
        this.page = await browser.newPage()
        await this.page.setViewport({
            width : 1366,
            height : 768
        })
        await this.page.goto(url)
    }

    async getData(
        hallNumber,
        weekDay,
        options = {
            mealType : 'ramen',
            mealPeriod : mealPeriod.Launch
        }
    ) {
        let dataToReturn
        switch(hallNumber) {
            case 1 :
                dataToReturn = menus[options.mealType].map(eachPair => {
                    return {
                        menu : [eachPair[0]],
                        price : eachPair[1]
                    }
                })
                break
            case 2 :
                dataToReturn = await this.crawl(weekDay, options.mealPeriod)
                break
        }
        const resultArray = new Array()
        for(const eachRow of dataToReturn) {
            const mealSet = {
                menus : new Array(),
                price : eachRow.price
            }
            await KoconutArray
                    .from(eachRow.menu)
                    .onEach(eachMenu => new Promise(resolve => {
                        this.database.get(`
                            SELECT * FROM Food
                            WHERE name = ?
                        `,
                        [eachMenu],
                        (err, rows) => {
                            let eachMeal = {
                                name : eachMenu
                            }
                            if(rows) {
                                delete rows.id
                                delete rows.name
                                console.log(rows)
                                for(const eachRef in rows) {
                                    const stringBool = rows[eachRef]
                                    if(stringBool == "FALSE") rows[eachRef] = false
                                    else rows[eachRef] = true
                                }
                                console.log(rows)
                                eachMeal = {...eachMeal, ...rows}
                            }
                            mealSet.menus.push(eachMeal)
                            resolve()
                        })
                    }))
                    .process()
            resultArray.push(mealSet)
        }
        return resultArray
    }

    async changeMealPeriod(
        mealPeriod
    ) {
        return new Promise(async resolve => {
            if(this.currentMealPeriod != mealPeriod) {
                const inputFrame = await (await this.page.$('html > frameset > frame:nth-child(1)')).contentFrame()
                await inputFrame.select('body > form > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(4) > select', mealPeriod)
                await inputFrame.click('body > form > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(8) > input[type=button]')
                this.currentMealPeriod = mealPeriod
                setTimeout(() => {
                    resolve()
                }, 500)
            } else resolve()
        })
    }

    async crawl(
        weekDay,
        passedMealPeriod
    ) {
        await this.changeMealPeriod(passedMealPeriod)

        const tableFrame = await (await this.page.$('html > frameset > frame:nth-child(2)')).contentFrame()

        let menu = await tableFrame.evaluate((weekDay) => {
            const rst = Array.from(document.querySelectorAll(`body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(${weekDay + 2}) > td:nth-child(${weekDay == 1 ? 4 : 3}) > table > tbody > tr > td`))
            return rst.map(rst => rst.innerText).filter(eachMenu => !eachMenu.includes('included'))
        }, weekDay)
        let price = 0
        if(passedMealPeriod == mealPeriod.Launch) {
            price = menu.length == 0 ? 0 : await tableFrame.$eval(`body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(${weekDay + 2}) > td:nth-child(${weekDay == 1 ? 5 : 4})`, el => {
                return parseInt(el.innerHTML.trim())
            })
        } else {
            price = parseInt(menu[1])
            menu = menu.filter(eachMenu => isNaN(eachMenu))
        }

        return [{
            menu : menu ? menu : [],
            price : price
        }]

    }

    constructor() {
        this.database = new sqlite3.Database(`${__dirname}/AllergenFood.sqlite`, sqlite3.OPEN_READWRITE)
    }
    

}

module.exports = Crawler