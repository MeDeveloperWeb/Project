var selector = "";
const squares = document.querySelectorAll('p:not(.win)');
const notice = document.querySelector('.notice');
const warn = document.querySelector('#check');
var counter = 0;
var pre1_sq;
var pre1_img;
var pre2_sq;
var pre2_img;
var undo_count = 0;
var attackers = [];
var attfactor;
var attsquare;
white = {};
black = {};
let capture;
var materun = 0;
var checkrun = 0;
var before = 0;
var prompiece;
var pawnimg;
var pawnsq;
var castle = { 'rb1' : 2,
            'rb2' : -3,
            'rw1' : 2,
            'rw2' : -3
};
var castle_status = true;
var passant;
var passant_status = false;
let i = 1;
for (let square of squares) {
    square.id = i.toString();
    i++;
}
click();
calculate();
console.log(Object.entries(white));
console.log(Object.entries(black));

let choices = document.querySelectorAll('.promc');

for(each of choices) {
    each.addEventListener('click', function() {
        prompiece = this;
        promote();
        });
}
for (let square of squares) {
    square.onclick = move;
    //console.log(this);
}
function click() {
    var pieces = document.querySelectorAll('img');
    for (let pawn of pieces) {
        pawn.onclick = select;
        //console.log(this);
    }
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
                    pre2_img = ini_img;
                    ini_img.remove(ini_img);
                    capture = 1;
                    console.log(this);
                    if(checkrun == 0 && materun == 0) {
                        if (this.className == 'iconw') {
                            delete white[this.id];
                        }
                        else delete black[this.id];
                        return;
                    }
            }
        }
    }
    if (((counter % 2 == 0) && this.className == "iconw") || ((counter % 2 == 1) && this.className == "iconb"))
    {
        selector = this.id;
        document.getElementById(selector).style.backgroundColor = "rgba(75, 137, 78, 0.5)";
    }
}
function move(e) {
    //console.log(e.id)
    //console.log(this.id);
    if (!e.id) {
        e = this;
        //console.log(e);
    }
    //console.log(e.altKey);
    //console.log(this);
    if (selector == '') return false;

    if (e.children.length) {
        if (materun == 0) return false;

        if (e.children[0].className[4] === selector[1]) return false;
    }
    let img = document.getElementById(selector);

    if (img.name == "king" && castle_status && materun == 0 && iscastle(e)) {
        if (aftermoves()) return true;
    }
    else if (img.name == "pawn" && passant_status && materun == 0 && en_passant(e)) {
        passant.remove(passant);
        passant_status = false;

    }
    else if (!isvalid(e, "move")) return false;
    
    pre1_sq = img.parentNode;
    e.appendChild(img);
    
    document.getElementById(selector).style.backgroundColor = "transparent";
    pre1_img = img;
    pre2_sq = e;
   // console.log(pre1_sq);
   // console.log(pre1_img);
   // console.log(pre2_sq);
    
    
        //console.log(e);
    if (capture == 1) capture = 0;
    if (materun == 0) {
        if (promotion()) {
            return true;
        }
    }
    if (aftermoves()) return true;
    return false;
}
function aftermoves() {
    if (materun == 0) selector = '';
    click();
    calculate();
    notice.style.display = "none";
    
    if (ischeck('before')) {
        undo();
        notice.style.display = "block";
        pre1_img,pre2_img = null;
        return false;
    }
    else {
        if (materun == 1) {
            undo();
            pre1_img,pre2_img = null;
            return true;
        }
        if (ischeck('after')) {
            counter += 1;
            if (checkmate()) {
                document.getElementById('board').style.pointerEvents = "none";
                let winner = document.getElementById('winner') 
                console.log(counter);
                if (counter % 2 == 1) winner.innerHTML = "White";
                else winner.innerHTML = "Black";
                document.getElementById('board').style.filter = 'blur(4px)';
                document.getElementsByClassName('mate')[0].style.display = "block";
            }
        }
        else counter += 1;
        
    }
    pre1_img,pre2_img = null;
    attackers = [];
    attfactor = 0;
    //console.log(counter)
    return true;
}
function isvalid(e, s) {
    let piece = document.getElementById(selector);
        pieceid = piece.id;
        //console.log(pieceid)
        //console.log(selector);

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

    if (before == 1) {
        if (counter % 2 == 0) value = -1;
        else value = 1;
    }

    if (s == "capture") {
        if (materun == 1) {
            if (!e.children.length) return false;
        }
        if (division2 - division1 == value) {
            if (z == 7 * value) {
                if (materun == 0 && checkrun == 1) {
                    attfactor = 7 * value;
                }
                return true;
            }
            if (z == 9 * value) {
                if (materun == 0 && checkrun == 1) {
                    attfactor = 9 * value;
                }
                return true;
            }
        }
        return false;
    }

    if (division1 == 102 || division1 == 107) {
        if (z == value * 8) return true;
        if (z == value * 16) {
            passant_status = true;
            passant = document.getElementById(selector);
            return true;
        }
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
        if(difference == item) {
            factor = item;
            break;
        }

        else{
            //console.log(item);
            let next = final - item;

            if (Math.abs(item) == 7 || Math.abs(item) == 9) {
                let div1 = document.getElementById(init.toString()).parentNode;
                    div2 = document.getElementById(final.toString()).parentNode;
                
                if (div2 == div1) continue;
                else if (init % 8 == final % 8) continue;
            }

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
    if (materun == 0 && checkrun == 1) {
        attfactor = factor;
    }

    if (check_jump(factor, final - factor, init) == true) return true;
    else return false;
    
}
function check_jump(factor, final, init) {
    if(init == final) return true;

    if (document.getElementById(final.toString()).children.length) return false;
    else if (check_jump(factor, final - factor, init)) return true;

}
function calculate() {
    let pawns = document.getElementsByName("pawn");
        rooks = document.getElementsByName("rook");
        knights = document.getElementsByName("knight");
        bishops = document.getElementsByName("bishop");
        queens = document.getElementsByName("queen");
        kings = document.getElementsByName("king");

    for (j of pawns) pawn_moves(j);
    for (j of rooks) rook(j);
    for (j of kings) king(j);
    for (j of bishops) bishop(j);
    for (j of knights) knight(j);
    for (j of queens) queen(j);
    
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
            if (z > 64 || z < 1) continue;
            if ((value % 7 == 0 || value % 9 == 0) && (document.getElementById(z).parentNode.id == division + mult))
            {
                if (e.className == 'iconw') move_white.push(z);
                else move_black.push(z);
            }
            else if (value % 8 == 0) {
                if (j.className == 'iconw') move_white.push(z);
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

    
    if (castle_status) {
        if (e.className == 'iconw') {
            if (e.id == 'rw1') {
                if (square != 1) {
                    if (castle['rw1']) delete castle['rw1'];
                }
            }
            else if (e.id == 'rw2') {
                    if (square != 8) {
                        if (castle['rw2']) delete castle['rw2'];
                    }
            }
        }
        else {
            if (e.id == 'rb1') {
                if (square != 57) {
                    if (castle['rb1']) delete castle['rb1'];
                }
            }
            else if (e.id == 'rb2') {
                    if (square != 64) {
                        if (castle['rb2']) delete castle['rb2'];
                    }
            }
        }
    }

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
            mult = 1;
            continue;
        }
        if(z < 1) break;

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
    if (castle_status) {
        if (e.className == 'iconw') {
            if (square != 4) {
                if (castle['rw1']) delete castle['rw1'];
                if (castle['rw2']) delete castle['rw2'];
            }
        }
        else {
            if (square != 60) {
                if (castle['rb1']) delete castle['rb1'];
                if (castle['rb2']) delete castle['rb2'];
            } 
        }
        if (Object.keys(castle).length == 0) castle_status = false;
    }
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
function ischeck(time, sq, arr) {
    checkrun = 1;
    let piece_arr;
    let king_sq;
    if (time == 'before') {
        if (counter % 2 == 0) {
            king_sq = document.getElementById('kw').parentNode.id;
            piece_arr = black;
        }
        else {
            king_sq = document.getElementById('kb').parentNode.id;
            piece_arr = white;
        }
        before = 1;
    }
    else if (time == 'after') {
        if (counter % 2 == 0) {
            king_sq = document.getElementById('kb').parentNode.id;
            piece_arr = white;
        }
        else {
            king_sq = document.getElementById('kw').parentNode.id;
            piece_arr = black;
        }
    }
    else {
        king_sq = sq;
        piece_arr = arr;
    }

    //king_sq = parseInt(king_sq);
    //console.log(king_sq);
    //console.log(piece_arr);

    for (values of Object.entries(piece_arr)) {
        for (val of values[1]) {
            if (val == king_sq) {
                //console.log('yes');
                //console.log(values[0]);
                selector = values[0];
                
                let s = "capture";
                if (!document.getElementById(king_sq).children.length && values[0][0] == 'p') s = 'move';
                
                if (isvalid(document.getElementById(king_sq), s)) {
                    console.log("check")
                    selector = '';
                    if (time == 'after') {
                        attackers.push(values[0]);
                        attsquare = parseInt(document.getElementById(values[0]).parentNode.id);
                    }
                    else {
                        checkrun = 0;
                        before = 0;
                        return true;
                    }

                }
                else {
                    selector = '';
                }
            }
        
        }
    }
    checkrun = 0;
    before = 0;
    if (attackers.length > 0 && time != "none" && materun == 0) return true;
    console.log(king_sq);
    return false;
}
function undo() {
    pre1_sq.appendChild(pre1_img);
    if (pre2_img != null && materun == 0) {
        pre2_sq.appendChild(pre2_img);
    }
    undo_count += 1;
    calculate();
}
function checkmate() {
    materun = 1;
    let king_sq;
    let king_arr;
    let temp;
    if (counter % 2 == 1) {
        king_sq = document.getElementById('kb').parentNode.id;
        king_arr = black['kb'];
        temp = 'kb';
    }
    else {
        king_sq = document.getElementById('kw').parentNode.id;
        king_arr = white['kw'];
        temp ='kw';
    }

    for (val of king_arr) {
        selector = temp;
        let sq = document.getElementById(val);
        let init = undo_count;
        if (move(sq)) {
            materun = 0;
            return false;
        }
    }
    console.log(attfactor)
    console.log(attackers)
    if (attackers.length != 1) {
        materun = 0;
        return true;
    }
    let danger = [];

    if (attackers[0][0] == 'n') {
        let nsq = document.getElementById(attackers[0]).parentNode.id;
        danger.push(parseInt(nsq))
    }
    else {
        let i = 0;
        while (true) {
            let insert = attsquare + (attfactor * i);
            if (insert == king_sq) {
                break;
            }
            danger.push(insert);
            i++;
        }
    }
    for (val of danger) {
        let arr;
        if (attackers[0][1] == 'w') {
            arr = {...black};
            delete arr['kb'];
        }
        else { 
        arr = {...white};
        delete arr['kw'];
        }
        
        
        if (ischeck("none", val, arr)) {
            materun = 0;
            return false;
        }
    }
    console.log(attfactor)
    console.log(attackers)
    console.log(attsquare)
    console.log(danger)
    materun = 0;
    return true;
}
function promotion() {
    let divisions = document.getElementsByClassName('start');
    
    for (div of divisions) {
        for (sq of div.children) {
            for (img of sq.children) {
                if (img.name == "pawn") {
                    document.getElementsByClassName('promotion')[0].style.display = 'block';

                    if (div.id == '101') {
                        let pieces = document.getElementsByClassName('choice');
                        for (each of pieces) {
                            each.children[0].style.filter = 'invert(1)';
                        }
                    }
                    pawnimg = img;
                    pawnsq = sq;
                    return true;
                }
            }
        }
    }
    return false;
}
function promote() {
    let oldid = prompiece.id + img.className[4] + 1;
    let piececount = 1;
    for (items of document.getElementsByName(prompiece.title.toLowerCase())) {
        if (items.className[4] == oldid[1]) {
            piececount += 1;
        }
    }
    let newid = oldid.slice(0, 2) + piececount;
    let newimg = document.getElementById(oldid).cloneNode();
    newimg.id = newid;
    pawnimg.remove(pawnimg);
    pawnsq.appendChild(newimg);
    document.getElementsByClassName('promotion')[0].style.display = 'none';
    aftermoves();
}
function iscastle(e) {
    let king_sq = parseInt(document.getElementById(selector).parentNode.id);
    let move_sq = parseInt(e.id);
    let diff = move_sq - king_sq;
    let rook_num;
    if (Math.abs(diff) != 2) return false;
    if (diff > 0) rook_num = 2;
    else rook_num = 1;

    let rook_id = 'r' + selector[1] + rook_num;

    if (!castle[rook_id]) return false;

    let arr;
    
    if (selector[1] == 'w') arr = black;
    else arr = white;

    for (let k = king_sq + (diff / 2); k <= king_sq + diff; k *= 2) {
        if (ischeck('none', k, arr)) return false;
        if (document.getElementById(k.toString()).children.length) return false;
    }
    let rook_img = document.getElementById(rook_id);
    let king_img = document.getElementById(selector);

    let rook_sq = parseInt(rook_img.parentNode.id);

    let new_sq = rook_sq + castle[rook_id];

    e.appendChild(king_img);
    document.getElementById(new_sq).appendChild(rook_img);
    return true;
}
function en_passant(e) {
    let value;
    if (!passant.parentNode) return false;
    let div1 = parseInt(passant.parentNode.parentNode.id);
    let div2 = parseInt(document.getElementById(selector).parentNode.parentNode.id);
    let div3 = parseInt(e.parentNode.id);
    
    if (div1 != div2 || Math.abs(div2 - div3) != 1) return false;

    let sq1 = parseInt(passant.parentNode.id);
    let sq2 = parseInt(document.getElementById(selector).parentNode.id);
    let sq3 = parseInt(e.id);
    
    let diff = sq1 - sq2;
    let movediff = sq3 - sq2;
    if (Math.abs(diff) != 1 || sq1 % 8 != sq3 % 8) return false;

    if (passant.className[4] == 'w') {
        if (diff > 0) value = -7;
        else value = -9;
    }
    else {
        if (diff > 0) value = 9;
        else value = 7;
    }
    if (movediff == value) return true;
    return false;

}
function back() {
    document.getElementById('board').style.filter = 'none';
    document.getElementsByClassName('mate')[0].style.display = "none";
}