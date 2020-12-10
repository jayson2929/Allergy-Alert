import axios from 'axios'
import {
    HallNumber, MealPeriod, MealType
} from "../reducers/HallNumberReducer"



export class Meal {
    menus : Array<{
        name : string,
        beef : boolean,
        buckwheat : boolean,
        chicken : boolean,
        clam : boolean,
        crab : boolean,
        dairy : boolean,
        flour : boolean,
        mackerel : boolean,
        peach : boolean,
        peanut : boolean,
        pine_nut : boolean,
        pork : boolean,
        poultry : boolean,
        shrimp : boolean,
        soybean : boolean,
        squid : boolean,
        sulfite : boolean,
        tomato : boolean,
        walnut : boolean,
    }> = new Array()
    price : number = 0
    constructor(result : any) {
        result.menus.forEach((eachMenu : any) => {
            this.menus.push(eachMenu)
        })
        this.price = result.price
    }
}

export class Communicator {

    private static instance : Communicator

    static getInstance() : Communicator {
        if(!this.instance) this.instance = new Communicator()
        return this.instance
    }

    private readonly url = "http://localhost:3200/"

    async getMeals(
        hallNumber : HallNumber = 1,
        mealType : MealType = MealType.RAMEN,
        mealPeriod : MealPeriod = MealPeriod.LAUNCH
    ) : Promise<Meal[]> {
        let day = new Date().getDay()
        if(day === 0) day = 1
        if(day === 6) day = 5
        const result = (await axios({
            method : "POST",
            url : this.url,
            data : {
                hallNumber : hallNumber,
                weekDay : day,
                options : {
                    mealType : mealType,
                    mealPeriod : mealPeriod
                }
            }
        })).data;
        return (result as Array<any>).map(eachResult => new Meal(eachResult))
    }

}