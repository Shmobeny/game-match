let charsArr = Object.entries({
  "ackbar": "../!source/img/cards/ackbar.png",
  "amidala": "../!source/img/cards/amidala.png",
  "bb8": "../!source/img/cards/bb8.png",
  "ben_kenobi": "../!source/img/cards/ben_kenobi.png",
  "ben_solo": "../!source/img/cards/ben_solo.png",
  "binks": "../!source/img/cards/binks.png",
  "boba_fett": "../!source/img/cards/boba_fett.png",
  "c3po": "../!source/img/cards/c3po.png",
  "chewbacca": "../!source/img/cards/chewbacca.png",
  "darth_maul_alt": "../!source/img/cards/darth_maul_alt.png",
  "darth_maul": "../!source/img/cards/darth_maul.png",
  "droid": "../!source/img/cards/droid.png",
  "grievous": "../!source/img/cards/grievous.png",
  "gunray": "../!source/img/cards/gunray.png",
  "jabba": "../!source/img/cards/jabba.png",
  "jango": "../!source/img/cards/jango.png",
  "kylo": "../!source/img/cards/kylo.png",
  "lando": "../!source/img/cards/lando.png",
  "leia": "../!source/img/cards/leia.png",
  "mandalorian": "../!source/img/cards/mandalorian.png",
  "nunb": "../!source/img/cards/nunb.png",
  "obiwan_kenobi": "../!source/img/cards/obiwan_kenobi.png",
  "old_luke": "../!source/img/cards/old_luke.png",
  "palpatine": "../!source/img/cards/palpatine.png",
  "phasma": "../!source/img/cards/phasma.png",
  "pilot": "../!source/img/cards/pilot.png",
  "quigon_jinn": "../!source/img/cards/quigon_jinn.png",
  "r2d2": "../!source/img/cards/r2d2.png",
  "rey": "../!source/img/cards/rey.png",
  "rune": "../!source/img/cards/rune.png",
  "scout": "../!source/img/cards/scout.png",
  "sidious": "../!source/img/cards/sidious.png",
  "solo": "../!source/img/cards/solo.png",
  "stormtrooper": "../!source/img/cards/stormtrooper.png",
  "trooper": "../!source/img/cards/trooper.png",
  "tusken_raider": "../!source/img/cards/tusken_raider.png",
  "vader": "../!source/img/cards/vader.png",
  "war_padme": "../!source/img/cards/war_padme.png",
  "warrick": "../!source/img/cards/warrick.png",
  "watto": "../!source/img/cards/watto.png",
  "windu": "../!source/img/cards/windu.png",
  "yoda": "../!source/img/cards/yoda.png",
  "young_anakin": "../!source/img/cards/young_anakin.png",
  "young_luke": "../!source/img/cards/young_luke.png",
});

// shuffle(charsArr);

// function getRandomInt(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min)) + min;
// }

// function shuffle(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     let j = Math.floor(Math.random() * (i + 1));

//     [array[i], array[j]] = [array[j], array[i]];
//   }
// }

class Game {
  
  constructor(content) {
    
    this.content = content;

    this.audioController = new AudioController();
    this.introState = new IntroState(this);
    this.playState = new PlayState(this);
    this.endGame = new EndGame(this);

    this.intro = document.querySelector(".intro");
    this.game = document.querySelector(".game");
    this.messages = document.querySelector(".messages-container");

    this.counters = {
      timer: document.querySelector("[data-counter=\"timer\"]"),
      bonus: document.querySelector("[data-counter=\"bonus\"]"),
      cardsInDeck: document.querySelector("[data-counter=\"cards\"]"),
      lives: document.querySelector("[data-counter=\"lives\"]"),
    }

    this.skyboxGame = this.game.querySelector(".skybox");

    this.timings = {
      toFlipCard: 400,
      toFadeCard: 500,
      toShowGameField: 1000,
      toFadeGameField: 1400,
      toShowCard: 100,
      toCheckMatch: 700,
    }

    this.isLocked = true;

    this.cards = [];
    this.cachedCards = [];

    this.timer = null;
    this.timePoints = 30;
    this.additionalTime = 40;
    this.initialTime = this.timePoints;
    this.checkpointTime = this.initialTime;

    this.lives = 2;
    this.initialLives = this.lives;

  }

  start() {
    this.shuffle(this.content);
    //this.content = this.content.slice(0, 10);
    console.log(this.content);
    
    this._preloadCards();

    this.playState.observer.observe(this.game, {
      attributes: true,
      attributeFilter: ["data-is-active", "data-unmatched-cards", "data-time-left"],
    });

    this.endGame.observer.observe(this.messages, {
      attributes: true,
      attributeFilter: ["data-is-active", "data-game-result"],
    });

    this.updateGameValue("lives");
    this.counters.bonus.textContent = this.additionalTime;

    this._generateStars(100, this.intro);
    this._generateStars(100, this.game);

    window.onload = e => {
      this.isLocked = false;
      this.introState.removeLoader();
    }

    document.documentElement.ondragstart = () => false;
    document.documentElement.onselectstart = () => false;

    this.intro.addEventListener("pointerup", e => this.introState.start(e));
    this.game.addEventListener("pointerup", e => this.playState.flipCard(e));
    this.messages.addEventListener("pointerup", e => this.endGame.action(e));
  }

  toOriginalCondition(elem, css = true, style = false) {
    if (css) elem.setAttribute("class", elem.dataset.originalClass);
    if (style) elem.removeAttribute("style");
  }

  updateGameValue(type, modify = false) {
    switch (true) {
      case type === "timer":

        if (modify) {
          this.timePoints += this.additionalTime;
          this.checkpointTime = this.timePoints;
          
          this.counters.timer.nextElementSibling.classList.add("multiplier--animate");
          setTimeout(() => {
            this.counters.timer.nextElementSibling.classList.remove("multiplier--animate");
          }, 1000);
        }

        this.counters.timer.textContent = this.timePoints;
        this.game.dataset.timeLeft = this.timePoints;
        break;

      case type === "cards":
        let result = this.cards.length * 2;
        this.counters.cardsInDeck.textContent = result;
        break;

      case type === "lives":
        this.counters.lives.textContent = this.lives;
        this.messages.dataset.lives = this.lives;
        break;
    }
  }

  startTimer() {
    this.updateGameValue("timer");
    
    return setInterval(() => {
      this.timePoints--;
      this.updateGameValue("timer");
      
      if (this.timePoints < 0) {
        
        setTimeout(() => {
          this.timePoints = 0;
          this.updateGameValue("timer");
        }, 0);

        clearInterval(this.timer);
      }
    }, 1000);
  }

  clearPlayableField() {
    this.playState.isCheckpoint = false;
    for ( let card of Array.from(this.playState.playableField.children) ) {
      card.remove();
    }
  }

  _preloadCards() {

    for (let char of this.content) {

      let backface = document.createElement("img");
      backface.src = "../!source/img/cards/card_back.png";
      
      let imgPreload = document.createElement("img");
      imgPreload.src = char[1];

      let cardBody = createCard(char, "card");
      let cardBack = createCard(char, "card__back", cardBody, backface);
      let cardFace = createCard(char, "card__face", cardBody, imgPreload);

      //this.cards.push(cardBody);
      this.cachedCards.push(cardBody); 
    }

    function createCard(char, CSSclass, body = false, ...part) {
      let newDIV = document.createElement("div");
      newDIV.classList.add(CSSclass);

      if (!body) {
        newDIV.dataset.side="back";
        newDIV.dataset.char = char[0];
      } else {
        newDIV.append(part[0]);
        body.append(newDIV);
      }

      return newDIV;
    }
  }

  updateCardsDeck() {
    this.shuffle(this.cachedCards);
    this.cards = this.cachedCards.slice(0, 10);
  }

  _generateStars(amount, target) {
    let skybox = target.querySelector(".skybox");
    
    resizeSkybox();

    for (let i = 0; i < amount; i++) {
      let star = document.createElement("div");
      star.classList.add("skybox__star");

      star.style.opacity = Math.random();
  
      skybox.append(star);
  
      star.style.top = this.getRandomInt(0, 100) + "%";
      star.style.left = this.getRandomInt(0, 100) + "%";
    }

    let throttle = false;
    let resizeObserver = new ResizeObserver(rec => {
      if (throttle) {
        clearTimeout(throttle);
        throttle = false;
      }
      
      throttle = setTimeout(() => {
        console.log(rec)
        resizeSkybox();
      }, 100);
    });

    resizeObserver.observe(document.documentElement);

    function resizeSkybox() {
      //let calcLeftShift = document.documentElement.getBoundingClientRect().left - target.getBoundingClientRect().left;
      //skybox.style.left = calcLeftShift + "px";
      skybox.style.width = document.documentElement.clientWidth + "px";
      skybox.style.height = document.documentElement.clientHeight + "px";
    }
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
  
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

}

class AudioController {
  constructor() {
    this.intro = new Audio("data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
    this.game = new Audio("data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
    this.lose = new Audio("data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
    this.win = new Audio("data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");

    this.introSRC = "!source/sound/star-wars-main-theme-song.mp3";
    this.gameSRC = "!source/sound/duel-of-the-fates.mp3";
    this.loseSRC = "!source/sound/darth-vader-breathing-alt.mp3";
    this.winSRC = "!source/sound/the-throne-room.mp3";
    
    this.intro.autoplay = true;
    this.game.autoplay = true;
    this.lose.autoplay = true;
    this.win.autoplay = true;
    
    this.click = [
      1, //iterator
      new Audio("!source/sound/ls-on-1.mp3"),
      new Audio("!source/sound/ls-on-2.mp3"),
      new Audio("!source/sound/ls-on-3.mp3"),
    ];
    
    this.matched = [
      1, //iterator
      new Audio("!source/sound/hit-1.mp3"),
      new Audio("!source/sound/hit-2.mp3"),
      new Audio("!source/sound/hit-3.mp3"),
    ];
    
    this.unmatched = [
      1, //iterator
      new Audio("!source/sound/mis-1.mp3"),
      new Audio("!source/sound/mis-2.mp3"),
    ];

    for (let item of [this.click, this.matched, this.unmatched]) {
      for (let sound of item) {
        if (item.indexOf(sound) === 0) continue;
        sound.volume = 0.3;
      }
    }

    // fix default prevention of autoplay
    let thisController = this;
    this._fixAutoplay = function() {
      console.log(thisController);
      thisController.intro.play();
      thisController.game.play();
      thisController.lose.play();
      thisController.win.play();
    }
    document.documentElement.addEventListener("pointerup", thisController._fixAutoplay);
    document.documentElement.onpointerup = e => {
      document.documentElement.removeEventListener("pointerup", thisController._fixAutoplay);
    }
    
  }

  play(sfx) {
    if (Array.isArray(sfx)) {
      sfx[0]++;
      if (sfx[0] === sfx.length) sfx[0] = 1;
      sfx = sfx[sfx[0]];
    }

    //if (sfx === this.game) sfx.src = this.gameSRC;
    switch (true) {
      case sfx === this.intro:
        sfx.src = this.introSRC;
        break;
        
      case sfx === this.game:
        sfx.src = this.gameSRC;
        sfx.loop = true;
        break;
        
      case sfx === this.lose:
        sfx.src = this.loseSRC;
        sfx.loop = true;
        break;

      case sfx === this.win:
        sfx.src = this.winSRC;
        sfx.loop = true;
        break;
    }

    //sfx.load();
    //sfx.src = sfx.src;
    sfx.play();
  }
  
  stop(sfx, type, ...stepToStop) {
    switch (true) {
      case type === "hard":
        fullStop(sfx);
        break;

      case type === "soft":
        let initialVolume = sfx.volume; 
        let currentVolume = initialVolume;

        let interval = null;
        
        interval = setInterval(() => {
          console.log(currentVolume);
          currentVolume -= 0.1;
          
          if (currentVolume < 0) {
            sfx.volume = initialVolume;
            fullStop(sfx);
            clearInterval(interval);
          }

          if (currentVolume > 0) sfx.volume = currentVolume;
        }, stepToStop[0]);
        break;
    }

    function fullStop(sfx) {
      sfx.pause();
      sfx.currentTime = 0;
    }
  }
}

class IntroState {

  constructor(parent) {

    this.parent = parent;

    this.skipButton = document.querySelector(".intro__skip");
    this.firstScreen = document.querySelector(".intro__first-screen");
    this.logoScreen = document.querySelector(".intro__logo");
    this.scrollerScreen = document.querySelector(".intro__scroller");

    this.logoState = false;
    this.scrollerState = false;
    this.gameState = false;

    this.skipButtonIsActive = false;
    
  }

  start(e) {
    if (this.parent.isLocked) return;
    if (!e.target.closest(".intro__first-screen")) return;

    this.parent.isLocked = true;
    this.skipButtonIsActive = true;

    this.skipButton.onpointerup = e => this._skip(e);

    this.skipButton.classList.add("intro__skip--show");
    this.firstScreen.classList.add("intro__first-screen--hide");
    this.firstScreen.lastElementChild.style.opacity = "0";

    this.logoState = this._iniciateLogoScreen(5000);
    this.scrollerState = this._iniciateScrollerScreen(10000);
    this.gameState = this._iniciateGameScreen(35000);
    
  }

  removeLoader() {
    this.firstScreen.lastElementChild.children[0].classList.remove("loader--enabled");
    this.firstScreen.lastElementChild.children[1].classList.add("click--enabled");
    this.firstScreen.lastElementChild.children[2].classList.add("touch--enabled");
  }

  _skip(e) {
    if (!this.skipButtonIsActive) return;
    if (!e.target.closest(".intro__skip")) return;

    this.skipButtonIsActive = false;

    if (this.logoState) clearTimeout(this.logoState);
    if (this.scrollerState) clearTimeout(this.scrollerState);
    if (this.gameState) clearTimeout(this.gameState);

    this._iniciateGameScreen(0);
  }

  _iniciateLogoScreen(delay) {
    return setTimeout(() => {
      this.firstScreen.style.display = "none";
      this.logoScreen.classList.add("intro__logo--animate");
      this.parent.audioController.play(this.parent.audioController.intro);
    }, delay);
  }

  _iniciateScrollerScreen(delay) {
    return setTimeout(() => {
      this.logoScreen.classList.remove("intro__logo--animate");
      this.logoScreen.style.display = "none";
      this.scrollerScreen.style.display = "block";
    }, delay);
  }

  _iniciateGameScreen(delay) {
    return setTimeout(() => {
      this.parent.intro.classList.add("intro--hide");
      this.skipButton.classList.remove("intro__skip--show");
      this.skipButton.classList.add("intro__skip--hide");

      this.parent.audioController.stop(this.parent.audioController.intro, "soft", 500);

      setTimeout(() => {
        //document.documentElement.style.overflowY = "auto";
        //document.body.style.overflowY = "auto";

        setTimeout(() => {

          this.parent.toOriginalCondition(this.skipButton)
          this.parent.toOriginalCondition(this.parent.intro);
          this.parent.toOriginalCondition(this.firstScreen, true, true);
          this.parent.toOriginalCondition(this.firstScreen.lastElementChild, false, true);
          this.parent.toOriginalCondition(this.logoScreen, true, true);
          this.parent.toOriginalCondition(this.scrollerScreen, false, true);

          this.parent.intro.style.display = "none";

          this.parent.game.dataset.isActive = "true";

        }, 1000);
      }, 5000);
    }, delay);
  }

}

class PlayState {

  constructor(parent) {

    this.parent = parent;

    this.statsField = document.querySelector(".game__stats");
    this.playableField = document.querySelector(".game__mainfield");

    this.observer = new MutationObserver(rec => this._playStateChanges(rec));

    this.uniqCardsPerLevel = 2;
    this.isCheckpoint = false;

    this.pickedCard = null;
    this.hand = [];
  }

  _playStateChanges(rec) {

    switch(true) {
      case (rec[0].attributeName === "data-is-active" && this.parent.game.dataset.isActive === "true"):
        
        document.documentElement.style.overflowY = "auto";
        document.body.style.overflowY = "auto";

        this.parent.audioController.play(this.parent.audioController.game);

        this.parent.game.classList.add("game--active");
        this.statsField.classList.add("game--active");
        this.parent.skyboxGame.classList.add("game--active");

        this.parent.game.before(this.statsField);
        this.parent.game.before(this.parent.skyboxGame);
        this.parent.skyboxGame.classList.add("skybox--fixed");

        setTimeout(() => {

          if (this.isCheckpoint) {
            this._showCards(this.parent.timings.toShowCard);

            this._upateGameStats();
            
          } else {
            this.generateCards(this.uniqCardsPerLevel, this.playableField);
          }

        }, this.parent.timings.toShowGameField);
        break;

      case (rec[0].attributeName === "data-is-active" && this.parent.game.dataset.isActive === "false"):
        this.parent.toOriginalCondition(document.documentElement, false, true);
        this.parent.toOriginalCondition(document.body, false, true);
      
        this.parent.game.prepend(this.statsField);
        this.parent.game.prepend(this.parent.skyboxGame);
        break;
      
      case (rec[0].attributeName === "data-unmatched-cards" && this.parent.game.dataset.unmatchedCards === "0"):
        console.log("All cards matched!");

        if (this.parent.cards.length === 0) this._endGame("win");
        else this._startNewLevel();
        break;

      case (rec[0].attributeName === "data-time-left" && this.parent.game.dataset.timeLeft === "-1"):
        this.isCheckpoint = true;
        this._endGame("lose");
        break;
    }

  }

  generateCards(amount, target) {

    if (this.parent.cards.length < this.uniqCardsPerLevel) amount = this.parent.cards.length;
    
    for (let i = 0; i < amount; i++) {
  
      let newCard = this.parent.cards.pop();
      target.append(newCard);

      let newCardClone = newCard.cloneNode(true);
      target.append(newCardClone);
    
    }
    
    this._shuffleCards(target);
    this._showCards(this.parent.timings.toShowCard);

    this.parent.updateGameValue("cards");
    this._upateGameStats();

  }

  _upateGameStats() {
    let cardsOnTable = this.playableField.children.length; 

    setTimeout(() => {
      if (this.isCheckpoint) this.isCheckpoint = false;

      this.parent.isLocked = false;
      this.parent.timer = this.parent.startTimer();
    }, this.parent.timings.toShowCard * cardsOnTable);

    this.parent.game.dataset.unmatchedCards = cardsOnTable;
  }

  _shuffleCards(target) {
    let newArr = Array.from(target.children);
  
    this.parent.shuffle(newArr);

    for (let i = newArr.length; i >= 0; i--) {
      let randomIndex = this.parent.getRandomInt(0, i);
      target.append(newArr[randomIndex]);
    }
  }

  _showCards(speed, i = 0) {
    Array.from(this.playableField.children).forEach(item => {
      setTimeout(() => item.classList.add("card--appear"), i);
      i += speed;
    });
  }

  flipCard(e) {
    if (this.parent.isLocked) return;
    this.pickedCard = e.target.closest(".card");

    if (!this.pickedCard) return;
    if (this.pickedCard.dataset.side === "face") return;

    this.parent.audioController.play(this.parent.audioController.click);

    this.pickedCard.dataset.side = "face";
    this.pickedCard.classList.add("card--picked");
    
    let currentSuperCard = this.playableField.querySelector(".card--super");
    
    if (currentSuperCard) {
      currentSuperCard.classList.remove("card--super");  
    }

    this.pickedCard.classList.add("card--super");

    Array.from(this.pickedCard.children).forEach((item) => {
      item.classList.add("rotate");
    });

    this._fillHand();
  }

  _fillHand() {
    this.hand.push(this.pickedCard.dataset.char);

    if (this.hand.length === 2) this._matchCards();
  }

  _matchCards() {
    this.parent.isLocked = true;
    this.hand[0] === this.hand[1] ? this._cardsMatched() : this._cardsMismatched();
    this.hand = [];
  }

  _cardsMatched() {
    return setTimeout(() => {

      this.parent.audioController.play(this.parent.audioController.matched);

      this.parent.isLocked = false;
      this._disableCards();

      this.parent.game.dataset.unmatchedCards -= 2; 

    }, this.parent.timings.toCheckMatch);
  }

  _disableCards() {
    Array.from(document.querySelectorAll(".card--picked")).forEach(item => {
      item.classList.add("card--disabled");
      item.classList.remove("card--picked");
    });
  }

  _enableCards() {
    this._flipCardsBack(".card--disabled");
    
    Array.from(document.querySelectorAll(".card--disabled")).forEach(item => {
      item.classList.remove("card--disabled");
      
      setTimeout(() => {
        item.classList.remove("card--appear");
        item.classList.add("card--disappear");
      }, this.parent.timings.toFlipCard);
      
      setTimeout(() => {
        item.classList.remove("card--disappear");
      }, this.parent.timings.toFlipCard + this.parent.timings.toFadeCard);
    });
  }

  _cardsMismatched() {
    return setTimeout(() => {
      this.parent.audioController.play(this.parent.audioController.unmatched);
      this.parent.isLocked = false;
      this._flipCardsBack(".card--picked");
    }, this.parent.timings.toCheckMatch);
  }

  _flipCardsBack(selector) {
    Array.from(document.querySelectorAll(selector)).forEach(item => {
      
      item.dataset.side = "back";

      for (let side of item.children) {
        side.classList.remove("rotate");
      }
      
      setTimeout(() => {
        if (item.dataset.side === "back") item.classList.remove("card--picked");
      }, this.parent.timings.toFlipCard);
    });
  }

  _startNewLevel() {
      
    this.parent.isLocked = true;
    
    clearInterval(this.parent.timer);

    this._enableCards();
    
    setTimeout(() => {
      this.parent.isLocked = false;

      this.parent.updateGameValue("timer", true);
      this.generateCards(this.uniqCardsPerLevel, this.playableField);

      this.parent.game.scrollIntoView();
      
    }, this.parent.timings.toFlipCard + this.parent.timings.toFadeCard);
  }

  _endGame(result) {

    this.parent.isLocked = true;
    this.hand = [];

    if (result === "win") clearInterval(this.parent.timer);

    this.parent.audioController.stop(
      this.parent.audioController.game,
      "soft",
      (this.parent.timings.toFlipCard + this.parent.timings.toFadeCard + this.parent.timings.toFadeGameField) / 10
    );

    Array.from(this.playableField.children).forEach((item) => {
      item.classList.remove("card--picked");
      item.children[0].classList.remove("rotate");
      item.children[1].classList.remove("rotate");
      
      setTimeout(() => {
        item.classList.remove("card--disabled", "card--appear");
        item.classList.add("card--disappear");

        item.dataset.side = "back";
      }, this.parent.timings.toFlipCard);

      setTimeout(() => {
        item.classList.remove("card--disappear");
      }, this.parent.timings.toFlipCard + this.parent.timings.toFadeCard);
    });

    setTimeout(() => {
      this.parent.game.scrollIntoView();

      this.parent.game.classList.remove("game--active");
      this.statsField.classList.remove("game--active");
      this.parent.skyboxGame.classList.remove("game--active");
      
      this.parent.game.classList.add("game--hide");
      this.statsField.classList.add("game--hide");
      this.parent.skyboxGame.classList.add("game--hide");

    }, this.parent.timings.toFlipCard + this.parent.timings.toFadeCard);
    
    setTimeout(() => {
      console.log(result);
      this.parent.game.dataset.isActive = "false";
      this.parent.toOriginalCondition(this.parent.game);
      this.parent.toOriginalCondition(this.statsField);
      this.parent.toOriginalCondition(this.parent.skyboxGame);

      this.parent.isLocked = false;

      this.parent.messages.dataset.isActive = "true";
      setTimeout(() => this.parent.messages.dataset.gameResult = result, 0);
    }, this.parent.timings.toFadeCard + this.parent.timings.toFlipCard + this.parent.timings.toFadeGameField);
  }

}

class EndGame {

  constructor(parent) {
    this.parent = parent;

    this.messageVictory = document.querySelector(".message--victory");
    this.shadowMessageVictory = this.messageVictory.querySelector(".logo__shadow");

    this.messageLose = document.querySelector(".message--lose");
    this.shadowMessageLose = this.messageLose.querySelector(".logo__shadow");
    
    this.continueButton = document.querySelector("[data-role=\"continue\"]");

    this.observer = new MutationObserver(rec => this._messagesChanges(rec));
  }

  _messagesChanges(rec) {
    switch (true) {
      case (rec[0].attributeName === "data-is-active" && this.parent.messages.dataset.isActive === "true"): 
        this.parent.messages.classList.add("messages-container--active");
        break;

      case (rec[0].attributeName === "data-is-active" && this.parent.messages.dataset.isActive === "false"):
        this.parent.toOriginalCondition(this.parent.messages);
        this.parent.messages.dataset.gameResult = "pending";
        break;

      case (rec[0].attributeName === "data-game-result" && this.parent.messages.dataset.gameResult === "win"):
        this.messageVictory.classList.add("message--active");
        this.shadowMessageVictory.classList.add("logo__shadow--victory");
        this.parent.audioController.play(this.parent.audioController.win);
        break;

      case (rec[0].attributeName === "data-game-result" && this.parent.messages.dataset.gameResult === "lose"):
        this.messageLose.classList.add("message--active");
        this.shadowMessageLose.classList.add("logo__shadow--lose");
        this.parent.audioController.play(this.parent.audioController.lose);
        break;
    }
  }

  action(e) {
    if (this.parent.isLocked) return;
    if (!e.target.classList.contains("message__button")) return;

    if (e.target.dataset.role === "restart") this._restart(e);
    if (e.target.dataset.role === "continue") this._continue(e);

    this.parent.audioController.stop(this.parent.audioController.lose, "soft", 150);
    this.parent.audioController.stop(this.parent.audioController.win, "soft", 150);
  }

  _restart(e) {
    this.parent.isLocked = true;

    let currentMessage = e.target.closest(".message");

    currentMessage.classList.add("message--hiding");

    setTimeout(() => {
      this.parent.toOriginalCondition(currentMessage);
      this.parent.toOriginalCondition(this.shadowMessageVictory);
      this.parent.toOriginalCondition(this.shadowMessageLose);
      this.parent.messages.dataset.isActive = "false";

      this.parent.timePoints = this.parent.initialTime;
      this.parent.lives = this.parent.initialLives;
      this.parent.updateGameValue("lives");

      this.parent.counters.timer.textContent = "--";
      this.parent.counters.cardsInDeck.textContent = "--";

      this.parent.game.dataset.timeLeft = "pending";
      this.parent.game.dataset.unmatchedCards = "pending";
      
      this.parent.cards = this.parent.cachedCards.slice();
      this.parent.shuffle(this.parent.cards);

      this.parent.clearPlayableField();

      this.parent.toOriginalCondition(this.continueButton);

      this.parent.toOriginalCondition(this.parent.intro, false, true);
      this.parent.isLocked = false;

    }, 1500);
  }

  _continue(e) {

    if (e.target.classList.contains("message__button--disabled")) return;

    this.parent.isLocked = true;

    this.parent.lives--;
    this.parent.updateGameValue("lives");

    this.messageLose.classList.add("message--hiding");

    setTimeout(() => {
      this.parent.toOriginalCondition(this.messageLose);
      this.parent.toOriginalCondition(this.shadowMessageLose);
      
      this.parent.messages.dataset.isActive = "false";

      this.parent.timePoints = this.parent.checkpointTime;

      this.parent.counters.timer.textContent = "--";

      this.parent.game.dataset.isActive = "true";
      this.parent.game.dataset.timeLeft = this.parent.timePoints;
      this.parent.game.dataset.unmatchedCards = "pending";

      this.parent.isLocked = false;

    }, 1500);

    if (this.parent.lives === 0) e.target.classList.add("message__button--disabled");
  }

}

let game = new Game(charsArr);
game.start();