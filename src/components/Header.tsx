import React, { Component } from 'react'
import logo from "../asset/logo.jpg"

import "./Header.css"

export class HeaderComponent extends Component {
    public render(): JSX.Element {
        return (
            <header>
                <div id="title_container">
                    <a
                        id="title_box"
                        href="/">
                        <span>ALLERGY</span>
                        <img id="title_image" src={logo} alt=""></img>
                        <span>ALERT</span>
                    </a>
                </div>
                <hr id="title_divider" />
            </header>
        )
    }
}