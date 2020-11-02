import React from "react";

class GameController extends React.Component {
    constructor(props) {
        super();
        console.debug("GameController contructor")
    }

    render() {

        return (
            <div className="game-controls">

                <div className="input-button" id="one">1</div>
                <div className="input-button" id="two">2</div>
                <div className="input-button" id="three">3</div>

                <div className="input-button" id="four">4</div>
                <div className="input-button" id="five">5</div>
                <div className="input-button" id="six">6</div>
                <div className="input-button" id="seven">7</div>
                <div className="input-button" id="eight">8</div>
                <div className="input-button" id="nine">9</div>
                <div className="input-button" id="del">clr</div>

            </div>);
    }

}

export default GameController;