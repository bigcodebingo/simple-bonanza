let change_flag=false;
let bomb_flag=false;
let lolipop_flag=0;
let money=0;
let total = 0;
let multiplier=0;
let rules = false;
let back = document.querySelector('.back');
let originalHeight = '864px';
let alternativeHeight = '713px';
let isAlternativeHeight = false;
let currentValue = parseInt(document.getElementById("win").innerText.match(/\d+/), 10) || 0;

// показ правил --------------------------------------------------------------------------------
function show_rules() {
    let element = document.querySelector('.square');
    if (rules) {
        element.classList.remove('show');
        document.getElementById("startButton").disabled = false;
    } else {
        element.classList.add('show');
        document.getElementById("startButton").disabled = true;
    }
    rules = !rules;
}
document.addEventListener('keydown', function(event) {
    
        if (event.key == 'F11') {
            if (back.style.height == '713px') {
                console.log('small');
                back.style.height = '864px';
            }
            else if (back.style.height == '864px') {
                console.log('big');
                back.style.height = '713px';
            }
        }
    
});
//-----------------------------------------------------------------------------------------------
// анимация для нажатия кнопок ------------------------------------------------------------------
let designElements = document.querySelectorAll('.design');
designElements.forEach(function(element) {
    element.addEventListener('click', function() {
        this.classList.add('clicked');
        setTimeout(function() {
            element.classList.remove('clicked');
        }, 150);
    });
});
//-----------------------------------------------------------------------------------------------
// ограничения для количества символов-----------------------------------------------------------
let symbols_limit = {
    "lolipop.PNG": 6,
    "clear_bomb.png": 4,
    "apple.PNG": Infinity,
    "banan.PNG": Infinity,
    "blue.PNG": Infinity,
    "blueberry.PNG": Infinity,
    "green.PNG": Infinity,
    "heart.PNG": Infinity,
    "plum.PNG": Infinity,
    "purple.PNG": Infinity,
    "watermelon.PNG": Infinity
  };
//-----------------------------------------------------------------------------------------------
// функция символа чере число -------------------------------------------------------------------
function create_fruit(selected_symbols, symbols_stats) {
  let symbol;
  while (true) {
      let number = Math.floor(Math.random() * 100) + 1;
      if (number == 1 || number == 2) {
          symbol = "lolipop.PNG";
      } else if (number >= 3 && number <= 4) {
          symbol = "clear_bomb.png";
      } else if (number >= 5 && number <= 18) {
          symbol = "banan.PNG";
      } else if (number >= 19 && number <= 31) {
          symbol = "blueberry.PNG";
      } else if (number >= 32 && number <= 43) {
          symbol = "watermelon.PNG";
      } else if (number >= 44 && number <= 54) {
          symbol = "plum.PNG";
      } else if (number >= 55 && number <= 64) {
          symbol = "apple.PNG";
      } else if (number >= 65 && number <= 73) {
          symbol = "blue.PNG";
      } else if (number >= 74 && number <= 82) {
          symbol = "green.PNG";
      } else if (number >= 83 && number <= 91) {
          symbol = "purple.PNG";
      } else if (number >= 92 && number <= 100) {
          symbol = "heart.PNG";
      }
      if (symbols_stats[symbol] < symbols_limit[symbol] && selected_symbols.includes(symbol)) {
          break;
      }
  }
  symbols_stats[symbol] += 1;
  return symbol;
}
//-----------------------------------------------------------------------------------------------
// функция подбора бомбы икса если выпала чистая бомба-------------------------------------------
function create_bomb(bomb_choice) {
  if (bomb_choice == 1) {
      return "bomb_100x.png";
  } else if (bomb_choice ==2 || bomb_choice ==3) {
      return "bomb_50x.png";
  } else if (bomb_choice ==4 || bomb_choice ==5 || bomb_choice == 6) {
      return "bomb_25x.png";
  }else if (bomb_choice ==7 || bomb_choice == 8 || bomb_choice == 9 ){
    return "bomb_20x.png";
  }else if (bomb_choice >= 10 && bomb_choice <= 12){
    return "bomb_15x.png";
  } else if (bomb_choice >= 13 && bomb_choice <= 15) {
      return "bomb_2x.png";
  } else if (bomb_choice >= 16 && bomb_choice <= 30) {
      return "bomb_3x.png";
  } else if (bomb_choice >= 31 && bomb_choice <= 45) {
      return "bomb_4x.png";
  } else if (bomb_choice >= 46 && bomb_choice <= 60) {
      return "bomb_5x.png";
  } else if (bomb_choice >= 61 && bomb_choice <=70 ) {
      return "bomb_6x.png";
  } else if (bomb_choice >= 71 && bomb_choice <= 79) {
      return "bomb_8x.png";
  } else if (bomb_choice >= 80 && bomb_choice <= 90) {
      return "bomb_10x.png";
  } else if (bomb_choice >= 91 && bomb_choice <= 100) {
      return "bomb_12x.png";
  }
}
//-----------------------------------------------------------------------------------------------
// добавление анимации --------------------------------------------------------------------------
function add_animation(circles, delay, animationClass) {
    return new Promise(resolve => {
        let animationsCount = circles.length; 
        let completedAnimations = 0; 
        circles.forEach(function(circle) {
            setTimeout(function() {
                circle.classList.add(animationClass);
                completedAnimations++;
                if (completedAnimations === animationsCount) {
                    resolve();
                }
            }, delay);
            delay += 10; 
        });
    });
}
//--------------------------------------------------------------------------------------------------
// обновление счетчика выигрыша --------------------------------------------------------------------
function update_money(targetValue) {
    return new Promise((resolve, reject) => {
        let step = 1;
        let direction = targetValue > currentValue ? 1 : -1;
        let interval = setInterval(function() {
            currentValue += step * direction;
            if ((direction === 1 && currentValue >= targetValue) || (direction === -1 && currentValue <= targetValue)) {
                currentValue = targetValue;
                clearInterval(interval);
                resolve();
            }
            document.getElementById("win").innerHTML = "Выигрыш: " + total +'₽<br>+' + '<br>' + currentValue + "₽";
        }, 1);
    });
}
//--------------------------------------------------------------------------------------------------
// взрыв символов если их >=8 ----------------------------------------------------------------------
function show_boom() {
    let circles = document.querySelectorAll("[class^='circle']");
    let backgroundCounts = {};
    let promises = [];
    change_flag=false;
    circles.forEach(circle => {
        let backgroundImage = circle.style.backgroundImage;
        if (backgroundCounts.hasOwnProperty(backgroundImage)) {
            backgroundCounts[backgroundImage]++;
        } else {
            backgroundCounts[backgroundImage] = 1;
        }
    });
    for (let background in backgroundCounts) {
        if (backgroundCounts[background] >= 8 && background !== "none") {
            change_flag=true;
            let promise = new Promise((resolve, reject) => {
                if (backgroundCounts[background] >= 12) {
                    if(background==='url("fruits/apple.PNG")')money+=80
                    else if (background==='url("fruits/banan.PNG")')money+=16
                    else if (background==='url("fruits/blue.PNG")')money+=96
                    else if (background==='url("fruits/blueberry.PNG")')money+=32
                    else if (background==='url("fruits/green.PNG")') money+=120
                    else if (background==='url("fruits/heart.PNG")') money+=400
                    else if (background==='url("fruits/plum.PNG")')money+=64
                    else if (background==='url("fruits/purple.PNG")')money+=200
                    else if (background==='url("fruits/watermelon.PNG")')money+=40
                } else if (backgroundCounts[background] >= 10 && backgroundCounts[background] < 12) {
                    if(background==='url("fruits/apple.PNG")') money+=12
                    else if (background==='url("fruits/banan.PNG")')money+=6
                    else if (background==='url("fruits/blue.PNG")')money+=16
                    else if (background==='url("fruits/blueberry.PNG")')money+=7
                    else if (background==='url("fruits/green.PNG")') money+=40
                    else if (background==='url("fruits/heart.PNG")') money+=200
                    else if (background==='url("fruits/plum.PNG")')money+=10
                    else if (background==='url("fruits/purple.PNG")')money+=80
                    else if (background==='url("fruits/watermelon.PNG")')money+=8
                } else {
                    if(background==='url("fruits/apple.PNG")')money+=8
                    else if (background==='url("fruits/banan.PNG")')money+=2
                    else if (background==='url("fruits/blue.PNG")')money+=12
                    else if (background==='url("fruits/blueberry.PNG")')money+=3
                    else if (background==='url("fruits/green.PNG")') money+=16
                    else if (background==='url("fruits/heart.PNG")') money+=80
                    else if (background==='url("fruits/plum.PNG")')money+=6
                    else if (background==='url("fruits/purple.PNG")')money+=20
                    else if (background==='url("fruits/watermelon.PNG")')money+=4
                }
                circles.forEach(circle => {
                    if (circle.style.backgroundImage === background) { 
                        circle.style.backgroundImage = 'url(boom_effect.gif)'; 
                    }
                });
                resolve();
            });
            promises.push(promise);
        }
    }
    return Promise.all(promises)
}
//--------------------------------------------------------------------------------------------------
//обновление символов ------------------------------------------------------------------------------
function remove_animate(circles) {
    return new Promise((resolve, reject) => {
        circles.forEach(circle => {
            let backgroundImage = circle.style.backgroundImage;
            circle.style.transition='none';
            circle.style.opacity=1;
            if (backgroundImage =='url("boom_effect.gif")') {
                circle.classList.remove("animate");
            }
        });
        resolve();
    });
}
//--------------------------------------------------------------------------------------------------
//генерация новых символов после взрыва ------------------------------------------------------------
function generate_new(circles,selected_symbols,symbols_stats){
    return new Promise((resolve, reject) => {
        circles.forEach(circle => {
            let backgroundImage = circle.style.backgroundImage;
            if (backgroundImage ==='url("boom_effect.gif")') {
                let symbol = create_fruit(selected_symbols, symbols_stats);
                symbols_stats[symbol] += 1;
                if (symbol == "clear_bomb.png") {
                let bomb_choice = Math.floor(Math.random() * 100 + 1);
                symbol = create_bomb(bomb_choice);
                circle.style.backgroundImage = "url(bombs/" + symbol + ")";
            } else {
                circle.style.backgroundImage = "url(fruits/" + symbol + ")";
            }
                
            }
        });
        resolve();
    });
}
//--------------------------------------------------------------------------------------------------
//дроп новых символов с первой анимацией -----------------------------------------------------------
function throw_news(circles) {
    delay=0;
    counter=0;
    return new Promise(resolve => {
        circles.forEach(function(circle) {
            if (!circle.classList.contains("animate")){
                setTimeout(function() {
                    circle.classList.add("animate");
                }, delay);
                delay += 30;
            }
        });
        resolve();
    });
}
//--------------------------------------------------------------------------------------------------
// проверка на наличие бомб для множителя выигрыша -------------------------------------------------
function check_bombs(circles){
    multiplier=0;
    return new Promise(resolve => {
        circles.forEach(function(circle) {
            let backgroundImage = circle.style.backgroundImage;
            if (backgroundImage.includes("bomb")) {
                if (backgroundImage === 'url("bombs/bomb_2x.png")')multiplier=2;
                else if (backgroundImage === 'url("bombs/bomb_3x.png")')multiplier+=3;
                else if (backgroundImage === 'url("bombs/bomb_4x.png")')multiplier+=4;
                else if (backgroundImage === 'url("bombs/bomb_5x.png")')multiplier+=5;
                else if (backgroundImage === 'url("bombs/bomb_6x.png")')multiplier+=6;
                else if (backgroundImage === 'url("bombs/bomb_8x.png")')multiplier+=8;
                else if (backgroundImage === 'url("bombs/bomb_10x.png")')multiplier+=10;
                else if (backgroundImage === 'url("bombs/bomb_12x.png")')multiplier+=12;
                else if (backgroundImage === 'url("bombs/bomb_15x.png")')multiplier+=15;
                else if (backgroundImage === 'url("bombs/bomb_20x.png")')multiplier+=20;
                else if (backgroundImage === 'url("bombs/bomb_25x.png")')multiplier+=25;
                else if (backgroundImage === 'url("bombs/bomb_50x.png")')multiplier+=50;
                else if (backgroundImage === 'url("bombs/bomb_100x.png")')multiplier+=100;
                circle.style.backgroundImage = 'url("bomb_effect.gif")';
                circle.style.transition = "opacity 1.5s ease-in";
                circle.style.opacity = 0;                
            } 
        });
        if (multiplier>0)money*=multiplier;
        resolve();
    });
}
//--------------------------------------------------------------------------------------------------
// подсчет леденцов и бомб -------------------------------------------------------------------------
function get_flags(circles){
    bomb_flag=false;
    lolipop_flag=0;
    circles.forEach(function(circle) {
        let backgroundImage = circle.style.backgroundImage;
        if (backgroundImage == 'url("fruits/lolipop.PNG")') lolipop_flag+=1;
        if (backgroundImage.includes("bomb")) bomb_flag=true
    });
}
//--------------------------------------------------------------------------------------------------
// добавляем спины если выпало 3 и более скатеров --------------------------------------------------
function add_spins(circles) {
    return new Promise(resolve => {
        circles.forEach(function(circle) {
            let backgroundImage = circle.style.backgroundImage;
            if (backgroundImage === 'url("fruits/lolipop.PNG")'){
                circle.classList.add('animate3');
                circle.style.zIndex = "1";
                
            }
        })
        resolve();
    });
}
//---------------------------------------------------------------------------------------------------
// основная функция запуска -------------------------------------------------------------------------
async function start() {
    document.getElementById("startButton").disabled = true;
    document.getElementById("rules").disabled = true;
    spins=10;
    total_spins=spins;
    total=0;
    setTimeout(function() {
        document.getElementById("win").innerHTML = "Выигрыш: " + total +'₽<br>+' + '<br>' + money + "₽";
        document.querySelector('.design1').classList.add('show');
    }, );
    for (let i = 0; i < spins; i++) {
        money=0;
        currentValue=0;
        document.getElementById("win").innerHTML = "Выигрыш: " + total +'₽<br>+' + '<br>' + money + "₽";
        let delay = 0;
        let circles = document.querySelectorAll("[class^='circle']");
        circles.forEach(function(circle) {
            circle.style.opacity=1;
            circle.style.transition='none';
        });
        let selected_symbols = [];
        let symbolKeys = Object.keys(symbols_limit);
        while (selected_symbols.length < 9) {
            let randomIndex = Math.floor(Math.random() * symbolKeys.length);
            let randomSymbol = symbolKeys[randomIndex];
            if (!selected_symbols.includes(randomSymbol)) {
                selected_symbols.push(randomSymbol);
            }
        }
        document.getElementById("spins").innerText = "Бесплатных вращений осталось: " + (spins - i - 1);
        circles.forEach(function(circle) {
            circle.classList.remove("animate");
            circle.classList.remove("animate2");
            circle.classList.remove("animate3");
            circle.style.animationDelay = "0s"; 
            circle.style.zIndex = "0";
        });
        let words = ["apple.PNG", "banan.PNG", "blue.PNG", "blueberry.PNG", "green.PNG", "heart.PNG", "lolipop.PNG", "plum.PNG", "purple.PNG", "watermelon.PNG","clear_bomb.png"];
        let symbols_stats = {};
        words.forEach(word => {
            symbols_stats[word] = 0;
        });
        circles.forEach(function(circle) {
            let symbol = create_fruit(selected_symbols, symbols_stats);
            symbols_stats[symbol] += 1;
            if (symbol == "clear_bomb.png") {
              let bomb_choice = Math.floor(Math.random() * 100 + 1);
              symbol = create_bomb(bomb_choice);
              circle.style.backgroundImage = "url(bombs/" + symbol + ")";
          } else {
              circle.style.backgroundImage = "url(fruits/" + symbol + ")";
          }
        });

        await add_animation(circles, delay,"animate");
        
        await new Promise(resolve => setTimeout(resolve, 1000));
       
        await show_boom();
        await new Promise(resolve => setTimeout(resolve, 520));

        await remove_animate(circles)
        await new Promise(resolve => setTimeout(resolve, 1));

        await update_money(money)
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (change_flag){
            while(change_flag){
                
                await generate_new(circles,selected_symbols,symbols_stats);
                await new Promise(resolve => setTimeout(resolve, 10));
            
                await throw_news(circles);
                await new Promise(resolve => setTimeout(resolve, 1400));

                await show_boom();
                await new Promise(resolve => setTimeout(resolve, 520));
               
                await remove_animate(circles)
                await new Promise(resolve => setTimeout(resolve, 1));

                await update_money(money)
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            get_flags (circles);
            
            if (bomb_flag){
                await check_bombs(circles);
                await new Promise(resolve => setTimeout(resolve, 500));

                await update_money(money)
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            
            if (lolipop_flag>=3){
                spins+=5;
                total_spins+=5;
                await add_spins(circles);
                document.getElementById("spins").innerText = "Бесплатных вращений осталось: " + (spins - i - 1);
                document.querySelector(".extraspins").style.opacity=1;
                await new Promise(resolve => setTimeout(resolve, 1500));
                document.querySelector(".extraspins").style.opacity=0;
                if (lolipop_flag==4)money+=24;
                else if (lolipop_flag==5)money+=40;
                else if (lolipop_flag==6)money+=800;
            }

            total+=money;

            await add_animation(circles, delay,"animate2");
            await new Promise(resolve => setTimeout(resolve, 500));

        }
        else{
            get_flags (circles);

            if (lolipop_flag>=3){
                spins+=5;
                total_spins+=5;
                await add_spins(circles);
                document.getElementById("spins").innerText = "Бесплатных вращений осталось: " + (spins - i - 1);
                document.querySelector(".extraspins").style.opacity=1;
                await new Promise(resolve => setTimeout(resolve, 1500));
                document.querySelector(".extraspins").style.opacity=0;
                if (lolipop_flag==4) money+=24;
                else if (lolipop_flag==5)money+=40;
                else if (lolipop_flag==6)money+=800;
            }

            await add_animation(circles, delay,"animate2");
            await new Promise(resolve => setTimeout(resolve, 400));
        }
    }
    document.getElementById("win").innerHTML = "Выигрыш: " + total +'₽';
    document.getElementById("babki").innerHTML = total + '₽';
    document.getElementById("totalspins").innerText = "В " + total_spins +  " БЕСПЛАТНЫХ ВРАЩЕНИЯХ";
    setTimeout(function() {
        document.getElementById("spins").innerText = "";
        document.querySelector(".design1").classList.remove('show')
    }, 1500);
   
    setTimeout(function() {
        document.querySelector(".result").style.opacity=1;
        document.addEventListener('click', function(event) {
            document.querySelector(".result").style.opacity=0;
        });
    }, 2000);
    document.getElementById("startButton").disabled = false;
    document.getElementById("rules").disabled = false;
}