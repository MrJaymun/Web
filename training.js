let canvas = document.getElementById("canvas");
let resultElement = document.getElementById("result");
var nick = document.getElementsByClassName('nickname'); 
let ctx = canvas.getContext("2d");
var state = {
    score: 0
}
let pauser = false;
var isGame = false;

document.getElementById("pause").addEventListener("click", () => {pauser = !pauser})
// Класс для отслеживания событий
class EventObserver {
    constructor () {
        this.observers = []
    }

    subscribe (fn) {
        this.observers.push(fn)
    }

    unsubscribe (fn) {
        this.observers = this.observers.filter(subscriber => subscriber !== fn)
    }

    broadcast (data) {
        this.observers.forEach(subscriber => subscriber(data))
    }
}

const observer = new EventObserver()


observer.subscribe(data => {
    if (resultElement.innerHTML !== data.score){
        resultElement.innerHTML = data.score
    }
})


let config = {
    img: {
        fish: {
            s: "img/fish_root_s.svg",
            m: "img/fish_root_m.svg",
            l: "img/fish_root_l.svg"
        }
    }
}



class Fish extends Image {

    constructor() {
        super();
        this.speed = this.makeSpeed(); // Скорость рыбы
        this.image = new Image();
        this.xbegin = this.makeStartCoordinates()[0];
        this.ybegin = this.makeStartCoordinates()[1];
        this.xcurrent = this.xbegin;
        this.ycurrent = this.ybegin;
        this.xpurpose; // Х координата цели, куда двигаться
        this.ypurpose; // У координата цели, куда двигаться
        this.time = 10; // Время до уплытия
        this.active = false; // Находится ли рыба в зоне видимости игрока
        this.type = this.makeType(); // Тип рыбы, от него зависит отображение
    }

    //Определение типа рыбы
    makeType() {
        let x = Math.random(),
            type;
        if (x > 0.66) {
            type = 3;
        } else if (x < 0.33) {
            type = 1;
        } else {
            type = 2;
        }
        return type;
    }

    makePhoto() {
        var photo, color;
        if (this.type === 1) {
            photo = config.img.fish.l;
        } else if (this.type === 2) {
            photo = config.img.fish.m;
        } else {
            photo = config.img.fish.s;
        }
        return photo;
    }

    // Создание начальных координат - использовать при начале игры и смерти
    makeStartCoordinates() {
        let xbegin, ybegin;
        if (Math.random() > 0.5) {
            xbegin = Math.floor(Math.random() * 101 - 100);
        } else {
            xbegin = Math.floor(Math.random() * 101 + 500);
        }
        if (Math.random() > 0.5) {
            ybegin = Math.floor(Math.random() * 101 - 100);
        } else {
            ybegin = Math.floor(Math.random() * 101 + 500);
        }
        return [xbegin, ybegin]
    }

    // Создание новых координат цели - использовать при попадании в игровую зону или при достижении старой отметки
    makePurposeCoordinates() {
        this.xpurpose = Math.floor(Math.random() * 501);
        this.ypurpose = Math.floor(Math.random() * 501);
    }

    // Создание скорости рыбы - использовать при рождении
    makeSpeed() {
        let x = Math.random(),
            speed;
        if (x > 0.66) {
            speed = 1.5;
        } else if (x < 0.33) {
            speed = 0.5;
        } else {
            speed = 1;
        }
        return speed;
    }

    // Переход рыбки в игровую зону
    becomeActive(xcurrent, ycurrent) {
        if (xcurrent < 500 && xcurrent > 0 && ycurrent < 500 && ycurrent > 0) {
            this.active = true
            this.xpurpose = this.makePurposeCoordinates()[0]; // Х координата цели, куда двигаться
            this.ypurpose = this.makePurposeCoordinates()[1]; // У координата цели, куда двигаться
        }
    }

    // Движение рыбы
    move(xcurrent, ycurrent, xpurpose, ypurpose) {
        if (xpurpose > xcurrent) {
            this.xcurrent += this.speed;
        } else {
            this.xcurrent -= this.speed;
        }
        if (ypurpose > ycurrent) {
            this.ycurrent += this.speed;
        } else {
            this.ycurrent -= this.speed;
        }
    }

    //Достигла ли рыба цели
    isOver(xcurrent, ycurrent, xpurpose, ypurpose) {
        if (xcurrent > xpurpose - 5 && xcurrent < xpurpose + 5 && ycurrent > ypurpose - 5 && ycurrent < ypurpose + 5) {
            this.makePurposeCoordinates();
        }
    }

    //Нажатие на рыбу
    death() {
        this.xcurrent = this.makeStartCoordinates()[0];
        this.ycurrent = this.makeStartCoordinates()[1];
        this.makePurposeCoordinates;
        state.score += this.type * 10;
        observer.broadcast({score: state.score})
        this.type = this.makeType();
        this.src = this.makePhoto();
        this.fill = "red";

    }

}


class LeaderBoardUnit{
    constructor(){
        this.name = " ";
        this.value = 999999;
    }
}



var leaderBoard = [
    { name: '', value: 999999 },
    { name: '', value: 999999 },
    { name: '', value: 999999 },
    { name: '', value: 999999 },
    { name: '', value: 999999 },
    { name: '', value: 999999 },
    { name: '', value: 999999 },
    { name: '', value: 999999 },
    { name: '', value: 999999 },
    { name: '', value: 999999 },
    { name: '', value: 999999 }
  ];



class Form {

    form = null
    value = {}
    eventListener = null
    constructor(formName, eventListener) {
        this.form = formName
        this.eventListener = eventListener
        this.form.addEventListener("submit", this.submitForm)
        this.form.addEventListener("input", this.changeForm)
    }

    changeForm = (event) => {
        this.form["button"].disabled = !event.target.value
    }

    submitForm = (event) => {
        event.preventDefault()
        const formData = new FormData(this.form)
        for (let pair of formData.entries()) {
            this.value[pair[0]] = pair[1]
        }
        this.eventListener(this.value)
    }
}

 

new Form(document.forms["username"], (value) => {
    resultElement.innerHTML = 0;
    state.score = 0;
    leaderBoard[10].name = value.nameUser;
    console.log(value);
    nick[0].innerHTML = "Имя пользователя - " + value.nameUser;
    console.log(leaderBoard[10].name);
    isGame = true;
    console.log(isGame);
    document.getElementById("result").se
    document.getElementsByClassName('menu')[0].style.display = "none";
    
    if(isGame){
        times = [
            0,
            1,
            30,
        ];
        
        timer(times);
        let bg = new Image();
        document.getElementsByClassName('canvas')[0].style.display = "block";
        document.getElementsByClassName('info')[0].style.display = "block";
       
        
      
        
      
        let fishes = {}
        for (var i = 0; i < 10; ++i) {
            fishes[i] = new Fish();
            fishes[i].src = fishes[i].makePhoto();
        
            fishes[i].makePurposeCoordinates();
        }
        if(value.nameUser == "tester"){
            bg.src = "img/startmenu.png";
        }
        else{
            bg.src = "img/bg.png";
        }
        
        
        i
        
        function draw() {
            console.log(pauser);
           if(!pauser){
            ctx.drawImage(bg, 0, 0);
        
            for (var i = 0; i < 10; ++i) {
                fishes[i].move(fishes[i].xcurrent, fishes[i].ycurrent, fishes[i].xpurpose, fishes[i].ypurpose);
                fishes[i].isOver(fishes[i].xcurrent, fishes[i].ycurrent, fishes[i].xpurpose, fishes[i].ypurpose);
                ctx.drawImage(fishes[i], fishes[i].xcurrent, fishes[i].ycurrent);
            }
        
            canvas.onclick = function() {
                
                    for (var i = 0; i < 10; ++i) {
                        console.log(event)
                        if (((fishes[i].xcurrent - 5) <= (event.layerX)) && ((event.layerX) <= (fishes[i].xcurrent + 75)) &&
                            (fishes[i].ycurrent - 5) <= (event.layerY) && (event.layerY) <= (fishes[i].ycurrent + 35) &&
                            fishes[i].type === 1
                        ) {
                            console.log("hello1");
                            fishes[i].death();
                            break
                        }
            
                        if ((fishes[i].xcurrent - 5) <= (event.layerX) && (event.layerX) <= (fishes[i].xcurrent + 55) &&
                            (fishes[i].ycurrent - 5) <= (event.layerY) && (event.layerY) <= (fishes[i].ycurrent + 25) &&
                            fishes[i].type === 2
                        ) {
                            console.log("hello2");
                            fishes[i].death();
                            break
                        }
            
                        if ((fishes[i].xcurrent - 5) <= (event.layerX) && (event.layerX) <= (fishes[i].xcurrent + 25) &&
                            (fishes[i].ycurrent - 5) <= (event.layerY) && (event.layerY) <= (fishes[i].ycurrent + 15) &&
                            fishes[i].type === 3
                        ) {
                            console.log("hello3");
                            fishes[i].death();
                            break
                        }
                    }
                
           }
            
               
            }
            requestAnimationFrame(draw)
        }
        bg.onload = draw;
    }

})

;(function() {
	'use strict';
 
})();
const now = new Date();

const hBox = document.getElementById('hour'),
	  mBox = document.getElementById('minutes'),
	  sBox = document.getElementById('seconds');
 

let times = [
		0,
		1,
		30,
	];

    

    const timer = times => {
        
        let tm = setInterval(() => {
           
            if(!pauser){
                times[2]--;
            }
          
            if (times[0] == 0 && times[1] == 0 && times[2] == 0) {
               
                clearInterval(tm);
                resultElement.innerHTML = 0;
                document.getElementsByClassName('menu')[0].style.display = "block";
                
                document.getElementsByClassName('canvas')[0].style.display = "none";
                document.getElementsByClassName('info')[0].style.display = "none";
                
              
                leaderBoard[10].value = state.score;
                state.score = 0;
                var one = document.getElementById('one');
                var two = document.getElementById('two');
                var three = document.getElementById('three');
                var four = document.getElementById('four');
                var five = document.getElementById('five');
                var six = document.getElementById('six');
                var seven = document.getElementById('seven');
                var eight = document.getElementById('eight');
                var nine = document.getElementById('nine');
                var ten = document.getElementById('ten');
                leaderBoard.sort(function (a, b) {
                    if (a.value > b.value) {
                      return 1;
                    }
                    if (a.value < b.value) {
                      return -1;
                    }
                    return 0;
                  });
                if(leaderBoard[0].value != 999999){
                    document.getElementsByClassName('one')[0].style.display = "block";
                    one.innerHTML = leaderBoard[0].name + " - " + leaderBoard[0].value;
                   
                  
                 }
                 if(leaderBoard[1].value != 999999){
                    document.getElementsByClassName('two')[0].style.display = "block";
                    two.innerHTML = leaderBoard[1].name + " - " + leaderBoard[1].value;
                    
                 }
                 if(leaderBoard[2].value != 999999){
                    document.getElementsByClassName('three')[0].style.display = "block";
                    three.innerHTML = leaderBoard[2].name + " - " + leaderBoard[2].value;
                   
                 }
                 if(leaderBoard[3].value != 999999){
                    document.getElementsByClassName('four')[0].style.display = "block";
                    four.innerHTML = leaderBoard[3].name + " - " + leaderBoard[3].value;
                   
                 }
                 if(leaderBoard[4].value != 999999){
                    document.getElementsByClassName('five')[0].style.display = "block";
                    five.innerHTML = leaderBoard[4].name + " - " + leaderBoard[4].value;
                    
                 }
                 if(leaderBoard[5].value != 999999){
                    document.getElementsByClassName('six')[0].style.display = "block";
                    six.innerHTML = leaderBoard[5].name + " - " + leaderBoard[5].value;
                  
                 }
                 if(leaderBoard[6].value != 999999){
                    document.getElementsByClassName('seven')[0].style.display = "block";
                    seven.innerHTML = leaderBoard[6].name + " - " + leaderBoard[6].value;
                   
                 }
                 if(leaderBoard[7].value != 999999){
                    document.getElementsByClassName('eight')[0].style.display = "block";
                    eight.innerHTML = leaderBoard[7].name + " - " + leaderBoard[7].value;
                  
                 }
                 if(leaderBoard[8].value != 999999){
                    document.getElementsByClassName('nine')[0].style.display = "block";
                    nine.innerHTML = leaderBoard[8].name + " - " + leaderBoard[8].value;
                   
                 }
                 if(leaderBoard[9].value != 999999){
                    document.getElementsByClassName('ten')[0].style.display = "block";
                    ten.innerHTML = leaderBoard[9].name + " - " + leaderBoard[9].value;
                   
                 }
                 
            } else if (times[2] == -1) {
                
                times[2] = 59;
                times[1]--;
            } else if (times[1] == -1) {
              
                times[1] = 59;
                times[0]--;
            }
     
           
            let h = (times[0] < 10) ? '0' + times[0] : times[0],
                m = (times[1] < 10) ? '0' + times[1] : times[1],
                s = (times[2] < 10) ? '0' + times[2] : times[2];
     
           
            showTimer(h, m, s);
        }, 1000);
    }


    const showTimer = (hour, min, sec) => {
        hBox.innerHTML = hour;
        mBox.innerHTML = min;
        sBox.innerHTML = sec;
    }
  
   
