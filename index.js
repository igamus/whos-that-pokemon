#!/usr/bin/env node

const pokemon = require('./pokemon');
const colors = require('colors');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const mystery = pokemon[Math.floor(Math.random() * pokemon.length)];
const guesses = [];

printWelcome();

rl.question("\nWhat do you think? Who's that Pokemon?\n", checkAnswer);

function checkAnswer(answer) {
    answer = formatAnswer(answer);

    if (quitEvent(answer)) return rl.close();

    if(!pokemon.includes(answer)) return rl.question(`\nThat's not a real Pokemon! ${suggestions(answer)}\n`.gray + `Try again!\n\n`, checkAnswer);

    if (guesses.includes(answer)) {
        console.log("\nYou already guessed that!");
        return rl.question(`${printGuesses()}`.gray, checkAnswer);
    }

    guesses.push(answer);

    if (answer === "Pikachu") return pikachuEvent();

    if (answer === mystery) {
        console.log(`\nThat's right! It is ${mystery}. You got that in only ${guesses.length + 1} guesses! ${grade()}`);
        return rl.close();
    }

    return wrongAnswer();
}

function formatAnswer(str) {
    let formatted = str[0].toUpperCase();

    for (let i = 1; i < str.length; i++) {
        let char = str[i];
        if (char === ' ') {
            formatted += ' ' + str[i + 1].toUpperCase();
            i++;
        } else {
            formatted += char.toLowerCase();
        }
    }

    return formatted;
}

function grade() {
    if (guesses.length <= 10) {
        return "I bet you're a Pokemon master!";
    } else if (guesses.length <= 15) {
        return "You must have filled out your entire Pokedex!"
    } else if (guesses.length <= 25) {
        return "You're ready for the big leagues--the Pokemon league!"
    } else if (guesses.length <= 50) {
        return "I bet you have almost all of your gym badges!"
    } else if (guesses.length <= 100) {
        return "You must be a fierce trainer!"
    }

    return "I can't believe you're only ten-years-old!";
}

function pikachuEvent() {
    console.log("\nNot every Pokemon is Pikachu!");
    if (mystery === "Pikachu") {
        console.log(`Oh, wait, it actually was Pikachu. Congratulations, PokeMaster! You got it in only ${guesses} guesses!`);
        rl.close();
    } else {
        console.log("Try again!");
        rl.question(`${printGuesses(guesses)}`.gray, checkAnswer);
    }
}

function printGuesses() {
    return `\n(${guesses.length} ${guesses.length === 1 ? "guess" : "guesses"})\nPast Guesses: ${guesses.join(", ")}\n\n`;
}

function printPokeball() {
    console.log("     _________".red);
    console.log("    /         \\ ".red);
    console.log("   /           \\ ".red);
    console.log("   |-----O-----|".gray);
    console.log("   \\           /".white);
    console.log("    \\_________/ ".white);
}

function printWelcome(){
    console.log("\nI choose you to tell me...");
    console.log("\nWHO'S THAT POKEMON??".cyan);
    printPokeball();
}

function quitEvent(answer) {
    if (answer.toLowerCase().includes("tell")) {
        console.log("No.");
        return true;
    }

    return false;
}

function refresh() {
    console.log("\nIt's been a few guesses. Maybe you've forgotten what our mystery Pokemon looks like!");
    printPokeball();
}

function suggestions(answer) {
    let suggestions = pokemon.filter(e => e.startsWith(answer.slice(0,2)));
    return suggestions.length ? `Did you maybe mean mean ${suggestions.join("? ")}?` : "I'm not so sure what that was, to be honest... but, uh, hey--";
}

function wrongAnswer() {
    console.log("\nNot quite.");

    if (guesses.length % 5 === 0) refresh();

    console.log("\nTry again!");

    return rl.question(`${printGuesses()}`.gray, checkAnswer);
}
