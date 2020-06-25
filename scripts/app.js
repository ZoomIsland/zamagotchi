const timer = {
    seconds: 0,
    daytime: true,
    minutes: 0
}

const currentTam = {
    savedTam: {},
    tamAlive: false,
    eggRed: 0,
    eggGreen: 0,
    eggBlue: 0,
    jumping: false,
}

class Tamagotchi {
    constructor(name) {
        this.name = name;
        this.age = 0;
        //starting these off with 1 so "gameplay" is immediately available
        this.hunger = 1;
        this.sleepiness = 1;
        this.boredom = 1;
        this.awake = true;
        this.red = currentTam.eggRed;
        this.green = currentTam.eggGreen;
        this.blue = currentTam.eggBlue;
        this.morphtype = randomMorph();
        this.fruitFed = 0;
        this.playtime = 0;
    }
    feed(color) {
        if (!this.awake) {
            wakeUp();
        }
        if (this.hunger > 0) {
            this.hunger--;
            changeBars("hunger");
        }
        this.fruitFed++;
        let newFruit = '<div class="fedFruit"><div class="fedStem"></div><div class="fedBerry"></div></div>';
        $('.mouth').append(newFruit);
        $('.mouth').css('height', '10px');
        $('.mouth').css('border-radius', '50%');
        //how could I DRY this?
        switch (color) {
            case "red":
                $('.fedBerry').css('background', 'var(--redFruit');
                this.red += 10;
                if (this.red > 255) {
                    this.red = 255;
                }
                this.green -= 5;
                if (this.green < 0) {
                    this.green = 0;
                }
                this.blue -= 5;
                if (this.blue < 0) {
                    this.blue = 0;
                }
                break;
            case "green":
                $('.fedBerry').css('background', 'var(--greenFruit');
                this.green += 10;
                if (this.green > 255) {
                    this.green = 255;
                }
                this.red -= 5;
                if (this.red < 0) {
                    this.red = 0;
                }
                this.blue -= 5;
                if (this.blue < 0) {
                    this.blue = 0;
                }
                break;
            case "blue":
                $('.fedBerry').css('background', 'var(--blueFruit');
                this.blue += 10;
                if (this.blue > 255) {
                    this.blue = 255;
                }
                this.red -= 5;
                if (this.red < 0) {
                    this.red = 0;
                }
                this.green -= 5;
                if (this.green < 0) {
                    this.green = 0;
                }
                break;
            case "black":
                $('.fedBerry').css('background', 'var(--blackFruit');
                this.red -= 5;
                if (this.red < 0) {
                    this.red = 0;
                }
                this.green -= 5;
                if (this.green < 0) {
                    this.green = 0;
                }
                this.blue -= 5;
                if (this.blue < 0) {
                    this.blue = 0;
                }
                break;
            case "white":
                $('.fedBerry').css('background', 'var(--whiteFruit');
                this.red += 5;
                if (this.red > 255) {
                    this.red = 255;
                }
                this.green += 5;
                if (this.green > 255) {
                    this.green = 255;
                }
                this.blue += 5;
                if (this.blue > 255) {
                    this.blue = 255;
                }
                break;
        }
        $('.fedFruit').css('animation', 'feedFruit 500ms 1 ease-in');
        setTimeout(function() {
            $('.fedFruit:first-child').remove()
            $('.mouth').css('height', '5px');
            $('.mouth').css('border-radius', '0% 0% 50% 50%');
        }, 500)
        $(':root').css('--tamBody', `rgb(${currentTam.savedTam.red}, ${currentTam.savedTam.green}, ${currentTam.savedTam.blue})`);
    }
    play() {
        if (!this.awake) {
            wakeUp();
        }
        this.playtime++;
        if (!currentTam.jumping) {
            currentTam.jumping = true;
            $('.tamItself').css('animation', 'tamJump 500ms 2 alternate');
            $('.leftShoe').css('animation', 'leftShoeJump 500ms 2 alternate');
            $('.rightShoe').css('animation', 'rightShoeJump 500ms 2 alternate');
            setTimeout(function() {
                $('.tamItself').css('animation', 'none');
                $('.leftShoe').css('animation', 'none');
                $('.rightShoe').css('animation', 'none');
                currentTam.jumping = false;
            }, 1000);
        }
        $('.feedButtons').css('bottom', '-15px');
        if (this.boredom > 0) {
            this.boredom--;
            changeBars("bored");
        }
    }
    sleep() {
        $('.feedButtons').css('bottom', '-15px');
        if (this.sleepiness > 0) {
            $('.shoes').css('animation-play-state', 'paused');
            $('.tamWalking').css('animation-play-state', 'paused');
            zzzs();
            $('.lights').css('background', 'rgba(0,0,0,0.25)');
            this.awake = false;
            $('.eye').css('animation', 'none');
            $('.eye').css('height', '2px');
        }
    }
}

//sets egg color
currentTam.eggRed = randomColor();
currentTam.eggGreen = randomColor();
currentTam.eggBlue = randomColor();
$('.spot').css('background', `rgb(${currentTam.eggRed}, ${currentTam.eggGreen}, ${currentTam.eggBlue})`)
$('.egg').on('click', createTamagotchi);
setLowerButtons('egg');
$('#feedRed').on('click', () => {currentTam.savedTam.feed('red')});
$('#feedGreen').on('click', () => {currentTam.savedTam.feed('green')});
$('#feedBlue').on('click', () => {currentTam.savedTam.feed('blue')});
$('#feedBlack').on('click', () => {currentTam.savedTam.feed('black')});
$('#feedWhite').on('click', () => {currentTam.savedTam.feed('white')});
$('.restart').on('click', restart);
$('button').on('click', function() {
    timer.seconds += 10;
})

function setLowerButtons(onscreen) {
    const buttonsToChange = ['.feed', '.play', '.sleep'];
    buttonsToChange.forEach(element => $(element).off())
    switch (onscreen) {
        case "deathScreen":
            buttonsToChange.forEach(element => $(element).on('click', restart))
            break;
        case "egg":
            buttonsToChange.forEach(element => $(element).on('click', createTamagotchi))
            break;
        case "tamAlive":
            $('.feed').on('click', openFruits);
            $('.play').on('click', () => {currentTam.savedTam.play()});
            $('.sleep').on('click', () => {currentTam.savedTam.sleep()});
            break;
    }
}

function openFruits() {
    $('.feedButtons').css('bottom', '33px');
}

function changeBars(type) {
    let bar, comparison;
    switch (type) {
        case "hunger":
            bar = $('.hungerBars');
            comparison = currentTam.savedTam.hunger;
            break;
        case "bored":
            bar = $('.boredBars');
            comparison = currentTam.savedTam.boredom;
            break;
        case "sleepy":
            bar = $('.sleepyBars');
            comparison = currentTam.savedTam.sleepiness;
            break;
    }
    let i = 0;
    for (const bars of bar) {
        i++;
        if (i <= comparison) {
            $(bars).css('opacity', '1');
        } else {
            $(bars).css('opacity', '0');
        }
    }
}
function randomMorph() {
    let morphs = ['rhino', 'horns', 'bunny', 'antlers'];
    let randomNum = Math.floor(Math.random() * morphs.length);
    return morphs[randomNum];
}
function morph() {
    if (currentTam.savedTam.age === 1) {
        switch(currentTam.savedTam.morphtype) {
            case 'rhino':
                $('.rhino').css('border-left', '5px solid transparent');
                $('.rhino').css('border-right', '5px solid transparent');
                $('.rhino').css('border-bottom', '10px solid gray');
                break;
            case 'horns':
                $('.leftHorn').css('border-left', '5px solid transparent');
                $('.leftHorn').css('border-right', '5px solid transparent');
                $('.leftHorn').css('border-bottom', '10px solid rgb(59, 27, 9)');
                $('.rightHorn').css('border-left', '5px solid transparent');
                $('.rightHorn').css('border-right', '5px solid transparent');
                $('.rightHorn').css('border-bottom', '10px solid rgb(59, 27, 9)');
                break;
            case 'bunny':
                $('.leftBunny').css('height', '15px');
                $('.leftBunny').css('width', '10px');
                $('.rightBunny').css('height', '15px');
                $('.rightBunny').css('width', '10px');
                break;
            case 'antlers':
                $('.leftAntler').css('height', '15px');
                $('.rightAntler').css('height', '15px');
        }
    }
    if (currentTam.savedTam.age === 2) {
        $('.tamHead').css('margin-bottom', '-40px');
        $('.tamHead').css('box-shadow', '0px 1px 2px black');
        $('.tamItself').css('margin-top', '60px');
        switch(currentTam.savedTam.morphtype) {
            case 'rhino':
                $('.rhino').css('border-bottom', '20px solid gray');
                break;
            case 'horns':
                $('.leftHorn').css('border-bottom', '20px solid rgb(59, 27, 9)');
                $('.rightHorn').css('border-bottom', '20px solid rgb(59, 27, 9)');
                break;
            case 'bunny':
                $('.leftBunny').css('height', '25px');
                $('.leftBunny').css('width', '15px');
                $('.rightBunny').css('height', '25px');
                $('.rightBunny').css('width', '15px');
                break;
            case 'antlers':
                $('.leftAntler').html('<div class="firstLeftNub"></div>');
                $('.rightAntler').html('<div class="firstRightNub"></div>');
                setTimeout(function() {
                    $('.firstLeftNub').css('width', '10px');
                    $('.firstRightNub').css('width', '10px');
                }, 500);
                break;

        }
    }
    if (currentTam.savedTam.age === 3) {
        $('.tamHead').css('margin-bottom', '-20px');
        $('.tamBody').css('border-radius', '35%');
        $('.tamBody').css('margin-bottom', '-55px');
        $('.tamBody').css('transform', 'rotateX(-35deg)');
    }
    if (currentTam.savedTam.age === 4) {
        switch(currentTam.savedTam.morphtype) {
            case 'rhino':
                $('.rhino').css('border-left', '7px solid transparent');
                $('.rhino').css('border-right', '7px solid transparent');
                $('.rhino').css('border-bottom', '30px solid gray');
                $('.extension').prepend('<div class="rhinoLeft"></div>');
                $('.extension').append('<div class="rhinoRight"></div>')
                break;
            case 'horns':
                $('.leftHorn').css('border-left', '7px solid transparent');
                $('.leftHorn').css('border-right', '7px solid transparent');
                $('.leftHorn').css('border-bottom', '30px solid rgb(59, 27, 9)');
                $('.rightHorn').css('border-left', '7px solid transparent');
                $('.rightHorn').css('border-right', '7px solid transparent');
                $('.rightHorn').css('border-bottom', '30px solid rgb(59, 27, 9)');
                break;
            case 'bunny':
                $('.leftBunny').css('height', '40px');
                $('.leftBunny').css('width', '20px');
                $('.rightBunny').css('height', '40px');
                $('.rightBunny').css('width', '20px');
                break;
            case 'antlers':
                $('.leftAntler').css('height', '25px');
                $('.rightAntler').css('height', '25px');
                $('.firstLeftNub').css('width', '15px');
                $('.firstRightNub').css('width', '15px');
                $('.leftAntler').append('<div class="secondLeftNub"></div>');
                $('.rightAntler').append('<div class="secondRightNub"></div>');
                setTimeout(function() {
                    $('.secondLeftNub').css('width', '10px');
                    $('.secondRightNub').css('width', '10px');
                }, 500);
        }
    }
    if (currentTam.savedTam.age === 5) {
        switch(currentTam.savedTam.morphtype) {
            case 'rhino':
                $('.rhino').css('border-bottom', '35px solid gray');
                $('.rhinoLeft').css('border-left', '5px solid transparent');
                $('.rhinoLeft').css('border-right', '5px solid transparent');
                $('.rhinoRight').css('border-left', '5px solid transparent');
                $('.rhinoRight').css('border-right', '5px solid transparent');
                $('.rhinoLeft').css('border-bottom', '15px solid gray');
                $('.rhinoRight').css('border-bottom', '15px solid gray');
                break;
            case 'horns':
                $('.leftHorn').css('border-bottom', '40px solid rgb(59, 27, 9)');
                $('.rightHorn').css('border-bottom', '40px solid rgb(59, 27, 9)');
                break;
            case 'bunny':
                $('.leftBunny').css('height', '60px');
                $('.rightBunny').css('height', '60px');
                break;
            case 'antlers':
                $('.leftAntler').css('height', '35px');
                $('.rightAntler').css('height', '35px');
                $('.firstLeftNub').css('width', '25px');
                $('.firstRightNub').css('width', '25px');
                $('.secondLeftNub').css('width', '15px');
                $('.secondRightNub').css('width', '15px');
        }
    }
}
function resetMorph() {
    $('.tamHead').css('margin-bottom', '-75px');
    $('.tamBody').css('border-radius', '50%');
    $('.tamBody').css('margin-bottom', '-35px');
    $('.tamBody').css('transform', 'none');
    $('.tamItself').css('margin-top', '90px');
}

function wakeUp() {
    currentTam.savedTam.awake = true;
    $('.tamWalking').css('animation-play-state', 'running');
    $('.shoes').css('animation-play-state', 'running');
    $('.lights').css('background', 'none');
    $('.eye').css('height', '10px');
    $('.eye').css('animation', 'blink 6s infinite linear');
    $('.animation').text('');
    $('.animation').css('animation', 'none');
}

function randomColor() {
    return Math.floor(Math.random() * 256);
}

function zzzs() {
    $('.animation').text('Z')
    $('.animation').css('animation', 'sleepZs 2s infinite forwards linear');
}

function createTamagotchi() {
    const queens = ['Gigi', 'Crystal', 'Heidi', 'Miss Vanjie', 'Bob', 'Sasha', 'Nina', 'Alaska', 'Tatianna', 'Yvie', 'Chad', 'Adore', 'Bianca', 'Raja', 'Sharon', 'Pandora', 'Shangela', 'Trixie', 'Latrice', 'Shea', 'Valentina', 'Trinity', 'Katya', 'Bendela', 'Kameron', 'RuPaul']
    let randomQueen = queens[Math.floor(Math.random() * queens.length)]
    let name = prompt('Name your tamagotchi!', randomQueen);
    if (name === null) {
        name = randomQueen;
    }
    $('.eggHome').css('opacity', '0');
    $('.eggHome').css('z-index', '14');
    currentTam.savedTam = new Tamagotchi(name);
    setLowerButtons("tamAlive");
    $('.tamItself').css('margin-top', '90px');
    $('.eye').css('height', '10px');
    $('.eye').css('animation', 'blink 6s infinite linear');
    $('.shoes').css('animation-play-state', 'running');
    $(':root').css('--tamBody', `rgb(${currentTam.savedTam.red}, ${currentTam.savedTam.green}, ${currentTam.savedTam.blue})`);
    switch(currentTam.savedTam.morphtype) {
        case 'rhino':
            $('.extension').html('<div class="rhino"></div>');
            break;
        case 'horns':
            $('.extension').html('<div class="leftHorn"></div><div class="rightHorn"></div>');
            break;
        case 'bunny':
            $('.extension').html('<div class="leftBunny"><div class="innerEar"></div></div><div class="rightBunny"><div class="innerEar"></div></div>');
            break;
        case 'antlers':
            $('.extension').html('<div class="leftAntler"></div><div class="rightAntler"></div>');
            break;
    }
    currentTam.tamAlive = true;
    $('.name h2').text(`${currentTam.savedTam.name.toUpperCase()}, AGE ${currentTam.savedTam.age}`);
    $('.deathName').text(`${currentTam.savedTam.name}`);
    changeBars("hunger");
    changeBars("bored");
    changeBars("sleepy")
    $('.tamStats').css('opacity', '1');
    $('.tamHome').css('opacity', '1');
    startTimer();
    $('.screenButtons').css('bottom', '0');
}

function checkDeath() {
    if (currentTam.savedTam.hunger >= 10 || currentTam.savedTam.sleepiness >= 10 || currentTam.savedTam.boredom >= 10) {
        currentTam.tamAlive = false;
        $('.eye').css('height', '2px');
        $('.eye').css('animation', 'none');
        $('.shoes').css('animation-play-state', 'paused');
        $('.tamItself').clone().appendTo('.finalTam');
        if (currentTam.savedTam.age < 3) {
            $('.tamItself').css('margin-top', '20px');
        } else {
            $('.tamItself').css('margin-top', '30px');
        }
        $('.ageStat').text(`${currentTam.savedTam.age}`);
        $('.fruitFed').text(`${currentTam.savedTam.fruitFed}`);
        $('.playtime').text(`${currentTam.savedTam.playtime}`);
        $('.deathScreen').css('transition', '500ms');
        $('.deathScreen').css('margin-top', '0');
        $('.tamStats').css('opacity', '0');
        setLowerButtons('deathScreen');
        setTimeout(function() {
            $('.sky').css('animation', 'none');
            $('.ground').css('animation', 'none');
            $('.sunMoon').css('animation', 'none');
            $('.tamHome').css('opacity', '0');
            currentTam.eggRed = randomColor();
            currentTam.eggGreen = randomColor();
            currentTam.eggBlue = randomColor();
            $('.spot').css('background', `rgb(${currentTam.eggRed}, ${currentTam.eggGreen}, ${currentTam.eggBlue})`)
            $('.eggHome').css('opacity', '1');
            $('.eggHome').css('z-index', '20');
            $('.screenButtons').css('bottom', '-35px');
            $('.feedButtons').css('bottom', '-50px');
        }, 1000);
    }
}

// on the deathScreen restart button
function restart() {
    $('.deathScreen').css('margin-top', '-150%');
    setTimeout(function () {
        $('.tamHead').css('box-shadow', 'none');
        setLowerButtons('egg');
        resetMorph();
        $('.finalTam').empty();
    }, 500)
}

// Timer Functions
function startTimer() {
    timer.seconds = 0;
    timer.daytime = true;
    timer.minutes = 0;
    $('.sky').css('animation', 'sunset 60s infinite linear');
    $('.ground').css('animation', 'grassShift 60s infinite linear');
    $('.sunMoon').css('animation', 'satellites 60s infinite linear');
    const secondsTimer = setInterval(() => {
        timer.seconds++;
        //if awake
        if (currentTam.savedTam.awake) {
            //sleepiness incrementor
            if (timer.daytime && timer.seconds % 10 === 0) {
                currentTam.savedTam.sleepiness++;
            } else if (!timer.daytime && timer.seconds % 5 === 0) {
                currentTam.savedTam.sleepiness++;
            }
            changeBars('sleepy');
            //hunger incrementor
            if (timer.seconds % 5 === 0) {
                currentTam.savedTam.hunger++;
                changeBars("hunger")
            }
            //boredom incrementor
            if (timer.seconds % 15 === 0) {
                currentTam.savedTam.boredom += 2;
                changeBars('bored');
            }
        //if asleep
        } else {
            //sleep regenerator
            if (timer.seconds % 3 === 0) {
                currentTam.savedTam.sleepiness--;
                changeBars('sleepy');
            }
            if (currentTam.savedTam.sleepiness === 0) {
                currentTam.savedTam.boredom += 1;
                changeBars('bored');
                currentTam.savedTam.hunger += 1;
                changeBars('hunger');
                wakeUp();
            }
        }
        if (timer.seconds % 30 === 0) {
            timer.daytime = !timer.daytime;
            if (timer.daytime && !currentTam.savedTam.awake) {
                wakeUp();
            }
        }
        //every 60 seconds a minute increments 
        if (timer.seconds % 60 === 0) {
            timer.minutes++;
            currentTam.savedTam.age++;
            morph();
            $('.name h2').text(`${currentTam.savedTam.name.toUpperCase()}, AGE ${currentTam.savedTam.age}`);
        }
        checkDeath()
        if (!currentTam.tamAlive) {
            clearInterval(secondsTimer);
        }
    }, 1000)
}