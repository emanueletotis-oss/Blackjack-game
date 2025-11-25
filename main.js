// Blackjack PWA main.js - full logic
const suits = ['♥','♦','♣','♠'];
const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];

function createDeck(){
  const deck=[];
  for(const s of suits){
    for(const r of ranks){
      deck.push({r,s});
    }
  }
  return shuffle(deck);
}
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}
function cardLabel(c){ return c.r + c.s; }

function handValue(hand){
  let total=0, aces=0;
  for(const c of hand){
    if(['J','Q','K'].includes(c.r)) total+=10;
    else if(c.r==='A'){ total+=11; aces+=1; }
    else total+=parseInt(c.r,10);
  }
  while(total>21 && aces>0){ total-=10; aces-=1; }
  return total;
}

// DOM
const dealerCardsEl = document.getElementById('dealer-cards');
const playerCardsEl = document.getElementById('player-cards');
const dealerValueEl = document.getElementById('dealer-value');
const playerValueEl = document.getElementById('player-value');
const messageEl = document.getElementById('message');
const btnHit = document.getElementById('hit');
const btnStand = document.getElementById('stand');
const btnNew = document.getElementById('new');

let deck, playerHand, dealerHand, gameOver;

function render(){
  dealerCardsEl.innerHTML = dealerHand.map((c,i)=> `<div class="card">${cardLabel(c)}</div>`).join('');
  playerCardsEl.innerHTML = playerHand.map(c=> `<div class="card">${cardLabel(c)}</div>`).join('');
  dealerValueEl.textContent = 'Valore: ' + handValue(dealerHand);
  playerValueEl.textContent = 'Valore: ' + handValue(playerHand);
}

function startGame(){
  deck = createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  gameOver = false;
  messageEl.textContent = '';
  btnHit.disabled = false;
  btnStand.disabled = false;
  render();
  checkImmediate();
}

function checkImmediate(){
  const pv = handValue(playerHand);
  const dv = handValue(dealerHand);
  if(pv===21){
    messageEl.textContent = 'Blackjack! Hai 21!';
    gameOver=true;
    btnHit.disabled = true;
    btnStand.disabled = true;
  } else if(dv===21){
    messageEl.textContent = 'Banco ha Blackjack!';
    gameOver=true;
    btnHit.disabled = true;
    btnStand.disabled = true;
    render();
  }
}

btnHit.addEventListener('click', ()=>{
  if(gameOver) return;
  playerHand.push(deck.pop());
  render();
  const pv = handValue(playerHand);
  if(pv>21){
    messageEl.textContent = 'Hai sballato! Il banco vince.';
    gameOver=true;
    btnHit.disabled=true;
    btnStand.disabled=true;
  }
});

btnStand.addEventListener('click', ()=>{
  if(gameOver) return;
  // dealer draws to 17
  while(handValue(dealerHand) < 17){
    dealerHand.push(deck.pop());
  }
  render();
  const pv = handValue(playerHand);
  const dv = handValue(dealerHand);
  let res='';
  if(dv>21) res='Il banco ha sballato! Hai vinto!';
  else if(pv>dv) res='Hai vinto!';
  else if(pv<dv) res='Il banco vince!';
  else res='Pareggio!';
  messageEl.textContent = res;
  gameOver=true;
  btnHit.disabled=true;
  btnStand.disabled=true;
});

btnNew.addEventListener('click', startGame);

// initialize
startGame();
