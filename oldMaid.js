let isOldMaid = false;
let cardManager;
let cardImg;
const cardSize = 40;
const CARDSELECT = 'CARDSELECT';

let isRound = true;


//setup
function oldMaidInit(){
    oldMaidManager = new CardManager(() => {
        oldMaidEnd();
      });
    cardImg = [loadImage('img/spadeA.png')]
}

function oldMaidStart(){
    isOldMaid = true;
    cardManager.start();
}
//update
function oldMaidUpdate(){
  let manager = ballManager;
  let ball = manager.ball;

  //順番者の協調
  stroke(255, 255, 0, 255);
  strokeWeight(2);
  noFill();

  function trackingMode() {
    let handsPos = undefined;

    switch (cardManager.selectMode){
      
    }
  }
}

function oldMaidEnd(){
  ballManager.isHost = false;
  ballManager.isUserHost = false;
  ballManager.card = undefined;
  isCatchBall = false;
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
    switch (this.selectMode) {
      case catchUserTypes[0]:
      //配列の早いコピーらしい
      //https://qiita.com/takahiro_itazuri/items/882d019f1d8215d1cb67#comment-1b338078985aea9f600a
      this.member = [...others];
      this.setTarget(this.getNext());
      break;
    case cardUserTypes[1]:
      let fAndT = this.card.getFromTargetID();
      Send(OLDMAID, { mode: CARDSELECT, from: fAndT.from, target: undefined });
      break;
    }
  }
  createCard(video) {
    this.card = new Card(video.pos.copy(), video);
  }
  // getNext(){
  //   let next;
  //   if(isRound){
  //     if(this.member.length > 0){
  //     }
  //   }
  // }
}
//objでエラーが出る
class Card extends Obj{
  constructor(pos, from){
    super(pos, cardSize);
    this.target;
    this.from = from;
    this.pos = pos ; //位置
    this.amt = 0; //
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

    //
    push();
    image(cardImg, 0, 0, this.size, this.size);
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
  setSize(x, y){
    this.width = x;
    this.height = y;
  }
  getFromTargetID() {
    let from = this.from ? this.from.ID : undefined;
    let target = this.target ? this.target.ID : undefined;
    return { from: from, target: target };
  }
}
