var key, text, output, choice, field;

function show_more(id){
    var element = document.getElementById(id).style;
    if(element.display == "none" || element.display == "") element.display = "inline";
    else element.display = "none";
}
document.querySelector('select').onchange = function(){
    let e = document.querySelector('select');
    choice = e.options[e.selectedIndex].value;
    field = document.querySelector('#key');
    if(choice == "caesar")
    {
        field.type = "number";
    }
    else
    {
        field.type = "text";
    }
    document.querySelector('.key').style.display = "block";
}
document.querySelector('#subkey').onclick = function(){
    key = document.querySelector('#key').value;
    text = document.querySelector('#user').value;
    if(choice == "caesar")
    {
        key %= 26;
        key += 26;
        caesar();
    }
    else substitution();
    //console.log(text);
}
document.querySelector('#random').onclick = function random_key() {
    var cipher;
    if(choice == "caesar")
    {
        cipher = Math.floor((Math.random() * 25) + 1);
    }
    else
    {
        cipher = "";
        for (let n = 0; n < 26; n++)
        {
            let num = Math.floor((Math.random() * 25));
            cipher += String.fromCharCode(97 + num);
        }
    }
    field.value = cipher;
}
function caesar() {
    output = "";
    //console.log(key,text);
    for (let character of text)
    {
        var char = character.charCodeAt(0)
        //console.log(char);
        if ( char >= 65 && char <= 90)
        {
            if ( char + key <= 90)
            {
                char += key;
                console.log(char);
            }
            else
            {
                char = 65 + key - 1 + char - 90 ;
            }
        }
        else if ( char >= 97 && char <= 122 )
        {
            if (char + key <= 122)
            {
                char += key ;
                console.log(char);
            }
            else
            {
                char = 97 + key - 1 + char - 122 ;
            }
        }
        output += String.fromCharCode(char);
        //console.log(character);

    }
    //console.log(output);
    document.querySelector('#output').value = output;
}
function substitution() {
    output = "";
    var dict = {};
    for (let n = 0; n < key.length; n++)
    {
        dict[String.fromCharCode(97 + n)] = key[n].toLowerCase();
    }
    for (var char of text)
    {
        if(char.charCodeAt(0) >= 97 && char.charCodeAt(0) <= 122)
        {
            output += dict[char];
        }
        else if(char.charCodeAt(0) >= 65 && char.charCodeAt(0) <= 90)
        {
            output += dict[char.toLowerCase()].toUpperCase();
        }
        else output += char;
    }
    document.querySelector('#output').value = output;
}