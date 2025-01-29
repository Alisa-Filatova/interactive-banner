const setDataCleaned = (item) => {
  item.setAttribute('data-cleaned', true);
};

const hideElement = (element, duration = 0.5) => {
  gsap.to(element, {
    opacity: 0, 
    duration: duration, 
    onComplete: () => {
      if (!element.classList.contains('hidden')) {
        element.classList.add('hidden');
      }
    }
  });
}

const showElement = (element, duration = 0.5, delay = 0) => {

  gsap.to(element, {
    onStart: () => {
      if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');
      }
    },
    opacity: 1, 
    duration: duration,
    delay: delay,
  });
}

const bannerTextTween = (title, text, button) => {
  const textTL = gsap.timeline();
 
  textTL.from(title, { 
    opacity: 0,
    duration: 2,
  });
  
  textTL.from(text, { 
    opacity: 0,
    duration: 1.5,
  }, '-=1.2');
  
  textTL.from(button, { 
    opacity: 0,
    scale: 1.1,
    duration: 1.5,
    ease: 'bounce.out',
  }, '-=1.5');
}

const getFoam = (bacterium) => {
  const item = bacterium.getAttribute('data-item');
  return document.querySelector(`.${item}__foam`);
};

const getDirt = (bacterium) => {
  const item = bacterium.getAttribute('data-item');
  return document.querySelector(`.dirt--${item}`);
};

const getItem = (bacterium) => {
  const item = bacterium.getAttribute('data-item');
  return document.querySelector(`.${item}`);
};

const jumpingBacteriumsTween = () => {
  const bacteriumTL = gsap.timeline();

  bacteriumTL.to('.start-screen__bacterium', {
    stagger: 0.25,
    y: 30,
    repeat: -1,
    yoyo: true,
    duration: 2,
    ease: 'bounce.out',
  });
  
  bacteriumTL.to('.start-screen__bacterium--brown', { 
    y: 25,
    duration: 1,
  }, '+=1');
  
  bacteriumTL.to('.start-screen__bacterium--salad-green', { 
    y: 20,
    duration: 1.5,
  }, '+=1.5');
}

const initStartScreenAnim = () => {
  jumpingBacteriumsTween();
  bannerTextTween('.start-screen__title', '.start-screen__description', '.start-screen__button');
} 

initStartScreenAnim();

const canvasWidth = 2503;
const frameWidth = 1080;
const gameTime = 15;

const startScreen = document.querySelector('.start-screen');
const onboardingScreen = document.querySelector('.onboarding');
const kitchenScreen = document.querySelector('.kitchen');
const switcherWallScreen = document.querySelector('.switcher-wall');
const bathroomScreen = document.querySelector('.bathroom');
const finishScreen = document.querySelector('.finish-screen');

const fridgeBacterium = document.querySelector('.popup__bacterium');
const ovenBacterium = document.querySelector('.oven__bacterium');
const plateBacterium = document.querySelector('.plate__bacterium');
const dishesBacterium = document.querySelector('.dishes__bacterium');
const switcherBacterium = document.querySelector('.switcher__bacterium');
const sinkBacterium = document.querySelector('.sink__bacterium');
const doorBacterium = document.querySelector('.door__bacterium');

const showOnboardingPopup = () => {
  showElement('.popup__description');

  gsap.to('.popup__icon', { 
    x: 20,
    repeat: -1,
    duration: 0.5,
    yoyo: true,
    delay: 0.5,
    ease: 'in',
  });      
}

const game = document.querySelector('.game');

const showGameScreen = () => {
  showElement(game);
  gsap.to(game, {
    onComplete: () => {
      showOnboardingPopup();
    }
  });
}

const hideStartScreen = () => {
  hideElement(startScreen);
}

const playButton = document.querySelector('.start-screen__button');

playButton.addEventListener('click', (event) => {
  event.preventDefault();
  hideStartScreen();
  showGameScreen();
});

const checkResult = () => {
  const dirtyItems = document.querySelectorAll('[data-cleaned="false"]');
  const result = Array.from(dirtyItems);

  if (result.length === 0) {
    finishScreen.classList.add('finish-screen__text--win')
  }
}

const showFinishScreen = () => {
  showElement(finishScreen, 1);
  bannerTextTween('.finish-screen__title', '.finish-screen__description', '.finish-screen__button');
}

const timer = document.querySelector('.timer');
const timerBar = document.querySelector('.timer__bar');

const runTimer = () => {
  const timerTl = gsap.timeline();

  timerTl.to(timer, {
    opacity: 1, 
    duration: 0.5,
  });

  timerTl.to(timerBar, {
    width: '3%', 
    duration: gameTime,
  });

  timerTl.to(timerBar, {
    backgroundColor: 'var(--color-red-light)', 
    duration: 5,
  }, '-=10');
}

const finishGame = () => {
  checkResult();
  hideGameScreen();
  showFinishScreen();
}

const startGame = () => {
  const canvasEndPositionX = (canvasWidth - frameWidth) * -1;

  showElement(kitchenScreen);

  gsap.to(game, {
    x: canvasEndPositionX, 
    duration: gameTime, 
    delay: 1, 
    ease: "power.out",
    onComplete: () => {
      finishGame();
    }
  });
  runTimer();
}

const startOnboarding = () => {
  const tl = gsap.timeline();

  const foam = getFoam(fridgeBacterium);
  const dirt = getDirt(fridgeBacterium);
  const item = getItem(fridgeBacterium);

  tl.to('.popup', {
    opacity: 0, 
    duration: 0.5
  });
  tl.to(foam, {
    opacity: 1, 
    duration: 0.5
  });
  tl.to(foam, {
    y: 410, 
    duration: 2
  });
  tl.to(dirt, {
    opacity: 0, 
    duration: 2
  }, '-=2');
  tl.to(foam, {
    opacity: 0, 
    duration: 2, 
    onComplete: () => {
      hideElement(onboardingScreen);
      startGame();
    }, 
  },'-=2');
  setDataCleaned(item);
}

fridgeBacterium.addEventListener('click', () => {
  startOnboarding();
});

const showSwitcherScreen = () => {
  showElement(switcherWallScreen, 1, 1);
}

const hideGameScreen = () => {
  hideElement(timer);
  hideElement(game);
}

const checkKitchenDirt = () => {
  const kitchen = document.querySelectorAll('.kitchen__item');
  const result = 
    Array.from(kitchen).every((element) => {
      return element.hasAttribute('data-cleaned') && element.getAttribute('data-cleaned') === 'true';
    });

  if (result === true) {
    showSwitcherScreen(switcherWallScreen);
  }
}

ovenBacterium.addEventListener('click', () => {
  const tl = gsap.timeline();
  const item = getItem(ovenBacterium);
  const foam = getFoam(ovenBacterium);
  const dirt = getDirt(ovenBacterium);

  tl.to(ovenBacterium, {
    opacity: 0, 
    duration: 0.5,
  });
  tl.to(foam, {
    opacity: 1, 
    duration: 1,
  });
  tl.to(foam, {
    y: 410, 
    duration: 3,
  });
  tl.to(foam, {
    opacity: 0, 
    duration: 3
  }, '-=2');
  tl.to(dirt, {
    opacity: 0, 
    duration: 3
  }, '-=3');
  tl.to(dirt, {
    display: 'none',
  });
  setDataCleaned(item);
  checkKitchenDirt();
});

plateBacterium.addEventListener('click', () => {
  const tl = gsap.timeline();
  const foam = getFoam(plateBacterium);
  const dirt = getDirt(plateBacterium);
  const item = getItem(plateBacterium);

  tl.to(plateBacterium, {
    opacity: 0, 
    duration: 0.5,
  });
  tl.to(foam, {
    opacity: 1, 
    duration: 1,
  }, '-=0.5');
  tl.to(foam, {
    opacity: 0, 
    duration: 3,
  });
  tl.to(dirt, {
    opacity: 0, 
    duration: 3,
  }, '-=3');
  tl.to(dirt, {
    display: 'none',
  });

  setDataCleaned(item);
  checkKitchenDirt();
});

dishesBacterium.addEventListener('click', () => {
  const tl = gsap.timeline();
  // TODO
  const dishesFoam2 = document.querySelector('.dishes__foam-box');
  const foam = getFoam(dishesBacterium);
  const dirt = getDirt(dishesBacterium);
  const item = getItem(dishesBacterium);

  tl.to(dishesBacterium, {
    opacity: 0, 
    duration: 0.5,
  });
  tl.to(foam, {
    opacity: 1, 
    duration: 1,
  });
  tl.to(foam, {
    opacity: 0, 
    duration: 3,
  });
  tl.to(dishesFoam2, {
    opacity: 1, 
    duration: 1
  },'-=2');
  tl.to(dishesFoam2, {
    y: 310, 
    duration: 2
  }, '-=1');
  tl.to(dirt, {
    opacity: 0, 
    duration: 3
  }, '-=3');
  tl.to(dirt, {
    display: 'none',
  });

  setDataCleaned(item);
  checkKitchenDirt();
});

sinkBacterium.addEventListener('click', () => {
  const tl = gsap.timeline();
  const foam = getFoam(sinkBacterium);
  const dirt = getDirt(sinkBacterium);
  const item = getItem(sinkBacterium);

  tl.to(sinkBacterium, {
    opacity: 0, 
    duration: 0.5,
  });
  tl.to(foam, {
    opacity: 1, 
    duration: 1,
  }, '-=0.4');
  tl.to(foam, {
    opacity: 0, 
    duration: 3,
  });
  tl.to(dirt, {
    opacity: 0, 
    duration: 3,
  }, '-=3')
  tl.to(dirt, {
    display: 'none',
  });

  setDataCleaned(item);
});

switcherBacterium.addEventListener('click', () => {
  const tl = gsap.timeline();
  const foam = getFoam(switcherBacterium);
  const dirt = getDirt(switcherBacterium);
  const item = getItem(switcherBacterium);

  tl.to(switcherBacterium, {
    opacity: 0, 
    duration: 0.5,
  });
  tl.to(foam, {
    opacity: 1, 
    duration: 0.5,
  });
  tl.to(foam, {
    y: 310, 
    duration: 2,
  });
  tl.to(foam, {
    opacity: 0, 
    duration: 2
  }, '-=1');
  tl.to(dirt, {
    opacity: 0, 
    duration: 3
  }, '-=3');
  tl.to(dirt, {
    display: 'none',
  });

  setDataCleaned(item);

  if (item.getAttribute('data-cleaned') === 'true') {
    showElement(bathroomScreen, 0.5, 1);
  }
});

doorBacterium.addEventListener('click', () => {
  const tl = gsap.timeline();
  const foam = getFoam(doorBacterium);
  const dirt = getDirt(doorBacterium);
  const item = getItem(doorBacterium);

  tl.to(doorBacterium, {
    opacity: 0, 
    duration: 0.5,
  });
  tl.to(foam, {
    opacity: 1, 
    duration: 1,
  }, '-=0.4');
  tl.to(foam, {
    y: 210, 
    duration: 2,
  });
  tl.to(foam, {
    opacity: 0, 
    duration: 2,
  }, '-=1');
  tl.to(dirt, {
    opacity: 0, 
    duration: 2,
  }, '-=3');
  tl.to(dirt, {
    display: 'none',
  });

  setDataCleaned(item);
});
