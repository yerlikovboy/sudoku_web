import React from "react";
import Board from "./Board"
import { CellDef } from "./Cell.js";

import "./css/Board.css";

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_ARROW_KEY = 38;
const DOWN_ARROW_KEY = 40;
const BACKSPACE_KEY = 8;
const DELETE_KEY = 46;

export default class Game extends React.Component {

    constructor(props) {
        super();
        console.debug("Game constructor start. Puzzle: " + JSON.stringify(props.puzzle));
        const d = document.getRootNode();
        d.onkeydown = (e) => this.handleKeyDown(e);

        const c = Array.from(Array(81), (_, i) => new CellDef(i, 0, false));

        let selected_idx = 0;

        if (typeof props.puzzle !== 'undefined') {
            console.log(`puzzle id: ${props.puzzle._id}`);
            const p = props.puzzle;
            for (let i = 0; i < 81; i++) {
                // TODO: clean this up
                const curVal = p.grid[i];
                const isClue = curVal !== 0;

                c[i].value = curVal;
                c[i].isClue = isClue;
                if (isClue && c[i].isSelected) {
                    c[i].isSelected = false;
                    selected_idx = selected_idx + 1;
                    c[selected_idx].isSelected = true;
                }
            }
        }

        this.state = {
            cells: c,
            selected: selected_idx,
        }
        console.debug("Game constructor end");

    }

    handleKeyDown(e, o) {
        let charCode = typeof e.which == "number" ? e.which : e.keyCode;
        console.debug("charCode: " + charCode);

        // update cell value
        if (
            (charCode >= 49 && charCode <= 57) ||
            charCode === BACKSPACE_KEY ||
            charCode === DELETE_KEY
        ) {
            this.updateCellValue(
                parseInt(
                    charCode === BACKSPACE_KEY || charCode === DELETE_KEY ? 0 : e.key
                )
            );
        } else if (charCode === LEFT_KEY) {
            this.selectNextCell(
                (x) => x >= 0,
                (x) => x - 1
            );
        } else if (charCode === RIGHT_KEY) {
            // move to the right cell
            this.selectNextCell(
                (x) => x < 81,
                (x) => x + 1
            );
        } else if (charCode === DOWN_ARROW_KEY) {
            // move down
            this.selectNextCell(
                (x) => x <= 80,
                (x) => x + 9
            );
        } else if (charCode === UP_ARROW_KEY) {
            // move up
            this.selectNextCell(
                (x) => x >= 0,
                (x) => x - 9
            );
        } else {
            console.log("key pressed " + e.keyCode);
        }
    }

    updateCellValue(new_val) {
        let idx = this.state.selected;
        const grid = this.state.cells.slice();

        let prev_val = grid[idx].value;
        console.log(`idx: ${idx}, prev_val: ${prev_val}, new_val: ${new_val}`);

        if (new_val === prev_val) {
            console.debug("no new update (new value same as old value");
            return;
        }

        grid[idx].reset_conflict();
        grid[idx].peers.forEach((peer) => {
            let peer_val = grid[peer].value;
            if (prev_val !== 0 && peer_val === prev_val) {
                console.log(`remove conflict: idx: ${idx}, peer: ${peer} is same`);
                grid[peer].dec_conflict();
            }

            if (new_val !== 0 && peer_val === new_val) {
                console.log(
                    "add conflict: idx: " +
                    idx +
                    ", peer: " +
                    grid[peer].value +
                    " is same"
                );
                grid[peer].add_conflict();
                grid[idx].add_conflict();
            }
        });
        grid[idx].value = new_val;
        this.setState({
            cells: grid,
        });
    }

    selectNextCell(cond, incr) {
        const grid = this.state.cells.slice();
        const curr_idx = this.state.selected;

        let i = incr(curr_idx);
        while (cond(i)) {
            if (!grid[i].isClue) {
                console.debug(
                    "index of new selected: " + i + ", previous: " + curr_idx
                );
                grid[curr_idx].unselect();
                grid[i].select();

                this.setState({
                    cells: grid,
                    selected: i,
                });
                break;
            }
            i = incr(i);
        }
        console.debug("unable to find next available cell");
    }

    handleClick(i) {
        if (i !== this.state.selected) {
            const curr_cells = this.state.cells.slice();
            if (curr_cells[i].isClue === false) {
                curr_cells[i].select();
                if (this.state.selected !== -1) {
                    curr_cells[this.state.selected].unselect();
                }
                this.setState({
                    selected: i,
                    cells: curr_cells,
                });
            }
        }
    }

    render() {
        return (
            <div>
                <Board
                    cells={this.state.cells}
                    selected={this.state.selected_idx}
                    clickHandler={(i) => this.handleClick(i)}
                />
            </div>
        );
    }
}