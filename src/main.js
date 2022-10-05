'use strict'

import { fromEvent, Subject } from 'rxjs';
import WORDS_LIST from './wordsList.json';

const rowLetters = document.getElementsByClassName('row');
const onKeyDown$ = fromEvent(document, 'keydown');
const messageText = document.getElementById('message-text');
console.log(messageText)

let boxIndex = 0;
let boxRowIndex = 0;
let userAnswers = [];

const getRandomWord = () => WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
let rightWord = getRandomWord();

console.log(rightWord)

const resultAnswer$ = new Subject();

const oberverKeyDown = {
    next: event => {
        
        const pressedKey = event.key.toUpperCase();

        if( pressedKey.length === 1 && pressedKey.match(/[a-z]/i) && boxIndex < 5 ){
            let letterBox = Array.from(rowLetters)[boxRowIndex].children[boxIndex];
            letterBox.textContent = pressedKey;
            letterBox.classList.add("letter-added");
            userAnswers.push(pressedKey);
            boxIndex++;
            messageText.classList.remove('message-error');
            messageText.classList.remove('message-success');
            messageText.textContent = ""
            
            return;
        }
        if( pressedKey === 'BACKSPACE' && boxIndex > 0) {
            
            boxIndex--;
            userAnswers.pop();
            let letterBox = Array.from(rowLetters)[boxRowIndex].children[boxIndex];
            letterBox.textContent = "";
            letterBox.classList.remove("letter-added");

            return;
        }
    },
    error: err => console.log(err)
}


const checkWord = {
    next: event => { 
       if(event.key === 'Enter'){

            if(userAnswers.join("") === rightWord){
                messageText.classList.add('message-success')
                messageText.classList.remove('message-error')
                messageText.textContent = "¡Palabra encontrada!"
                resultAnswer$.next();

                return;
            }

            if(userAnswers.length === 5){

                for(let i = 0; i < 5; i++){

                    let colorBox = "";
                    let letterBox = Array.from(rowLetters)[boxRowIndex].children[i];
                    let letterPosition = Array.from(rightWord).indexOf(userAnswers[i]);
                    let rightWordArray = Array.from(rightWord)[i];

                    console.log(rightWordArray)

                    if(letterPosition === -1){
                        colorBox = "box-error"
                    } else {
                        if(rightWordArray === userAnswers[i]){
                            colorBox = "box-success"
                        } else {
                            colorBox = "box-posible"
                        }
                    }
                    

                    letterBox.classList.remove('letter-added');
                    letterBox.classList.add(colorBox);
                }
                
                boxIndex = 0;
                boxRowIndex ++;
                userAnswers = [];

            } else {
                messageText.classList.add('message-error')
                messageText.classList.remove('message-success')
                messageText.textContent = "¡Faltan letras!"
            }
       }
    }
}

onKeyDown$.subscribe(oberverKeyDown);
onKeyDown$.subscribe(checkWord);
resultAnswer$.subscribe(value => {
    let letterRowsWinned = Array.from(rowLetters)[boxRowIndex];
    for(let i = 0; i < 5; i++){
        letterRowsWinned.children[i].classList.add('box-success');
        letterRowsWinned.children[i].classList.remove('letter-added')
        console.log(letterRowsWinned.children[i])
    }
})
