import { Component } from "react";

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="navbar">
                <h3>Norges Nyheter</h3>
            </div>
        );
    }
}
