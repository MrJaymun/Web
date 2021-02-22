var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var score = 0;

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

    makeType(){
        var x = Math.random(),
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

    makePhoto(){
        var photo;
        if(this.type == 1 ){
            photo = "fishbig.png";
        }
        else if(this.type == 2){
            photo = "fishmedium.png";
        }
        else{
            photo = "fishsmall.png";
        }
        return photo;
    }

    // Создание начальных координат - использовать при начале игры и смерти
    makeStartCoordinates() {
        var xbegin, ybegin;
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
        var x = Math.random(),
            speed;
        if (x > 0.66) {
            speed = 3;
        } else if (x < 0.33) {
            speed = 1;
        } else {
            speed = 2;
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
    death(){
        this.xcurrent = this.makeStartCoordinates()[0];
        this.ycurrent = this.makeStartCoordinates()[1];
        this.makePurposeCoordinates;
        score += this.type*10;
        this.type = this.makeType();
        this.src = this.makePhoto();
    }

}




var bg = new Image();




 var fishes = {}
 for (var i = 0; i < 10; ++i) {
 fishes[i] = new Fish();
 fishes[i].src=fishes[i].makePhoto();
 
 fishes[i].makePurposeCoordinates();
 }

bg.src = "bg.png";


function draw() {
    ctx.drawImage(bg, 0, 0);

    for (var i = 0; i < 10; ++i) {
        fishes[i].move(fishes[i].xcurrent,fishes[i].ycurrent, fishes[i].xpurpose, fishes[i].ypurpose);
        fishes[i].isOver(fishes[i].xcurrent,fishes[i].ycurrent, fishes[i].xpurpose, fishes[i].ypurpose)
        ctx.drawImage(fishes[i], fishes[i].xcurrent, fishes[i].ycurrent);
    }


    requestAnimationFrame(draw)
}

bg.onload = draw;