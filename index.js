let deckId
const cardsContainer = document.getElementById("cards")
const newDeckBtn = document.getElementById("new-deck")
const drawCardBtn = document.getElementById("draw-cards")
const header = document.getElementById("header")
const remainingText = document.getElementById("remaining")
const computerScoreEl = document.getElementById("computer-score")
const myScoreEl = document.getElementById("my-score")
let computerScore = 0
let myScore = 0
drawCardBtn.disabled = true

function handleClick() {
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            remainingText.textContent = `Remaining cards: ${data.remaining}`
            deckId = data.deck_id
            
            cardsContainer.children[0].innerHTML = ""
            cardsContainer.children[1].innerHTML = ""
            computerScoreEl.textContent = "Computer score: 0"
            myScoreEl.textContent = "My score: 0"
            header.textContent = "Game of War"
            computerScore = 0
            myScore = 0
            drawCardBtn.disabled = false
        })
}

newDeckBtn.addEventListener("click", handleClick)

drawCardBtn.addEventListener("click", () => {
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            remainingText.textContent = `Remaining cards: ${data.remaining}`
            cardsContainer.children[0].innerHTML = `
                <img src=${data.cards[0].image} class="card" />
            `
            cardsContainer.children[1].innerHTML = `
                <img src=${data.cards[1].image} class="card" />
            `
            const winnerText = determineCardWinner(data.cards[0], data.cards[1])
            header.textContent = winnerText
            
            computerScoreEl.textContent = `Computer Score: ${computerScore}` 
            myScoreEl.textContent = `My Score: ${myScore}`
            
            if (data.remaining === 0) {
                drawCardBtn.disabled = true
                if (computerScore > myScore) {
                    header.textContent = "Computer Wins"
                }
                else if(computerScore < myScore) {
                    header.textContent = "You Win"
                }
                else if(computerScore === myScore) {
                    header.textContent = "Tied game"
                }
            }
        })
})

function determineCardWinner(card1, card2) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
    "10", "JACK", "QUEEN", "KING", "ACE"]
    const card1ValueIndex = valueOptions.indexOf(card1.value)
    const card2ValueIndex = valueOptions.indexOf(card2.value)
    
    if (card1ValueIndex > card2ValueIndex) {
        computerScore += 1
        return "Card 1 wins!"
    } else if (card1ValueIndex < card2ValueIndex) {
        myScore += 1
        return "Card 2 wins!"
    } else {
        return "War!"
    }
}

