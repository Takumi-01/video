let isOldMaid = false;
let cardManager;
let cardImg = [];
const cardSize = 40;
const CARDSELECT = 'CARDSELECT';
const CARD_NEXT = 'NEXTUSER';
const CARD_TRACKING = 'CARD_TRACKING';
const ROUND = 'ROUND';

let isRound = true;

let randoms = new Array();
let Cardmin = 0;
let Cardmax = 9;

let player = new Array();
let opponent = new Array();

let shuffleNum;

//ババ抜きsetup
function intRandom(min, max){
  return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}

//配列の要素をシャッフルするやつ
function arrayShuffle(array) {
  for(let i = (array.length - 1); 0 < i; i--){

    // 0〜(i+1)の範囲で値を取得
    let r = Math.floor(Math.random() * (i + 1));

    // 要素の並び替えを実行
    let tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
  return array;
}

function intShuffle(num){
  if(num == 0){
    for(i = 0; i <= Cardmax; i += 2){
      player.push(randoms[i]);
      opponent.push(randoms[i+1]);
    }
  }else if(num > 0){
    // for(i = 0; i <= 2 / Cardmax; i++){
    //   player[i] = randoms[i];
    //   opponent[i + 2 / Cardmax] = randoms[i + 2 / Cardmax];
    // }
    arrayShuffle(player);
    arrayShuffle(opponent);
  }
  shuffleNum += 1;
}

function oldMaidInit(){
  randoms = [];
  shuffleNum = 0;
  let i;
  for(i = Cardmin; i <= Cardmax; i++){
    while(true){
      let rnd = intRandom(Cardmin, Cardmax);
      if(!randoms.includes(rnd)){
        randoms.push(rnd);
        break;
      }
    }
  }
  cardManager = new CardManager(() => {
    oldMaidEnd();
  });
  cardImg = [loadImage('img/spade1.png'),loadImage('img/spade2.png'),
             loadImage('img/spade3.png'),loadImage('img/spade4.png'),
             loadImage('img/spade5.png'),
             loadImage('img/clover1.png'),loadImage('img/clover2.png'),
             loadImage('img/clover3.png'),loadImage('img/clover4.png'),
             loadImage('img/clover5.png')]
}

//ババ抜きstart
function oldMaidStart(){
  isOldMaid = true;
  
  intShuffle(shuffleNum);
  // for(i = 0; i <= Cardmax; i += 2){
  //     player.push(randoms[i]);
  //     opponent.push(randoms[i+1]);
  // }
  cardManager.start();
}

//ババ抜きupdate
function oldMaidUpdate(){
  let manager = cardManager;
  let card = manager.card;
  let from = card.from;
  let target = card.target;

  //順番者の協調
  stroke(255, 255, 0, 255);
  strokeWeight(2);
  noFill();
  rect(from.pos.x, from.pos.y, from.size.x, from.size.y);

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
    let lineP = getPointingLine(from);
    if (lineP) {//指さしあり
      let hitInfo = getCollVideo(from, lineP);
      push();
      stroke(0, 255, 0);
      strokeWeight(max(3, width * 0.003));
      if (hitInfo) {
        noFill();
        line(lineP.start.x, lineP.start.y, hitInfo.hitPos.x, hitInfo.hitPos.y);
        let hitVideo = hitInfo.video;
        rect(hitVideo.pos.x, hitVideo.pos.y, hitVideo.size.x, hitVideo.size.y);
        if (cardManager.isUserHost && hitVideo !== card.target) {
          cardManager.changeTarget(hitVideo);
          Send(OLDMAID, { mode: CARD_NEXT, from: undefined, target: hitVideo.ID });
        }
      } else {
        drawingContext.setLineDash([width * 0.01, width * 0.02]);
        line(lineP.start.x, lineP.start.y, lineP.end.x, lineP.end.y);
      }
      pop();
    }
    card.update();

    let px = from.pos.x;
    let py = from.pos.y;

    // let ox = target.pos.x;
    // let oy = target.pos.y;

    card.setPos(px,py);
    card.setFromPos(ox,oy);

    

    // if (handsPos) {
      // let pLeftUp = from.leftUpPos;
      // let oLeftUp = target.leftUpPos;
      
      // let px = localVideo.pos.x;
      // let py = localVideo.pos.y;

      // let ox = others[0].pos.x;
      // let oy = others[0].pos.y;
      
      // let x = leftUp.x + handsPos.x * from.size.x;
      // let y = leftUp.y + handsPos.y * from.size.y;
      // card.setPos(px, py);
      // card.setFromPos(ox, oy);
      // if (card.from.ID === localVideo.ID && getThrowJudge(from, handsPos)) {//投げた判定
      //   ballThrowed();
      // }
    // }
  }
}

function oldMaidEnd(){
  cardManager.isHost = false;
  cardManager.isUserHost = false;
  cardManager.card = undefined;
  cardManager.cardMode = CARD_TRACKING;
  isOldMaid = false;
}

/**
 * 判定
 * @param {video} video 
 * @param {vec} handsPos 
 */

/**
 * カードの動き方
 * @param {PVector} fromPos 
 * @param {PVector} targetPos 
 * @param {value} amt 
 * @param {Video} from 
 * @param {Video} target 
 * @returns {PVector}
 */

/**
 * ビデオの指からレーザーを出せる座標を取得
 * @param {Video} video 
 * @returns {Line}
 */

/**
 * 他の参加者と線の当たり判定
 * @param {Line} pointingLine 
 * @returns {{video,Vec}}
 */


function getCollVideo(from, pointingLine) {
  let hitPos;
  if (hitPos = collLineVideo(localVideo, from, pointingLine)) {
    return { video: localVideo, hitPos: hitPos };
  }
  for (let i = 0; i < others.length; i++) {
    if (hitPos = collLineVideo(others[i], from, pointingLine)) {
      return { video: others[i], hitPos: hitPos };
    }
  }
  function collLineVideo(video, from, lineP) {
    let leftUp = video.leftUpPos;
    
    if (!leftUp || video.ID === from.ID) return undefined;
    let rightBottom = new Vec(leftUp.x + video.size.x, leftUp.y + video.size.y);
    let rightUp = new Vec(rightBottom.x, leftUp.y);
    let leftBottom = new Vec(leftUp.x, rightBottom.y);
    let sideArray = [new LineSeg(leftUp, rightUp), new LineSeg(rightUp, rightBottom), new LineSeg(rightBottom, leftBottom), new LineSeg(leftBottom, rightUp)]//4辺
    let sideArrayLen = sideArray.length;
    let hitPosition = undefined;
    let distance = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < sideArrayLen; i++) { //基本的に2本の辺に被るから4辺forを回す
      if (collLineLine(sideArray[i].start, sideArray[i].end, lineP.start, lineP.end)) {
        let linear = getLinear(new Vec(lineP.end.x - lineP.start.x, lineP.end.y - lineP.start.y), lineP.start);
        let vec;
        if (i % 2 === 0) {//上辺か下辺
          let y = sideArray[i].start.y;
          let x = (y - linear.b) / linear.a;
          vec = new Vec(x, y);
        } else {//右辺か左辺
          let x = sideArray[i].start.x;
          let y = linear.a * x + linear.b;
          vec = new Vec(x, y);
        }
        let dist = pow(vec.x - lineP.start.x, 2) + pow(vec.y - lineP.start.y, 2);
        if (dist < distance) {//より短い距離の交点を求める
          distance = dist;
          hitPosition = vec;
        }
      }
    }
    return hitPosition;
    //当たり判定の計算
    //https://qiita.com/ykob/items/ab7f30c43a0ed52d16f2
    /**
     * 線分の当たり判定
     * @param {vec} a
     * @param {vec} b 
     * @param {vec} c 
     * @param {vec} d 
     */
    function collLineLine(a, b, c, d) {
      let ta = (c.x - d.x) * (a.y - c.y) + (c.y - d.y) * (c.x - a.x);
      let tb = (c.x - d.x) * (b.y - c.y) + (c.y - d.y) * (c.x - b.x);
      let tc = (a.x - b.x) * (c.y - a.y) + (a.y - b.y) * (a.x - c.x);
      let td = (a.x - b.x) * (d.y - a.y) + (a.y - b.y) * (a.x - d.x);
      return ta * tb <= 0 && tc * td <= 0;
    }
  }
}

/**
 * ババ抜きに関する受信データの振り分け関数
 *  @param {*} oldmaidMode モードの送信,受信相手
 */
function receiveOldStatus(oldMaidMode){
  switch(oldMaidMode.mode){
    case END:
      oldMaidEnd();
      return;
    case CARD_NEXT:
       nextUser();
  }
  function nextUser(){
    let target = getVideoInst(oldMaidMode.target);
      if (isOldMaid) {//2回目以降
        cardManager.setTarget(target);
      } else {//初回
        isOldMaid = true;
        cardManager.isUserHost = false;
        let from = getVideoInst(oldMaidMode.from);
        //cardManager.createCard(from);
        cardManager.setTarget(target);
      }
  }
}

function getCanChange() {
  return !isOldMaid || (!isRound && cardManager.cardMode === CARD_TRACKING);
}

class CardManager {
  constructor(endFunc) {
    this.member = [];//参加者
    this.card;
    this.endFunc = endFunc;//終了時の処理
    this.isHost = false;
    this.isUserHost = false;
    this.selectMode = cardUserTypes[0];
    this.cardMode = CARD_TRACKING;
    this.cardType = cardTypes[0];
    this.catchingTime = 0;
  }
  start() {
    this.isUserHost = true;
    this.isHost = true;
    this.cardMode = CARD_TRACKING;
    this.createCard(localVideo);
    switch (this.selectMode) {
      case cardUserTypes[0]:
      //配列の早いコピーらしい
      //https://qiita.com/takahiro_itazuri/items/882d019f1d8215d1cb67#comment-1b338078985aea9f600a
      this.member = [...others];
      //this.setTarget(this.getNext());
      break;
    case cardUserTypes[1]:
      let fAndT = this.card.getFromTargetID();
      Send(OLDMAID, { mode: CARDSELECT, from: fAndT.from, target: undefined });
        break;
    }
  }
  createCard(video) {
    let cardTypeIndex = this.getCardImgIndex();
    this.card = new Card(video.pos.copy(), video, cardTypeIndex);
  }

  setOldMaidSelectMode(mode) {
    let isCanChange = getCanChange();
    if (isCanChange) {
      this.selectMode = mode;
      $('#cardUserSelect').val(mode);
      let index = cardTypes.indexOf(this.selectMode);
      if (this.card) this.setCardImgIndex(index);
    } else {
      $('#cardUserSelect').val(this.selectMode);
    }
    return isCanChange;
  }

  // getNext(){
  //   let next;
  //   if(isRound){
  //     if(this.member.length > 0){
  //     }
  //   }
  // }
  setTarget(next) {
    this.card.setTarget(next);
    this.card.rotation = 0;
    if (this.isUserHost) {
      let fAndT = this.card.getFromTargetID();
      Send(OLDMAID, { from: fAndT.from, target: fAndT.target, mode: CARD_NEXT });
    }
  }
  changeTarget(target) {
    this.card.changeTarget(target);
  }
  setFrom(from) {
    this.card.setFrom(from);
  }
  setCardImgIndex(index) {
    this.card.cardTypeIndex = index;
  }
  finish() {
    this.member = [];
    this.endFunc();
    Send(OLDMAID, { mode: END });
  }
  getCardImgIndex(){
    return cardTypes.indexOf(this.cardType);
  }
}

// function cardErace(){
//   if(randoms[0].toString().indexOf('1')>0 && randoms[1].toString().indexOf('1')>0){

//   }
// }

class Card extends Obj{
  constructor(pos, from, cardTypeIndex){
    super(pos, cardSize);
    this.target;//相手
    this.from = from;
    this.cardTypeIndex = cardTypeIndex;
    this.rotation = 0;//角度
    this.fromPos = createVector();
    this.amt = 0; 
    this.CleftUpPos;

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
    
    
    // push();
    // translate(this.pos.x, this.pos.y);
    // image(cardImg[randoms[0]], -80, 0, this.size, 2 * this.size);
    // pop();
    // push();
    // translate(this.pos.x, this.pos.y);
    // image(cardImg[randoms[1]], -40, 0, this.size, 2 * this.size);
    // pop();
    // push();
    // translate(this.pos.x, this.pos.y);
    // image(cardImg[randoms[2]], 0, 0, this.size, 2 * this.size);
    // pop();
    // push();
    // translate(this.pos.x, this.pos.y);
    // image(cardImg[randoms[3]], 40, 0, this.size, 2 * this.size);
    // pop();
    // push();
    // translate(this.pos.x, this.pos.y);
    // image(cardImg[randoms[4]], 80, 0, this.size, 2 * this.size);
    // pop();

    // push();
    // translate(this.pos.x-40, this.pos.y);
    // rotate(this.rotation-20);
    // image(cardImg[player[0]], 0, 0, this.size, 2 * this.size);
    // pop();

    // push();
    // translate(this.pos.x-20, this.pos.y);
    // rotate(this.rotation-15);
    // image(cardImg[player[1]], 0, 0, this.size, 2 * this.size);
    // pop();

    // push();
    // translate(this.pos.x, this.pos.y);
    // rotate(this.rotation);
    // image(cardImg[player[2]], 0, 0, this.size, 2 * this.size);
    // pop();

    // push();
    // translate(this.pos.x+20, this.pos.y);
    // rotate(this.rotation+15);
    // image(cardImg[player[3]], 0, 0, this.size, 2 * this.size);
    // pop();

    // push();
    // translate(this.pos.x+40, this.pos.y);
    // rotate(this.rotation+20);
    // image(cardImg[player[4]], 0, 0, this.size, 2 * this.size);
    // pop();

    let num;
    for(num = 0; num < player.length; num++){
      push();
      translate(this.pos.x+((num - 2 / player.length) * 20), this.pos.y);
      rotate(this.rotation);
      image(cardImg[player[num]], 0, 0, this.size, 2 * this.size);
      pop();
    }
    for(num = 0; num < opponent.length; num++){
      push();
      translate(others[0].pos.x+((num - 2 / opponent.length) * 20), this.pos.y);
      rotate(others[0].rotation);
      image(cardImg[opponent[num]], 0, 0, this.size, 2 * this.size);
      pop();
    }
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
  setPosVec(vec) {
    this.setPos(vec.x, vec.y);
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
  updateCardLeftUpPos() {
    this.CleftUpPos = createVector(this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2);
  }
  
}

