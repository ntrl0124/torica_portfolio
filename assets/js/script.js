/* ----------------------------------------------------------------------------------------------------
*  root setting
* --------------------------------------------------------------------------------------------------*/
"load resize".split(' ').forEach((eventName)=>{
  window.addEventListener(eventName, ()=>{
    var width = document.body.clientWidth;
    document.documentElement.style.setProperty( '--window_width', width + 'px');
    var height = document.body.clientHeight;
    document.documentElement.style.setProperty( '--window_height', height + 'px');
  });
});


window.addEventListener("load", () => {

  let windowSPSwitch = true;

  if( window.innerWidth > 768 ) {
    windowSPSwitch = false;
  }

/* ----------------------------------------------------------------------------------------------------
*  load animation
* --------------------------------------------------------------------------------------------------*/
document.documentElement.classList.add('is-loaded');

/* ----------------------------------------------------------------------------------------------------
*  header navigation
* --------------------------------------------------------------------------------------------------*/
  const navBtn = document.querySelector(".js-navigation-button"),
        navBody = document.querySelector(".js-navigation-body"),
        navBack = document.querySelector(".js-navigation-bg");
  let navSwitch = false;

  const navToggle = () => {
    closeModalAction();
    if(navSwitch) {
      navBtn.classList.remove("is-active");
      navBody.classList.remove("is-active");
      navSwitch = false;
      stopCanvas();
    } else {
      navBtn.classList.add("is-active");
      navBody.classList.add("is-active");
      document.documentElement.classList.add("is-fixed");
      navSwitch = true;
      update();
    }
  }

  navBtn.addEventListener("click", navToggle);
  navBack.addEventListener("click", navToggle);


/* ----------------------------------------------------------------------------------------------------
*  slide navigation
* --------------------------------------------------------------------------------------------------*/
  const slideNavBtn = document.querySelectorAll(".js-slide-navigation");
  let dataNum = 0,
      dataElements,
      alreadyElements,
      alreadyNum = 0,
      prevElements,
      dataAllElements = document.querySelectorAll('[data-num]'),
      fvElements = document.querySelectorAll(`[data-num="0"]`);

  slideNavBtn.forEach((elem) => {
    elem.addEventListener('click', () => {

      closeModalAction();

      if(elem.classList.contains("link_nav")) {
        navToggle();
      }

      alreadyElements = document.querySelector(".is-active");
      alreadyNum =  parseInt(alreadyElements.dataset.num);

      dataNum = parseInt(elem.dataset.num);
      dataElements = document.querySelectorAll(`[data-num="${dataNum}"]`);
      prevElements = document.querySelectorAll(`[data-num="${dataNum-1}"]`);

      if( window.innerWidth > 768 && !elem.classList.contains("is-active")) {
        //PC slide change

        dataAllElements.forEach((allElements) => {

          allElements.classList.remove("is-active");
          allElements.classList.remove("is-view");

          let elemNum = parseInt(allElements.dataset.num);

          if( elemNum === alreadyNum && dataNum > alreadyNum ) {
            allElements.classList.add("is-view");
          }

          if( elemNum < dataNum ) {
            allElements.classList.add("is-already");
          } else if( dataNum < elemNum ) {
            allElements.classList.remove("is-already");
          }

        });

        dataElements.forEach((elem) => {
          if( dataNum < alreadyNum ) {
            elem.classList.add("is-view");
          }
          elem.classList.add("is-active");
          showBoxes();
        });

      } else { //SP anker link

        const targetElement = document.querySelector(`.section[data-num="${dataNum}"]`);
        const targetOffsetTop = window.pageYOffset + targetElement.getBoundingClientRect().top;
        window.scrollTo({
          top: targetOffsetTop,
          behavior: "smooth"
        });

      }

    });
  });

  window.addEventListener('resize', () => {

    if( window.innerWidth > 768 ) {
      windowSPSwitch = false;
    } else {
      windowSPSwitch = true;
    }

    //PC→SP resize
    if( windowSPSwitch ) {
      dataAllElements.forEach((elem) => {
        elem.classList.remove("is-active");
        elem.classList.remove("is-already");
        elem.classList.remove("is-view");
      });
      fvElements.forEach((elem) => {
        elem.classList.add("is-active");
      });
    }

  }, false);



/* ----------------------------------------------------------------------------------------------------
*  scroll animation
* --------------------------------------------------------------------------------------------------*/
  const boxes = document.querySelectorAll(".js-anime-view");
  window.addEventListener("scroll", showBoxes);
  showBoxes();

  function showBoxes() {
    const triggerBottom = (window.innerHeight / 5) * 4.5;
    const spWidth = window.innerWidth <= 768;

    boxes.forEach((box) => {
      const boxTop = box.getBoundingClientRect().top;

      if ( spWidth || box.closest('.is-active') != null ) {
        if( boxTop < triggerBottom ){
          box.classList.add("is-scrollin");
        }
      } else {
        box.classList.remove("is-scrollin");
      }
    });
  }


/* ----------------------------------------------------------------------------------------------------
*  nav body canvas
* --------------------------------------------------------------------------------------------------*/
let unit = 100,
    canvasList, // キャンバスの配列
    info = {}, // 全キャンバス共通の描画情報
    colorList, // 各キャンバスの色情報
    canvasMove;

/**
 * Init function.
 * 
 * Initialize variables and begin the animation.
 */
function init() {
    info.seconds = 0;
    info.t = 0;
    canvasList = [];
    colorList = [];
    // canvas1個めの色指定
    canvasList.push(document.getElementById("waveCanvas"));
    colorList.push(['#fff', '#fff', '#fff']);//重ねる波の色設定
    
    // 各キャンバスの初期化
    for(var canvasIndex in canvasList) {
        var canvas = canvasList[canvasIndex];
        canvas.width = document.documentElement.clientWidth; //Canvasのwidthをウィンドウの幅に合わせる
        canvas.height = 200;//波の高さ
        canvas.contextCache = canvas.getContext("2d");
    }
}

function update() {
    for(var canvasIndex in canvasList) {
        var canvas = canvasList[canvasIndex];
        // 各キャンバスの描画
        draw(canvas, colorList[canvasIndex]);
    }
    // 共通の描画情報の更新
    info.seconds = info.seconds + .014;
    info.t = info.seconds*Math.PI;
    // 自身の再起呼び出し
    canvasMove = setTimeout(update, 35);
}

function stopCanvas() {
  clearTimeout(canvasMove);
}

/**
 * Draw animation function.
 * 
 * This function draws one frame of the animation, waits 20ms, and then calls
 * itself again.
 */
function draw(canvas, color) {
    // 対象のcanvasのコンテキストを取得
    var context = canvas.contextCache;
    // キャンバスの描画をクリア
    context.clearRect(0, 0, canvas.width, canvas.height);

    //波の重なりを描画 drawWave(canvas, color[数字（波の数を0から数えて指定）], 透過, 波の幅のzoom,波の開始位置の遅れ )
    drawWave(canvas, color[0], 0.5, 3, 0);
    drawWave(canvas, color[1], 0.4, 2, 250);
    drawWave(canvas, color[2], 0.2, 1.6, 100);
}

/**
* 波を描画
* drawWave(色, 不透明度, 波の幅のzoom, 波の開始位置の遅れ)
*/
function drawWave(canvas, color, alpha, zoom, delay) {
    var context = canvas.contextCache;
    context.fillStyle = color;//塗りの色
    context.globalAlpha = alpha;
    context.beginPath(); //パスの開始
    drawSine(canvas, info.t / 0.5, zoom, delay);
    context.lineTo(canvas.width + 10, canvas.height); //パスをCanvasの右下へ
    context.lineTo(0, canvas.height); //パスをCanvasの左下へ
    context.closePath() //パスを閉じる
    context.fill(); //塗りつぶす
}

/**
 * Function to draw sine
 * 
 * The sine curve is drawn in 10px segments starting at the origin. 
 * drawSine(時間, 波の幅のzoom, 波の開始位置の遅れ)
 */
function drawSine(canvas, t, zoom, delay) {
    var xAxis = Math.floor(canvas.height/2);
    var yAxis = 0;
    var context = canvas.contextCache;
    // Set the initial x and y, starting at 0,0 and translating to the origin on
    // the canvas.
    var x = t; //時間を横の位置とする
    var y = Math.sin(x)/zoom;
    context.moveTo(yAxis, unit*y+xAxis); //スタート位置にパスを置く

    // Loop to draw segments (横幅の分、波を描画)
    for (let i = yAxis; i <= canvas.width + 10; i += 10) {
        x = t+(-yAxis+i)/unit/zoom;
        y = Math.sin(x - delay)/3;
        context.lineTo(i, unit*y+xAxis);
    }
}

init();


/* ----------------------------------------------------------------------------------------------------
*  skill years load
* --------------------------------------------------------------------------------------------------*/
const years = document.querySelectorAll(".js-skill-year");
      today = new Date();
const todayYear = today.getFullYear(),
      todayMonth = today.getMonth()+1;

years.forEach((box) => {
  const startYear = box.getAttribute("data-year"),
        startMonth = box.getAttribute("data-month");
  const outputYear = Math.max(todayYear - startYear,0);
  const outputMonth = Math.max(todayMonth - startMonth,1);
  let boxContent;

  if(outputYear) {
    boxContent = `<span class="year">${outputYear}</span>年<span class="month">${outputMonth}</span>ヶ月`
  } else {
    boxContent = `<span class="month">${outputMonth}</span>ヶ月`
  }

  box.innerHTML = boxContent;
});

/* ----------------------------------------------------------------------------------------------------
*  order records csv
* --------------------------------------------------------------------------------------------------*/
async function getWorks() {
  const options = {
    method: 'POST'
  }
  const url = 'php/Works.php';
  const res = await fetch(url, options).then((response) => {
    return response.json();
  });

  //recent 10 works
  const recentWorks = document.getElementById('recent_works');
  res.latest.forEach((element, index)  => {
    let recentList = document.createElement('li');
    recentList.innerHTML = element;
    recentWorks.appendChild(recentList);
  });

  //total unit
  document.getElementById("works_total").setAttribute("data-target",res.works_total);
  document.getElementById("page_total").setAttribute("data-target",res.page_total);

  document.getElementById("type_coding").setAttribute("data-target",res.type_coding);
  document.getElementById("type_wordpress").setAttribute("data-target",res.type_wordpress);

  document.getElementById("category_corporate").setAttribute("data-target",res.category_corporate);
  document.getElementById("category_lp").setAttribute("data-target",res.category_lp);
  document.getElementById("category_business").setAttribute("data-target",res.category_business);
  document.getElementById("category_recruit").setAttribute("data-target",res.category_recruit);
  document.getElementById("category_mock").setAttribute("data-target",res.category_mock);
  //document.getElementById("category_other").setAttribute("data-target",res.category_other);


  //「2017/10～***時点の統計」
  document.getElementById('recent_month').innerHTML = res.aggregate_period;

  setCounter();
}
getWorks();


/* ----------------------------------------------------------------------------------------------------
*  count animation
* --------------------------------------------------------------------------------------------------*/
const counters = document.querySelectorAll(".js-counter");
let counterSwicth = true;

function setCounter() {

  if (counterSwicth) {

    counters.forEach((countElem) => {
      const countText = String(countElem.dataset.target);
      let textBox = "";
      countText.split('').forEach((text,index) => {
        if(text !== " ") {
          textBox += `<span style="transition-delay:.${(index+1) * 3}s;">${text}</span>`;
        } else {
          textBox += text;
        }
      });
      countElem.innerHTML = textBox;
    });

    counterSwicth = false;
  }
}


/* ----------------------------------------------------------------------------------------------------
*  form submit
* --------------------------------------------------------------------------------------------------*/
  const form = document.querySelector('.form'),
        formAll = document.querySelectorAll('.form_item');
  form.addEventListener('submit', async (event) => {

    event.stopPropagation();
    event.preventDefault();

    if(window.confirm('送信してよろしいですか？')){ // 確認ダイアログを表示
      // 「OK」時は送信を実行

      const formData = new FormData(form);
      const options = {
        method: 'POST',
        body: formData,
      }
      const url = form.getAttribute('action');
      // const res = await fetch(url, options);
      const res = await fetch(url, options).then((response) => {
        return response.json();
      });

      if(res['result']) {
        // 通信が成功した時の処理
        for(let item of formAll) item.value = "";

        window.alert('送信が完了いたしました。');
      } else {
        // 通信が失敗した時の処理
        let messages = '';

        console.log(res['error']);
        res['error'].forEach((message) => {
          messages += `${message}\n`
        });

        window.alert('送信に失敗いたしました。\n\n' + messages);
      }

    }
    else{ // 「キャンセル」時の処理

      window.alert('キャンセルされました。'); // 警告ダイアログを表示
      return false; // 送信を中止
    }

  });


/* ----------------------------------------------------------------------------------------------------
*  works independent scroll
* --------------------------------------------------------------------------------------------------*/

// モーダルを取得
const modal = document.getElementById("js-carousel-modal");
// モーダルを表示するボタンを全て取得
const openModalBtns = document.querySelectorAll(".js-carousel-item");
// モーダルを閉じるボタンを全て取得
const closeModalBtns = document.querySelectorAll(".js-close-modal");

// Swiperの設定
const swiperModal = new Swiper(".swiper", {
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  spaceBetween: 30,
});

const closeModalAction = () => {
  modal.classList.remove("is-active");
  document.documentElement.classList.remove("is-fixed");
}

// モーダルを表示するボタンをクリックしたとき
openModalBtns.forEach((openModalBtn) => {
  openModalBtn.addEventListener("click", () => {
    // data-slide-indexに設定したスライド番号を取得
    const modalIndex = openModalBtn.dataset.slideIndex;
    swiperModal.slideTo(modalIndex);
    modal.classList.add("is-active");
    document.documentElement.classList.add("is-fixed");
  });
});

// モーダルを閉じるボタンをクリックしたとき
closeModalBtns.forEach((closeModalBtn) => {
  closeModalBtn.addEventListener("click", () => {
    closeModalAction();
  });
});

}, false);


let swiperSlide, swiperSwitchLoad, swiperSwitchResize;

window.addEventListener('load', () => {
  if (1000 >= window.innerWidth) {
    swiperSwitchLoad = 1;
  } else if ( 768 > window.innerWidth ) {
    swiperSwitchLoad = -1;
  } else {
    swiperSwitchLoad = 0;
  }
  createSwiper();
}, false);

window.addEventListener('resize', () => {
  if (1000 >= window.innerWidth) {
    swiperSwitchResize = 1;
  } else if ( 768 > window.innerWidth ) {
    swiperSwitchResize = -1;
  } else {
    swiperSwitchResize = 0;
  }

  if( swiperSwitchResize != swiperSwitchLoad ) {
    swiperSlide.destroy(true, true);
    createSwiper();
  }
  swiperSwitchLoad = swiperSwitchResize;
}, false);

function createSwiper() {
  swiperSlide = new Swiper(".js-carousel-cover", {
    spaceBetween: 15,
    slidesPerView: 2,
    grid: {
      rows: 2,
    },
    speed: 500,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1000: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
    }
  });
}

