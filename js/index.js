const canvasWidth = 2503;
const frameWidth = 1080;

const playButton = document.querySelector('.start-screen__button');
const startScreen = document.querySelector('.start-screen');
const game = document.querySelector('.game');
const fridge = document.querySelector('.fridge');

const setDataCleaned = (item) => {
  item.setAttribute('data-cleaned', true);
};

const bannerTextTween = (title, text, button) => {
  const textTL = gsap.timeline();
 
  textTL.from(title, { 
    opacity: 0,
    duration: 2,
  });
  
  textTL.from(text, { 
    opacity: 0,
    duration: 1.5,
  }, "-=1");
  
  textTL.from(button, { 
    opacity: 0,
    scale: 1.1,
    duration: 1.5,
    ease: "bounce.out",
  }, "-=1");
}

const jumpingBacteriumsTween = () => {
  const bacteruimTL = gsap.timeline();

  bacteruimTL.to(".start-screen__bacterium", {
    stagger: 0.25,
    y: 30,
    repeat: -1,
    yoyo: true,
    duration: 2,
    ease: "bounce.out",
  });
  
  bacteruimTL.to(".start-screen__bacterium--brown", { 
    y: 25,
    duration: 1,
  }, "+=1");
  
  bacteruimTL.to(".start-screen__bacterium--salad-green", { 
    y: 20,
    duration: 1.5,
  }, "+=1.5");
}

const startScreenTween = () => {
  jumpingBacteriumsTween();
  bannerTextTween(".start-screen__title", ".start-screen__description", playButton);
} 

startScreenTween();

const showOnboardingPopup = () => {
  gsap.to(".popup__description", { 
    opacity: 1,
    duration: 0.5,
  });

  gsap.to(".popup__icon", { 
    x: 20,
    repeat: -1,
    duration: 0.5,
    yoyo: true,
    delay: 0.5,
    ease: "in",
  });      
}

const hideStartScreen = () => {
  gsap.to(startScreen, {
    opacity: 0, 
    duration: 0.5, 
    onComplete: () => {
      startScreen.classList.add('hidden'); 
    }
  });
}

const showGameScreen = () => {
  gsap.to(game, {
    opacity: 1, 
    duration: 0.5,
    onComplete: () => {
      showOnboardingPopup();
    }
  });
}

playButton.addEventListener('click', (event) => {
  event.preventDefault();
  hideStartScreen();
  showGameScreen();
});

const onboardingScreen = document.querySelector('.onboarding');
const kitchenScreen = document.querySelector('.kitchen');
const switcherWallScreen = document.querySelector('.switcher-wall');
const bathroomScreen = document.querySelector('.bathroom');
const finishScreen = document.querySelector('.finish-screen');

const timer = document.querySelector('.timer');
const timerBar = document.querySelector('.timer__bar');

const fridgeBacterium = document.querySelector('.popup__bacterium');
const ovenBacterium = document.querySelector('.oven__bacterium');
const plateBacterium = document.querySelector('.plate__bacterium');
const dishesBacterium = document.querySelector('.dishes__bacterium');
const switcherBacterium = document.querySelector('.switcher__bacterium');
const sinkBacterium = document.querySelector('.sink__bacterium');
const doorBacterium = document.querySelector('.door__bacterium');

const fridgeFoam = document.querySelector('.fridge__foam');
const fridgeDirt = document.querySelector('.dirt--fridge');
const oven = document.querySelector('.oven');
const plate = document.querySelector('.plate');
const dishwasher = document.querySelector('.dishes');

const finishgame = () => {
  finishScreen.classList.remove('hidden');
  gsap.to(finishScreen, {opacity: 1, duration: 1});
  game.classList.add('hidden');
  gsap.to(timer, {display: 'none'});
}

const runGame = () => {
  gsap.to(kitchenScreen, {opacity: 1});
  gsap.to(timer, {opacity: 1, duration: 0.5});
  gsap.to(onboardingScreen, {display: 'none'});
  gsap.to(game, {
    x: canvasEndPositionX, 
    duration: 20, 
    delay: 1, 
    onComplete: () => {
    finishgame();
  }});
}

const runTimer = () => {
  const timerTl = gsap.timeline();

  timerTl.to(timerBar, {
    width: "2%", 
    duration: 20,
  });

  timerTl.to(timerBar, {
    backgroundColor: "var(--color-red-light)", 
    duration: 5
  }, "-=10");
}

const startGame = () => {
  const tl = gsap.timeline();
  const canvasEndPositionX = (canvasWidth - frameWidth) * -1;

  tl.to('.popup', {opacity: 0, duration: 0.5});
  tl.to(fridgeFoam, {opacity: 1, duration: 0.5});
  tl.to(fridgeFoam, {y: 410, duration: 2});
  tl.to(fridgeDirt, {opacity: 0, duration: 2}, "-=2");
  tl.to(fridgeFoam, {opacity: 0, duration: 2, onComplete: () => {
    gsap.to(kitchenScreen, {opacity: 1});
    gsap.to(timer, {opacity: 1, duration: 0.5});
    gsap.to(onboardingScreen, {display: 'none'});
    gsap.to(game, {
      x: canvasEndPositionX, 
      duration: 20, 
      delay: 1, 
      onComplete: () => {
      finishgame();
    }});
    runTimer();
  }, 
  },"-=2");
}

fridgeBacterium.addEventListener('click', () => {
  startGame();
  setDataCleaned(fridge);
});

const secondFoam = document.querySelector('.oven__foam');
const ovenDirt = document.querySelector('.dirt--oven');
const plateDirt = document.querySelector('.dirt--plate');
const plateFoam = document.querySelector('.plate__foam');

const dishesDirt = document.querySelector('.dirt--dishes');
const dishesFoam = document.querySelector('.dishes__foam');
const dishesFoam2 = document.querySelector('.dishes__foam-box');

const switcherDirt = document.querySelector('.dirt--switcher');
const switcherFoam = document.querySelector('.switcher__foam');

const sinkDirt = document.querySelector('.dirt--sink');
const sinkFoam = document.querySelector('.sink__foam');

const doorDirt = document.querySelector('.dirt--door');
const doorFoam = document.querySelector('.door__foam');

const showNextScreen = (screen) => {
  gsap.to(screen, {opacity: 1, duration: 1, delay: 1});
}

const checkKitchen = () => {
  const kitchen = document.querySelectorAll('.kitchen__item');
  const result = Array.from(kitchen).every((element) => element.hasAttribute('data-cleaned') && element.getAttribute('data-cleaned') === 'true');

  if (result === true) {
    showNextScreen(switcherWallScreen);
  }
}

ovenBacterium.addEventListener('click', () => {
  const tl = gsap.timeline();
  tl.to(ovenBacterium, {opacity: 0, duration: 0.5}).to(secondFoam, {opacity: 1, duration: 1}).to(secondFoam, {y: 410, duration: 3}).to(secondFoam, {opacity: 0, duration: 3}, "-=2");
  tl.to(ovenDirt, {opacity: 0, duration: 3}, "-=3").to(ovenDirt, {display: 'none'});
  setDataCleaned(oven);
  checkKitchen();
});

plateBacterium.addEventListener('click', () => {
  const tl = gsap.timeline();
  tl.to(plateBacterium, {opacity: 0, duration: 0.5}).to(plateFoam, {opacity: 1, duration: 1}, "-=0.5").to(plateFoam, {opacity: 0, duration: 3});
  tl.to(plateDirt, {opacity: 0, duration: 3}, "-=3").to(plateDirt, {display: 'none'});
  ovenBacterium.setAttribute('data-dirt', false);
  setDataCleaned(plate);
  checkKitchen();
});

dishesBacterium.addEventListener('click', () => {
  const tl = gsap.timeline();
  tl.to(dishesBacterium, {opacity: 0, duration: 0.5}).to(dishesFoam, {opacity: 1, duration: 1}).to(dishesFoam, {opacity: 0, duration: 3}).to(dishesFoam2, {opacity: 1, duration: 1}, "-=2").to(dishesFoam2, {y: 310, duration: 2}, "-=1");
  tl.to(dishesDirt, {opacity: 0, duration: 3}, "-=3").to(dishesDirt, {display: 'none'});
  setDataCleaned(dishwasher);
  checkKitchen();
});

switcherBacterium.addEventListener('click', () => {
  const switcher = document.querySelector('.switcher');
  const tl = gsap.timeline();
  tl.to(switcherBacterium, {opacity: 0, duration: 0.5}).to(switcherFoam, {opacity: 1, duration: 0.5}).to(switcherFoam, {y: 310, duration: 2}).to(switcherFoam, {opacity: 0, duration: 2}, "-=1");
  tl.to(switcherDirt, {opacity: 0, duration: 3}, "-=3").to(switcherDirt, {display: 'none'});

  if (switcher.getAttribute('data-cleaned')) {
    gsap.to(bathroomScreen, {opacity: 1, duration: 0.5, delay: 1});
  }
});

sinkBacterium.addEventListener('click', () => {
  const tl = gsap.timeline();
  tl.to(sinkBacterium
  , {opacity: 0, duration: 0.5}).to(sinkFoam, {opacity: 1, duration: 1}, "-=0.4").to(sinkFoam, {opacity: 0, duration: 3});
  tl.to(sinkDirt, {opacity: 0, duration: 3}, "-=3").to(sinkDirt, {display: 'none'});
});

doorBacterium.addEventListener('click', () => {
  const tl = gsap.timeline();
  tl.to(doorBacterium, {opacity: 0, duration: 0.5}).to(doorFoam, {opacity: 1, duration: 1}, "-=0.4").to(doorFoam, {y: 210, duration: 2}).to(doorFoam, {opacity: 0, duration: 2}, "-=1");
  tl.to(doorDirt, {opacity: 0, duration: 2}, "-=3").to(doorDirt, {display: 'none'});
});
