//const buttonsParent = document.querySelector('.level__buttons');
const buttonsLevel = document.querySelectorAll('.level__button--num');
const level = document.querySelector('.level');
const buttonStart = document.querySelector('.level__button--start');
const gameField = document.querySelector('.game__wrapper');
const cards = document.querySelector('.cards');
const popupLosing = document.querySelector('.popup-losing');
const popupWin = document.querySelector('.popup-win');

//активная кнопка уровня
for (let i = 0; i < buttonsLevel.length; i++) {
    buttonsLevel[i].addEventListener('click', function levelSelection() {
        [...buttonsLevel].forEach((el) => el.classList.remove('active'));
        this.classList.add('active');
    });

    //выбор уровня
    buttonStart.addEventListener('click', function () {
        if (buttonsLevel[i].classList.contains('active')) {
            let buttonData = buttonsLevel[i].getAttribute('data-order');
            console.log(buttonData + 'класс актив');

            if (buttonData === '1') {
                timer();
                lowLevel();
            }
            if (buttonData === '2') {
                timer();
                middleLevel();
            }
            if (buttonData === '3') {
                timer();
                highLevel();
            }
        }
    });
}

//1 уровень
function lowLevel() {
    console.log('1 уровень');
    //level.style.display = 'none';
    level.setAttribute('style', 'display:none;');
    //gameField.style.display = 'block';
    gameField.setAttribute('style', 'display: block;');

    createCardSet(6);

    //когда карты выложны на столе - запустим обработчик нажатий на карту
    cardClickHandler();

    return;
}

//2 уровень
function middleLevel() {
    console.log('2 уровень');
    level.setAttribute('style', 'display: none;');
    gameField.setAttribute('style', 'display: block;');

    createCardSet(12);
    //когда карты выложны на столе - запустим обработчик нажатий на карту
    cardClickHandler();

    return;
}

//3 уровень
function highLevel() {
    console.log('3 уровень');
    level.setAttribute('style', 'display: none;');
    gameField.setAttribute('style', 'display: block;');

    createCardSet(18);
    //когда карты выложны на столе - запустим обработчик нажатий на карту
    cardClickHandler();
    return;
}

function createCardSet(numCards: any) {
    //создадим массив из 6 карт
    const cardArr = Array.from(Array(numCards), () => createCard('card'));

    //создадим клон нашего массива
    const clonedArr = cardArr.map((card) => card.cloneNode());

    //создадим набор карт, содержащий в себе повторяющийся массив наших карт
    const cardsSet = [...cardArr, ...clonedArr];

    //перемешаем набор случайным образом
    const shuffledSet = cardsSet
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    //разложим массив на игровом поле
    shuffledSet.forEach((card) => {
        cards.appendChild(card);
    });

    return cardsSet;
}

let hasFlippedCard = false; //если карта не перевернута
let lockBoard = false; //если нажата вторая карта
let firstCard: any, secondCard: any;

function flipCardClick() {
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.remove('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        console.log(firstCard.dataset.name);
        //console.log(this.dataset.name);
        return;
    }

    //при нажатии на 2ю карту попадаем в блок else
    secondCard = this;
    lockBoard = true;
    //hasFlippedCard = false;
    console.log(secondCard.dataset.name);
    //console.log(firstCard.dataset.name);
    checkForMatch();
}

//сравнение карт
function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCardClick);
    secondCard.removeEventListener('click', flipCardClick);

    resetBoard();
    getResult();
}

//получение результата
function getResult() {
    if (document.querySelectorAll('.card.flip').length === 0) {
        console.log('game over');
        popupWin.setAttribute('style', 'display: flex;');
        gameField.setAttribute('style', 'display: none;');
        clearTimeout(timerRun);
    }
    return;
}

function unflipCards() {
    //lockBoard = true;
    setTimeout(() => {
        firstCard.classList.add('flip');
        secondCard.classList.add('flip');
        //lockBoard = false;
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function createCard(className: any) {
    //console.log(arrNewCard);
    let newCard = document.createElement('div');

    //рандомное число для data
    let ramdomPos = Math.floor(Math.random() * 36);
    //newCard.style.order = arrNewCard();
    newCard.className = className;
    newCard.classList.add('card');
    newCard.setAttribute('data-name', ramdomPos);

    return newCard;
}

function cardClickHandler() {
    const cardsAll = document.querySelectorAll('.card');
    //показать все карты затем через 4 сек перевернуть рубашкой вверх
    function flipCard(card: any) {
        card.classList.add('flip');
    }

    cardsAll.forEach((card) => {
        setTimeout(() => {
            flipCard(card);
            //обработчики кликов сработает после того как карты будут перевёрнуты
            card.addEventListener('click', flipCardClick);
        }, 4000);
    });
}

//кнопка начать заново
const startOver = document.querySelectorAll('.popup--over');
const startGame = document.querySelector('.btn--over');
for (let i = 0; i < startOver.length; i++) {
    startOver[i].addEventListener('click', function () {
        level.setAttribute('style', 'display: flex;');
        gameField.setAttribute('style', 'display: none;');
        popupLosing.setAttribute('style', 'display: none;');
        popupWin.setAttribute('style', 'display: none;');
        location.reload();
    });
}

startGame.addEventListener('click', function () {
    location.reload();
});

//функция таймера
let timerRun;
let display, display2, display3;

function startTimer(duration, display, display2, display3) {
    let timer = duration,
        minutes,
        seconds;
    timerRun = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        display.textContent = minutes + ':' + seconds;
        display2.textContent = minutes + ':' + seconds;
        display3.textContent = minutes + ':' + seconds;

        if (++timer < 0) {
            timer = duration;
        }
    }, 1000);
}

function timer() {
    let fiveMinutes = 0;
    display = document.querySelector('.timer');
    display2 = document.querySelector('.timer__win');
    display3 = document.querySelector('.timer__los');

    startTimer(fiveMinutes, display, display2, display3);
}
