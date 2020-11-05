import React from "react";

function renderButton(i, clickHandler) {
    return (
        <div className="input-button" onClick={() => clickHandler(i)}>{i}</div>
    )
}
function InputConsole(props) {

    return (
        <div className="controls">
            {renderButton(1, props.clickHandler)}
            {renderButton(2, props.clickHandler)}
            {renderButton(3, props.clickHandler)}
            {renderButton(4, props.clickHandler)}
            {renderButton(5, props.clickHandler)}
            {renderButton(6, props.clickHandler)}
            {renderButton(7, props.clickHandler)}
            {renderButton(8, props.clickHandler)}
            {renderButton(9, props.clickHandler)}
            {renderButton(0, props.clickHandler)}
        </div>);
}

export default InputConsole;