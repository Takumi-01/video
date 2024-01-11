let isOldMaid = false;
let cardManager;
let cardImg = [];
const cardSize = 40;
const CARDSELECT = 'CARDSELECT';

let isRound = true;


let randoms = [];
let Cardmin = 0;
let Cardmax = cardImg.length;


//ババ抜きsetup
function oldMaidInit(){
  cardManager = new CardManager(() => {
    oldMaidEnd();
  });
    cardImg = [loadImage('img/spade1.png'),loadImage('img/spade2.png'),
               loadImage('img/spade3.png'),loadImage('img/spade4.png'),
               loadImage('img/spade5.png'),loadImage('img/spade6.png'),
               loadImage('img/spade7.png'),loadImage('img/spade8.png'),
               loadImage('img/spade9.png'),loadImage('img/spade10.png'),
               loadImage('img/spade11.png'),loadImage('img/spade12.png'),
               loadImage('img/spade13.png'),
               loadImage('img/clover1.png'),loadImage('img/clover2.png'),
               loadImage('img/clover3.png'),loadImage('img/clover4.png'),
               loadImage('img/clover5.png'),loadImage('img/clover6.png'),
               loadImage('img/clover7.png'),loadImage('img/clover8.png'),
               loadImage('img/clover9.png'),loadImage('img/clover10.png'),
               loadImage('img/clover11.png'),loadImage('img/clover12.png'),
               loadImage('img/clover13.png'),
               loadImage('img/dia1.png'),loadImage('img/dia2.png'),
               loadImage('img/dia3.png'),loadImage('img/dia4.png'),
               loadImage('img/dia5.png'),loadImage('img/dia6.png'),
               loadImage('img/dia7.png'),loadImage('img/dia8.png'),
               loadImage('img/dia9.png'),loadImage('img/dia10.png'),
               loadImage('img/dia11.png'),loadImage('img/dia12.png'),
               loadImage('img/dia13.png'),
               loadImage('img/heart1.png'),loadImage('img/heart2.png'),
               loadImage('img/heart3.png'),loadImage('img/heart4.png'),
               loadImage('img/heart5.png'),loadImage('img/heart6.png'),
               loadImage('img/heart7.png'),loadImage('img/heart8.png'),
               loadImage('img/heart9.png'),loadImage('img/heart10.png'),
               loadImage('img/heart11.png'),loadImage('img/heart12.png'),
               loadImage('img/heart13.png')]
}
//ババ抜きstart
function oldMaidStart(){
  isOldMaid = true;
  cardManager.start();
}
//ババ抜きupdate
function oldMaidUpdate(){
  let manager = cardManager;
  let card = manager.card;
  let from = card.from;

  //順番者の協調
  stroke(255, 255, 0, 255);
  strokeWeight(2);
  noFill();

  trackingMode();

  function trackingMode() {
    let minMaxes = from.minMaxes;
    let handsPos = undefined;

    for (let i = 0; i < 2; i++) {
      if (minMaxes[i]) {
        handsPos = new Vec((minMaxes[i].maxX + minMaxes[i].minX) / 2, (minMaxes[i].maxY + minMaxes[i].minY) / 2);
        break;
      }
    }
    if (!handsPos || handsPos.y < 0.3) return;
    // switch (cardManager.selectMode){

    // }
    //if (!ball.target) return;
    //投げた判定の高さ
    // push(); {
    //   stroke(0, 255, 0);
    //   strokeWeight(max(1, from.size.x * 0.01));
    //   drawingContext.setLineDash([from.size.x * 0.02, from.size.x * 0.05]);
    //   let y = from.leftUpPos.y + from.size.y * throwThreshold;
    //   line(from.leftUpPos.x, y, from.leftUpPos.x + from.size.x, y);
    // } pop();
    card.update();
    if (handsPos) {
      let leftUp = from.leftUpPos;
      let x = leftUp.x + handsPos.x * from.size.x;
      let y = leftUp.y + handsPos.y * from.size.y;
      card.setPos(x, y);
      card.setFromPos(x, y);
    //   if (card.from.ID === localVideo.ID && getThrowJudge(from, handsPos)) {//投げた判定
    //     ballThrowed();
    //   }
     }
  }
}

function oldMaidEnd(){
  ballManager.isHost = false;
  ballManager.isUserHost = false;
  ballManager.card = undefined;
  isOldMaid = false;
}

class CardManager {
  constructor(endFunc) {
    this.member = [];//参加者
    this.card;
    this.endFunc = endFunc;//終了時の処理
    this.isHost = false;
    this.isUserHost = false;
    this.selectMode = cardUserTypes[0];
    this.catchingTime = 0;
  }
  start() {
    this.isUserHost = true;
    this.isHost = true;
    this.createCard(localVideo);
    // switch (this.selectMode) {
    //   case catchUserTypes[0]:
    //   //配列の早いコピーらしい
    //   //https://qiita.com/takahiro_itazuri/items/882d019f1d8215d1cb67#comment-1b338078985aea9f600a
    //   this.member = [...others];
    //   this.setTarget(this.getNext());
    //   break;
    // case cardUserTypes[1]:
    let fAndT = this.card.getFromTargetID();
    Send(OLDMAID, { mode: CARDSELECT, from: fAndT.from, target: undefined });
    //   break;
    // }
  }
  createCard(video) {
    this.card = new Card(video.pos.copy(), video);
  }

  // setOldMaidSelectMode(mode) {
  //   let isCanChange = getCanChange();
  //   if (isCanChange) {
  //     this.selectMode = mode;
  //     $('#cardUserSelect').val(mode);
  //     let index = ballTypes.indexOf(this.selectMode);
  //     if (this.card) this.setBallImgIndex(index);
  //   } else {
  //     $('#cardUserSelect').val(this.selectMode);
  //   }
  //   return isCanChange;
  // }

  // getNext(){
  //   let next;
  //   if(isRound){
  //     if(this.member.length > 0){
  //     }
  //   }
  // }
  setFrom(from) {
    this.card.setFrom(from);
  }
  finish() {
    this.member = [];
    this.endFunc();
    Send(OLDMAID, { mode: END });
  }
}

class Card extends Obj{
  constructor(pos, from){
    super(pos, cardSize);
    this.target;//相手
    this.from = from;
    this.fromPos = createVector();
    this.amt = 0; 
    this.width ; //横幅
    this.height ; //縦幅


  }
  update(){
    //カードを取られる相手を強調表示
    if (this.target){
      stroke(0, 255, 0, 255);
      strokeWeight(5);
      noFill();
      rect(this.target.pos.x, this.target.pos.y, this.target.size.x, this.target.size.y);
    }

    //カード表示
    let i;
    for(i = 0; i < 5; i++){
      let rnd = intRandom(Cardmin, Cardmax);
      if(!randoms.includes(rnd)){
        randoms.push(rnd);
      }
    }
    
    push();
    translate(this.pos.x, this.pos.y);
    image(cardImg[randoms[0]], 0, 0, this.size, 2 * this.size);
    pop();
    push();
    translate(this.pos.x, this.pos.y);
    image(cardImg[randoms[1]], 10, 0, this.size, 2 * this.size);
    pop();
    push();
    translate(this.pos.x, this.pos.y);
    image(cardImg[randoms[2]], 20, 0, this.size, 2 * this.size);
    pop();
    push();
    translate(this.pos.x, this.pos.y);
    image(cardImg[randoms[3]], 30, 0, this.size, 2 * this.size);
    pop();
    push();
    translate(this.pos.x, this.pos.y);
    image(cardImg[randoms[4]], 40, 0, this.size, 2 * this.size);
    pop();
  }
  setTarget(target) {
    this.amt = 0;
    if (this.target) this.from = this.target;
    this.changeTarget(target);
  }
  setFrom(from) {
    this.from = from;
  }
  changeTarget(target) {
    this.target = target;
  }
  setPos(x, y) {
    this.prevPos = this.pos.copy();
    this.pos.x = x;
    this.pos.y = y;
  }
  setFromPos(x, y) {
    this.fromPos.x = x;
    this.fromPos.y = y;
  }
  // setSize(x, y){
  //   this.width = x;
  //   this.height = y;
  // }
  getFromTargetID() {
    let from = this.from ? this.from.ID : undefined;
    let target = this.target ? this.target.ID : undefined;
    return { from: from, target: target };
  }
  
}
function intRandom(min, max){
  return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}
