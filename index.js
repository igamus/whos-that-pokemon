#!/usr/bin/env node

const pokedex = require('./pokemon');
const colors = require('colors');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const selectedRegions = [];
const validRegions = [
    'Kanto',
    'Johto',
    'Hoenn',
    'Sinnoh',
    'Unova',
    'Kalos',
    'Alola',
    'Galar',
    'Palada'
];

const pokemon = [];
let mystery;

const guesses = [];

selectRegion();

function selectRegion() {
    return rl.question(`
Select a region:

Kanto  | Johto | Hoenn
Sinnoh | Unova | Kalos
Alola  | Galar | Palada

... or are you a master in all regions?\n
${selectedRegions.length > 0 ? `Selected regions: ${selectedRegions.join(', ')}\n\n`.gray : ''}`, acceptRegions);
}

function acceptRegions(answer) {
    answer = formatAnswer(answer);

    if (selectedRegions.includes(answer)) {
        console.log(`\nYou have already selected ${answer}.`);
        return selectRegion();
    }

    if (answer.toLowerCase().includes('all')) {
        for (let region of validRegions) {
            if (!selectedRegions.includes(region)) selectedRegions.push(region);
        }

        return processPokemon();
    }

    if (!validRegions.includes(answer)) {
        console.log("\nPlease select one valid region (or enter 'all' for all regions).")
        return selectRegion();
    }

    selectedRegions.push(answer);
    return rl.question(`\nYou have selected ${answer}! Would you like to add another region? ${"(Yes/No)".gray}\n`, finalizeRegion);
}

function finalizeRegion(answer) {
    answer = answer.slice(0,1).toLowerCase();

    if (answer === 'y') return selectRegion();
    else if (answer === 'n') return processPokemon();
    else return rl.question(`\nInput a valid selection.\n${"(Yes/No)".gray}\n`, finalizeRegion)
}

function processPokemon() {
    for (let region of selectedRegions) {
        pokemon.push(...pokedex[region])
    }

    mystery = pokemon[Math.floor(Math.random() * pokemon.length)];

    printWelcome();
}

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
        console.log(`Oh, wait, it actually was Pikachu. Congratulations, PokeMaster! You got it in only ${guesses.length} guesses!`);
        rl.close();
    } else {
        console.log("Try again!");
        rl.question(`${printGuesses()}`.gray, checkAnswer);
    }
}

function printGuesses() {
    return `\n(${guesses.length} ${guesses.length === 1 ? "guess" : "guesses"})\nPast Guesses: ${guesses.join(", ")}\n\n`;
}

function printPokeball() {
    console.log("     _________".brightRed);
    console.log("    /         \\ ".brightRed);
    console.log("   /           \\ ".brightRed);
    console.log("   |-----O-----|".gray);
    console.log("   \\           /".white);
    console.log("    \\_________/ ".white);
}

function printWelcome(){
    console.log("\nWe're ready! I choose you to tell me...");
    setTimeout(() => {
        console.log("\nWHO'S THAT POKEMON??".brightCyan);
        setTimeout(() => {
            printPokeball();
            setTimeout(() => {
                rl.question("\nWhat do you think? Who's that Pokemon?\n", checkAnswer);
            }, 500);
        }, 500);
    }, 500);
}

function quitEvent(answer) {
    if (answer.toLowerCase().includes(("tell")) || answer.toLowerCase().includes("help")) {
        console.log("No.");
        return true;
    } else if (answer.toLowerCase().includes("quit")) {
        console.log("Fine.");
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
