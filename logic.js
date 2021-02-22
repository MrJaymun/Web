class Fish{

    fish(){
      var speed;// Скорость рыбы
      var image = new Image();
      var xcurrent;
      var ycurrent;
      var xbegin;
      var ybegin;
      var xpurpose = 250; // Х координата цели, куда двигаться
      var ypurpose = 250; // У координата цели, куда двигаться
      var time = 10; // Время до уплытия
      var active = false; // Находится ли рыба в зоне видимости игрока
      var type = 1; // Тип рыбы, от него зависит отображение
  }

  makeStartCoordinates() { // создание начальных координат - использовать при начале игры и смерти
 
  if(Math.random() > 0.5){
      xbegin = Math.floor(Math.random() * 101 - 100);
  }
  else{
      xbegin = Math.floor(Math.random() * 101 + 500);
     }
  if(Math.random() > 0.5){
      ybegin = Math.floor(Math.random() * 101 - 100);
  }
  else{
      ybegin = Math.floor(Math.random() * 101 + 500);
  }
 
  }

  makePurposeCoordinates(){  // Создание новых координат цели - использовать при попадании в игровую зону или при достижении старой отметки
  xpurpose = Math.floor(Math.random() * 501);
  ypurpose = Math.floor(Math.random() * 501);
  }

  makeSpeed(){  // создание скорости рыбы - использовать при рождении
    var x = Math.random();
    if(x > 0.66){
      speed = 3;
    }
    else if(x < 0.33){
      speed = 1;
    }
    else{
      speed = 2;
    }
  }

  becomeActive(xcurrent, ycurrent){  // переход в игровую зону 
  if(xcurrent < 500 && xcurrent > 0 && ycurrent < 500 && ycurrent > 0){
      fish.active = true;
      this.makePurposeCoordinates;
  }
  }

  move(xcurrent, ycurrent, xpurpose, ypurpose){ //движение рыбы
    if(xpurpose > xcurrent){
      xcurrent +=speed;
    }
    else{
      xcurrent -=speed;
    }
    if(ypurpose > ycurrent){
      ycurrent +=speed;
    }
    else{
      ycurrent -=speed;
    }    
  }

  isOver(xcurrent, ycurrent, xpurpose, ypurpose){ //Достигла ли рыба цели
    if(xcurrent > xpurpose-5 && xcurrent < xpurpose+5 && ycurrent > ypurpose-5 && ycurrent < ypurpose+5){
     this.makePurposeCoordinates;
    }
  }


} 


