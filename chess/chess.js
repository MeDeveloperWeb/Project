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
}

function isvalid(e, s) {
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
    //for (j of pawns) probable_moves(j);
    //for (j of pawns) probable_moves(j);
    //for (j of pawns) probable_moves(j);
}

function pawn_moves(e) {
    let mult;
        division = parseInt(e.parentNode.parentNode.id);
        square = parseInt(e.parentNode.id);
        pawnid = e.id;
        move_white = [];
        move_black = [];
        values = [];
    //console.log(e.parentNode)

    if (j.className == 'iconw') mult = 1;
    else mult = -1;

    if (division == 102 || division == 107) {
        values.push(8 * mult);
        values.push(16 * mult);
    }
    else values.push(8 * mult);
    values.push(7 * mult);
    values.push(9 * mult);
    //console.log(values);
    for (value of values) {
            //console.log(square);
            let z = square + value;
            if ((value % 7 == 0 || value % 9 == 0) && (document.getElementById(z).parentNode.id == division + mult))
            {
                if (j.className == 'iconw') move_white.push(z);
                else move_black.push(z);
            }
            else if (value % 8 == 0) {
                if (j.className == 'iconw') move_white.push(z);
                else move_black.push(z);
            }
            //console.log(square + value)
    }
    if (j.className == 'iconw') white[pawnid] = move_white;
    else black[pawnid] = move_black;
}

function rook(e) {
    let division = e.parentNode.parentNode;
        square = parseInt(e.parentNode.id);
        pawnid = e.id;
        move_white = [];
        move_black = [];
        values = division.children;

    for (value of values) {
        let z = parseInt(value.id);
        if (z == square) continue;
        if (j.className == 'iconw') move_white.push(z);
            else move_black.push(z);
    }
    let mult = 1;
    let z = 1;
    while (z < 57) {
        z = square + (8 * mult);
        mult += 1;
        if (j.className == 'iconw') move_white.push(z);
            else move_black.push(z);
    }
    let n = 1;
    while (z > 8) {
        z = square - (8 * n);
        n += 1;
        if (j.className == 'iconw') move_white.push(z);
            else move_black.push(z);
    }
    for (i in move_black) {
        if (move_black[i] > 64 || move_black[i] < 1) move_black.splice(i, 1);
    }
    for (i in move_white) {
        if (move_white[i] > 64 || move_white[i] < 1) move_white.splice(i, 1);
    }

    if (j.className == 'iconw') white[pawnid] = move_white;
    else black[pawnid] = move_black;

}
function bishop() {
    let division = e.parentNode.parentNode.id;
        square = parseInt(e.parentNode.id);
        pawnid = e.id;
        move_white = [];
        move_black = [];
        mult = 1;
        z = 1;
    while (z < 57) {
        z = square + (7 * mult);
        mult += 1;
        if (j.className == 'iconw') move_white.push(z);
            else move_black.push(z);
    }
    let n = 1;
    while (z > 8) {
        z = square - (8 * n);
        n += 1;
        var div2 = parseInt(document.getElementById(z).parentNode.id);



        if (j.className == 'iconw') move_white.push(z);
            else move_black.push(z);
    }
    for (i in move_black) {
        if (move_black[i] > 64 || move_black[i] < 1) move_black.splice(i, 1);
    }
    for (i in move_white) {
        if (move_white[i] > 64 || move_white[i] < 1) move_white.splice(i, 1);
    }
    
    if (j.className == 'iconw') white[pawnid] = move_white;
    else black[pawnid] = move_black;
}