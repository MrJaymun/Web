let canvas = document.getElementById("canvas");
let resultElement = document.getElementById("result");
let ctx = canvas.getContext("2d");
let state = {
    score: 0
}
var isGame = false;


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
        this.value = -1;
    }
}

let leaderBoard = {}
for (var i = 0; i < 11; i++) {
    leaderBoard[i] = new LeaderBoardUnit();
}



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
    leaderBoard[10].name = value;
    console.log(value);
    console.log(leaderBoard[10].name);
    isGame = true;
    console.log(isGame);
    document.getElementsByClassName('menu')[0].style.display = "none";
   
    if(isGame){
        let bg = new Image();
        
      
        
        
        let fishes = {}
        for (var i = 0; i < 10; ++i) {
            fishes[i] = new Fish();
            fishes[i].src = fishes[i].makePhoto();
        
            fishes[i].makePurposeCoordinates();
        }
        
        bg.src = "img/bg.png";
        
        
        function draw() {
            

            ctx.drawImage(bg, 0, 0);
        
            for (var i = 0; i < 10; ++i) {
                fishes[i].move(fishes[i].xcurrent, fishes[i].ycurrent, fishes[i].xpurpose, fishes[i].ypurpose);
                fishes[i].isOver(fishes[i].xcurrent, fishes[i].ycurrent, fishes[i].xpurpose, fishes[i].ypurpose);
                ctx.drawImage(fishes[i], fishes[i].xcurrent, fishes[i].ycurrent);
            }
        
            canvas.onclick = function() {
                if(state.score > 100){
                    document.getElementsByClassName('menu')[0].style.display = "block";
                    document.getElementsByClassName('one')[0].style.display = "block";
                    
                  
                    leaderBoard[10].value = state.score;
                    var el = document.getElementById('one');
                    el.innerHTML = leaderBoard[10].name + " - " + leaderBoard[10].value;
                    console.log(leaderBoard[10].name + " - " + leaderBoard[10].value);
                    document.body.innerHTML(el);
                    state.score = 0;
                    
                   
                }
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
            requestAnimationFrame(draw)
        }
        bg.onload = draw;
        }

})

