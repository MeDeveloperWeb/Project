var selector = "";
const pieces = document.querySelectorAll('img');
const squares = document.querySelectorAll('p');
var counter = 0;
white = {};
black = {};
let capture;

let i = 1;
for (let square of squares) {
    square.id = i.toString();
    i++;
}

calculate();
console.log(Object.entries(white));
console.log(Object.entries(black));

for (let pawn of pieces) {
    pawn.onclick = select;
}

for (let square of squares) {
    square.onclick = move;
}

function select() {
    if (selector != "") {
        let x = document.getElementById(selector).className;
            y = document.getElementById(this.id).className; 
        if (x == y) {
            document.getElementById(selector).style.backgroundColor = "transparent";
        }
        else {
            if (isvalid(this.parentNode, "capture")) {
                    let ini_img = document.getElementById(this.id);
                    ini_img.remove(ini_img);
                    capture = 1;
                    return;
            }
        }
    }
    if (((counter % 2 == 0) && this.className == "iconw") || ((counter % 2 == 1) && this.className == "iconb"))
    {
        selector = this.id;
        document.getElementById(selector).style.backgroundColor = "rgba(75, 137, 78, 0.5)";
    }
}

function move() {
    if (selector == '' || this.children.length) return;
    //get_moves()
    //isvalid(this)
    if (!isvalid(this, "move")) return;
    //console.log(this.id)

    let img = document.getElementById(selector);
    this.appendChild(img);
    
    document.getElementById(selector).style.backgroundColor = "transparent";
    selector = '';
    counter += 1;
        //console.log(move_list[value])
    if (capture == 1) capture = 0;
    calculate();
    console.log(Object.entries(white));
    console.log(Object.entries(black));

}
function isvalid(e, s) {
    let piece = document.getElementById(selector);
        pieceid = piece.id;
        //console.log(pieceid)

    if(piece.name == "pawn") {
        if(isvalid_pawn(e, s)) return true;
        else return false;
    }
    else if (piece.name == "knight" || piece.name == "king") {
        if (piece.className == 'iconw') {
            for (val of white[pieceid]) {
                if (val == e.id) return true;
            }
            return false;
        }
        else if (piece.className == 'iconb') {
            for (val of black[pieceid]) {
                //console.log(val);
                //console.log(e.id)
                if (val == e.id) return true;
            }
            return false;
        }
    }
    else {
        if (isvalid_pieces(e)) return true;
        else return false;
    }

}
function isvalid_pawn(e, s) {
    let square = document.getElementById(selector).parentNode;
        division1 = parseInt(square.parentNode.id);
        division2 = parseInt(e.parentNode.id);
        x = parseInt(square.id);
        y = parseInt(e.id);
        z = y - x;
        value = 0;

    if (counter % 2 == 0) value = 1;
    else value = -1;

    if (s == "capture") {
        if ((z == 7 * value || z == 9 * value) && division2 - division1 == value) return true;
        else return false;
    }

    if (division1 == 102 || division1 == 107) {
        if (z == value * 8 || z == value * 16) return true;
    }
    if (z == 8 * value) return true;
    else if ((z == 7 * value || z == 9 * value) && division2 - division1 == value && capture == 1) return true;
    else return false;
}

function isvalid_pieces(e) {
    let piece = document.getElementById(selector);
        pieceid = piece.id;

    if (piece.className == 'iconw') {
        for (val of white[pieceid]) {
            if (val == parseInt(e.id)) var count = 1;
        }
        if(count != 1) return false;
    }
    else if (piece.className == 'iconb') {
        for (val of black[pieceid]) {
            if (val == parseInt(e.id)) var count = 1;
        }
        if(count != 1) return false;
    }
    let factor;
    let mult;
        init = parseInt(piece.parentNode.id);
        final = parseInt(e.id);
        difference = final - init;
        arr = [];
    if (difference < 0) mult = -1;
    else mult = 1;

    if(piece.name == "rook") arr = [1, 8];
    else if (piece.name == "bishop") arr = [7, 9];
    else if (piece.name == "queen") arr = [1, 7, 8, 9];

    for (item of arr) {
        item *= mult;
        if(difference == item) factor = item;

        else{
            //console.log(item);
            let next = final - item;

            if (piece.className == 'iconw') {
                for (val of white[pieceid]) {
                    if (val == next) factor = item;
                }
            }
            else if (piece.className == 'iconb') {
                for (val of black[pieceid]) {
                    if (val == next) factor = item;
                }
            }
        }
    }

    if (check_jump(factor, final - factor, init) == true) return true;
    else return false;
    
}
function check_jump(factor, final, init) {
    if(init == final) return true;

    if (document.getElementById(final.toString()).children.length) return false;
    else if (check_jump(factor, final - factor, init)) return;
    
}
















function calculate() {
    var pawns = document.getElementsByName("pawn");
        rooks = document.getElementsByName("rook");
        knights = document.getElementsByName("knight");
        bishops = document.getElementsByName("bishop");
        queens = document.getElementsByName("queen");
        kings = document.getElementsByName("king");

    for (j of pawns) pawn_moves(j);
    for (j of rooks) rook(j);
    for (j of bishops) bishop(j);
    for (j of knights) knight(j);
    for (j of queens) queen(j);
    for (j of kings) king(j);
}
function pawn_moves(e) {
    let mult;
        division = parseInt(e.parentNode.parentNode.id);
        square = parseInt(e.parentNode.id);
        pieceid= e.id;
        move_white = [];
        move_black = [];
        values = [];

    if (e.className == 'iconw') mult = 1;
    else mult = -1;

    if (division == 102 || division == 107) {
        values.push(8 * mult);
        values.push(16 * mult);
    }
    else values.push(8 * mult);
    values.push(7 * mult);
    values.push(9 * mult);

    for (value of values) {
            let z = square + value;
            if ((value % 7 == 0 || value % 9 == 0) && (document.getElementById(z).parentNode.id == division + mult))
            {
                if (e.className == 'iconw') move_white.push(z);
                else move_black.push(z);
            }
            else if (value % 8 == 0) {
                if (e.className == 'iconw') move_white.push(z);
                else move_black.push(z);
            }

    }
    if (e.className == 'iconw') white[pieceid] = move_white;
    else black[pieceid] = move_black;
}
function rook(e) {
    let division = e.parentNode.parentNode;
        square = parseInt(e.parentNode.id);
        pieceid= e.id;
        move_white = [];
        move_black = [];
        values = division.children;

    for (value of values) {
        let z = parseInt(value.id);
        if (z == square) continue;
        if (e.className == 'iconw') move_white.push(z);
        else move_black.push(z);
    }
    let mult = 1;
        next = 8;
    while (true) {
        let z = square + (next * mult);

        if(z > 64) {
            next = -8;
            continue;
        }
        else if(z < 1) break;

        if (e.className == 'iconw') move_white.push(z);
        else move_black.push(z);

        mult += 1;
    }

    if (e.className == 'iconw') white[pieceid] = move_white;
    else black[pieceid] = move_black;

}
function bishop(e) {
    let div1 = parseInt(e.parentNode.parentNode.id);
    let div2;
        square = parseInt(e.parentNode.id);
        pieceid = e.id;
        move_white = [];
        move_black = [];
        mult = 1;
        next = 7;

    while (true) {
        let z = square + (next * mult);
        
        if(z > 64) {
            mult = 1;
            if(next == 7) {
                next = 9;
                continue;
            }
            else {
                next = -7;
                continue;
            }
        }
        else if(z < 1) {
            mult = 1;
            if(next == -7) {
                next = -9;
                continue;
            }
            else break;
        }
        
        div2 = parseInt(document.getElementById(z.toString()).parentNode.id);

        if (Math.abs(div2 - div1) == mult) {
            //console.log(z);
            if (e.className == 'iconw') move_white.push(z);
            else move_black.push(z);
        }

        mult += 1;
    }
    if (e.className == 'iconw') white[pieceid] = move_white;
    else black[pieceid] = move_black;
}
function knight(e) {
    let square = parseInt(e.parentNode.id);
    let col2;
        col1 = square % 8;
        pieceid = e.id;
        move_white = [];
        move_black = [];
        next = 17;

    if (col1 == 0) col1 = 8;

    while (true) {
        z = square + next;

        col2 = z % 8;
        if (col2 == 0) col2 = 8;

        if ((Math.abs(col2 - col1) == 1 || Math.abs(col2 - col1) == 2) && z < 65 && z > 0) {
            //console.log(z);
            if (e.className == 'iconw') move_white.push(z);
            else move_black.push(z);
        }

        if(next == 17) next = -17;
        else if(next == -17) next = 15;
        else if(next == 15) next = -15;
        else if(next == -15) next = 6;
        else if(next == 6) next = -6;
        else if(next == -6) next = 10;
        else if(next == 10) next = -10;
        else break;
    }
    if (e.className == 'iconw') white[pieceid] = move_white;
    else black[pieceid] = move_black;
}
function queen(e) {
    let pieceid = e.id;
    move_white = [];
    move_black = [];
    rook(e);
    let w1 = white[pieceid];
    let b1 = black[pieceid];
    bishop(e);
    let w2 = white[pieceid];
    let b2 = black[pieceid];

    if (e.className == 'iconw') move_white = w1.concat(w2);
    else move_black = b1.concat(b2); 
    //console.log(move_black);
    //console.log(move_white);
    if (e.className == 'iconw') white[pieceid] = move_white;
    else black[pieceid] = move_black;
}
function king(e) {
    let square = parseInt(e.parentNode.id);
    let col2;
        col1 = square % 8;
        pieceid = e.id;
        move_white = [];
        move_black = [];
        next = 8;

    if (col1 == 0) col1 = 8;

    while (true) {
        z = square + next;

        col2 = z % 8;
        if (col2 == 0) col2 = 8;

        if (Math.abs(col2 - col1) < 2 && z < 65 && z > 0) {
            //console.log(z);
            if (e.className == 'iconw') move_white.push(z);
            else move_black.push(z);
        }

        if(next == 8) next = -8;
        else if(next == -8) next = 7;
        else if(next == 7) next = -7;
        else if(next == -7) next = 1;
        else if(next == 1) next = -1;
        else if(next == -1) next = 9;
        else if(next == 9) next = -9;
        else break;
    }
    if (e.className == 'iconw') white[pieceid] = move_white;
    else black[pieceid] = move_black;
}