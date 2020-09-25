import React from 'react';
import './App.css';
import { Cell, CellDef } from './Cell.js'

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_ARROW_KEY = 38;
const DOWN_ARROW_KEY = 40;
const BACKSPACE_KEY = 8;
const DELETE_KEY = 46;

class Board extends React.Component {
    constructor(props) {
        super();
        console.debug('start Board constructor')

        // key capture on "document"
        let d = document.getRootNode();
        d.onkeydown = e => this.handleKeyDown(e, this);

        this.state = {
            cells: Array.from(Array(81), (_, i) => new CellDef(i, 0, false)),
            selected: 0,
        }
    }

    loadPuzzle(p) {
        const c = this.state.cells.slice();
        for (let i = 0; i < 81; i++) {
            // TODO: clean this up 
            const curVal = p.grid[i];
            const isClue = curVal !== 0;

            console.debug("idx: " + i + ", value: " + curVal);

            c[i].value = curVal;
            c[i].isClue = isClue;
            if (isClue && c[i].isSelected) {
                c[i].isSelected = false;
                c[i + 1].isSelected = true;
            }
        }
        this.setState({
            cells: c,
        })
    }

    componentDidMount() {
        console.debug("start componentDidMount");

        //FIXME: Obtaining puzzle has to be refactored.
        fetch("http://localhost:5984/puzzles/390f8b274853752448990987348d42a8",
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + btoa('admin:Bardop0nd')
                }
            })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log("retrieved puzzle: " + result._id + ", difficulty: " + result.n_clues);
                    //TODO: the initBoard method doesn't belong here. But one nice thing about doing this here is 
                    // that the initial board is only used once and is discarded after this (i think ... need to confirm)
                    this.loadPuzzle(result);
                    this.setState({
                        isLoaded: true,
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );

        console.debug("finish componentDidMount");
    }

    // traverse the array of cells using the confitional and increment functions 
    // passed in. 
    selectNextCell(cond, incr) {
        const grid = this.state.cells.slice();
        const curr_idx = this.state.selected;

        let i = incr(curr_idx)
        while (cond(i)) {
            if (!grid[i].isClue) {

                console.debug("index of new selected: " + i + ", previous: " + curr_idx)
                grid[curr_idx].unselect();
                grid[i].select();

                this.setState({
                    cells: grid,
                    selected: i,
                });
                break;
            }
            i = incr(i)
        }
        console.debug("unable to find next available cell");
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
        grid[idx].peers.forEach(peer => {
            let peer_val = grid[peer].value;
            if (prev_val !== 0 && peer_val === prev_val) {
                console.log(`remove conflict: idx: ${idx}, peer: ${peer} is same`);
                grid[peer].dec_conflict();
            }

            if (new_val !== 0 && peer_val === new_val) {
                console.log("add conflict: idx: " + idx + ", peer: " + grid[peer].value + " is same");
                grid[peer].add_conflict();
                grid[idx].add_conflict();
            }
        });
        grid[idx].value = new_val;
        this.setState(
            {
                cells: grid,
            }
        );
    }

    handleKeyDown(e, o) {

        let charCode = (typeof e.which == "number") ? e.which : e.keyCode;
        console.debug("charCode: " + charCode);

        // update cell value
        if ((charCode >= 49 && charCode <= 57) || charCode === BACKSPACE_KEY || charCode === DELETE_KEY) {
            // console.debug('update cell value with ' + e.key);
            // const c = o.state.cells.slice();
            // c[o.state.selected].value = (charCode === BACKSPACE_KEY || charCode === DELETE_KEY) ? null : e.key;

            // o.setState({
            //     cells: c,
            // })
            this.updateCellValue(parseInt((charCode === BACKSPACE_KEY || charCode === DELETE_KEY) ? 0 : e.key));
        } else if (charCode === LEFT_KEY) {
            this.selectNextCell(x => x >= 0, x => x - 1);
        } else if (charCode === RIGHT_KEY) {
            // move to the right cell 
            this.selectNextCell(x => x < 81, x => x + 1);
        } else if (charCode === DOWN_ARROW_KEY) {
            // move down
            this.selectNextCell(x => x <= 80, x => x + 9)
        } else if (charCode === UP_ARROW_KEY) {
            // move up 
            this.selectNextCell(x => x >= 0, x => x - 9)
        } else {
            console.log('key pressed ' + e.keyCode);
        }
    }

    renderCell(i) {
        const c = this.state.cells[i];
        return <Cell
            selected={c.isSelected}
            key={c.idx}
            value={c.value}
            isClue={c.isClue}
            num_conflicts={c.conflicts}
            clicker={() => this.updateSelected(i)}
        />
    }

    updateSelected(idx) {
        if (idx !== this.state.selected) {
            const curr_cells = this.state.cells.slice();
            if (curr_cells[idx].isClue === false) {

                curr_cells[idx].select();
                if (this.state.selected !== -1) {
                    curr_cells[this.state.selected].unselect();
                }
                this.setState({
                    selected: idx,
                    cells: curr_cells
                });
            }
        }
    }

    genRow(start_idx, num_items) {
        const row = [];

        for (let i = start_idx; i < num_items; i++) {
            row.push(this.renderCell(i))
        }
        return <div className="board-row">{row}</div>
    }

    render() {
        const { error, isLoaded } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            const puzzleSolved = this.state.cells.every(x => x.value !== 0 && x.conflicts === 0);
            let status;
            if (puzzleSolved) {
                status = "You solved the puzzle!";
            } else {
                status = "Good luck!";
            }
            return (
                <div>
                    <div className="status">{status}</div>
                    <div className="board" id="puzzle_board">
                        <div className="box-row">
                            {this.genRow(0, 9)}
                            {this.genRow(9, 18)}
                            {this.genRow(18, 27)}
                        </div>

                        {this.genRow(27, 36)}
                        {this.genRow(36, 45)}
                        {this.genRow(45, 54)}


                        {this.genRow(54, 63)}
                        {this.genRow(63, 72)}
                        {this.genRow(72, 81)}
                    </div>
                </div>
            );
        }
    }

}

export default Board;