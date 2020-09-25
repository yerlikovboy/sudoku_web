import React from 'react';

function row_from_idx(idx) {
    return Math.floor(idx / 9);
}

function col_from_idx(idx) {
    return idx % 9;
}

function peers(idx) {
    let p = [];
    // add peers in same column 
    let col_offset = idx % 9;
    for (let c = 0; c < 9; c++) {
        let peer = c * 9 + col_offset;
        if (idx !== peer) {
            p.push(peer)
        }
    }
    // add peers in same row 
    let row_start = idx - (idx % 9);
    let row_end = row_start + 9
    for (let r = row_start; r < row_end; r++) {
        if (r !== idx) {
            p.push(r);
        }
    }

    //add remaining peers in the same block
    let block_row = Math.floor(row_from_idx(idx) / 3) * 3
    let block_col = Math.floor(col_from_idx(idx) / 3) * 3

    for (let i = 0; i < 3; i++) {
        let row_offset = (block_row + i) * 9;
        for (let j = 0; j < 3; j++) {
            let col_offset = block_col + j;
            let peer_idx = row_offset + col_offset;
            if (peer_idx !== idx && !p.some(x => x === peer_idx)) {
                p.push(peer_idx);
            }
        }
    }
    return p;
}

export class CellDef {
    idx = -1;
    isSelected = false;
    value = -1;
    isClue = false;
    conflicts = 0;
    peers = null;

    constructor(idx, value, isClue) {
        this.idx = idx;
        this.isSelected = idx === 0 ? true : false;
        this.value = value;
        this.isClue = isClue;
        this.conflicts = 0;
        this.peers = peers(idx);
    }


    select() {
        this.isSelected = true;
    }

    unselect() {
        this.isSelected = false;
    }

    setValue(v) {
        this.value = v;
    }

    clearValue() {
        this.value = null;
    }

    add_conflict() {
        this.conflicts = this.conflicts + 1;
    }

    dec_conflict() {
        if (this.conflicts > 0) {
            this.conflicts = this.conflicts - 1;
        }
    }

    reset_conflict() {
        this.conflicts = 0;
    }
}

export function Cell(props) {
    const classes = ['cell'];

    if (props.selected) {
        classes.push("selected");
    }
    if (props.num_conflicts !== 0) {
        classes.push("conflict");
    }

    if (props.isClue) {
        classes.push("clue");
    } 
    return (
        <div
            className={classes.join(' ')}
            onClick={props.clicker}
        >
            {props.value === 0 ? '' : props.value}
        </div>
    )
}