import React, { Component } from 'react'
import { Meal } from '../data/Communicator'
import {
    HallNumber, MealPeriod, MealType
} from "../reducers/HallNumberReducer"
import "./Contents.css"
import {
    LinearProgress
} from "@material-ui/core"

import eggIcon from "../asset/Egg.png"
import fishIcon from "../asset/Fish.png"
import milkIcon from "../asset/Milk.png"
import nutIcon from "../asset/Nut.png"
import peanutIcon from "../asset/Peanut.png"
import seafoodIcon from "../asset/Seafood.png"

interface ContentsProps {
    onMealTypeChanged: (mealType: MealType) => void | Promise<void>,
    onMealPeriodChanged: (mealPeriod: MealPeriod) => void | Promise<void>,
    currentHallNumber: HallNumber,
    currentMealType: MealType,
    currentMealPeriod: MealPeriod,
    currentMeals: Meal[]
}

enum OptionClass {
    ACTIVATED = "active",
    DEACTIVATED = "deactive"
}

export class ContentsComponent extends Component<ContentsProps> {

    private englishToKorean(eng: string): string {
        switch (eng) {
            case MealType.RAMEN: return "라면"
            case MealType.WESTERN: return "양식"
            case MealType.SNACK: return "스낵"
            case MealType.KOREAN: return "한식"
            case MealType.JAPANESE: return "일식"
            case MealType.CHINESE: return "중식"
            case MealPeriod.LAUNCH: return "점심"
            case MealPeriod.LAUNCH_COURSE: return "일품(중식)"
        }
        return eng
    }
    private getOptionTable(): JSX.Element {
        let tableBody: JSX.Element
        if (this.props.currentHallNumber === HallNumber.HALL_1) {
            const mealTypeList = Object.values(MealType)
            tableBody = <tbody>
                <tr>
                    {
                        mealTypeList.slice(0, 3).map(eachMealType => <td
                            key={eachMealType}
                            className={this.props.currentMealType === eachMealType ? OptionClass.ACTIVATED : OptionClass.DEACTIVATED}
                            onClick={async (event) => {
                                if ((event.target as any).className === OptionClass.ACTIVATED) return
                                this.props.onMealTypeChanged(eachMealType)
                            }}>
                            {this.englishToKorean(eachMealType)}
                        </td>)
                    }
                </tr>
                <tr>
                    {
                        mealTypeList.slice(3, 6).map(eachMealType => <td
                            key={eachMealType}
                            className={this.props.currentMealType === eachMealType ? OptionClass.ACTIVATED : OptionClass.DEACTIVATED}
                            onClick={async (event) => {
                                if ((event.target as any).className === OptionClass.ACTIVATED) return
                                this.props.onMealTypeChanged(eachMealType)
                            }}>
                            {this.englishToKorean(eachMealType)}
                        </td>)
                    }
                </tr>
            </tbody>
        } else {
            tableBody = <tbody>
                <tr>
                    {
                        Object.values(MealPeriod).map(eachMealPeriod => <td
                            key={eachMealPeriod}
                            className={this.props.currentMealPeriod === eachMealPeriod ? OptionClass.ACTIVATED : OptionClass.DEACTIVATED}
                            onClick={async (event) => {
                                if ((event.target as any).className === OptionClass.ACTIVATED) return
                                this.props.onMealPeriodChanged(eachMealPeriod)
                            }}>
                            {this.englishToKorean(eachMealPeriod)}
                        </td>)
                    }
                </tr>
            </tbody>
        }
        return (
            <table id="option_table">
                {tableBody}
            </table>
        )
    }

    private getIconSetFromMeal(meal : Meal) : JSX.Element | null {
        const iconSet = new Set<string>()
        meal.menus.forEach(eachMenu => {
            if(eachMenu.poultry) iconSet.add(eggIcon)
            if(eachMenu.mackerel) iconSet.add(fishIcon)
            if(eachMenu.dairy) iconSet.add(milkIcon)
            if(eachMenu.pine_nut
                || eachMenu.walnut
                || eachMenu.soybean
                || eachMenu.buckwheat
            ) iconSet.add(nutIcon)
            if(eachMenu.peanut) iconSet.add(peanutIcon)
            if(eachMenu.squid
                || eachMenu.shrimp
                || eachMenu.clam
                || eachMenu.crab
            ) iconSet.add(seafoodIcon)
        })
        //if(iconSet.size == 0) return null
        return (
            <div className="meal_icon_container">
                {
                    Array
                    .from(iconSet)
                    .map(eachIcon => 
                        <img key={eachIcon} className="meal_icon" src = {eachIcon} alt =""></img>
                    )
                }
            </div>
        )
        // return iconSet
    }

    private getMeals(): JSX.Element {
        if (this.props.currentMeals.length === 0) return <LinearProgress />
        return (
            <div>
                {
                    Array.from(this.props.currentMeals.entries()).map(eachPair => {
                        const [key, meal] : [number, Meal] = eachPair
                        const name = meal.menus.map(eachMenu => eachMenu.name).join(', ')
                        return (
                            <div className="meal_container" key = {`meal_${key}`}>
                                    <span className="meal_menu">
                                        {name}
                                    </span>
                                    {this.getIconSetFromMeal(meal)}

                                    <div className="meal_price">{meal.price}</div>

                            </div>
                        )
                    })
                }
            </div>
        )
    }

    render(): JSX.Element {
        return (
            <div id="contents_container">
                <div id="contents_box">
                    <h2>오늘 주의해야 할 음식은?</h2>
                    <h1>제 {this.props.currentHallNumber} 학생회관</h1>
                    {this.getOptionTable()}
                    {this.getMeals()}
                </div>
            </div>
        )
    }
}
