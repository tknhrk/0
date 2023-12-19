const BUTTONS_TOP = 450;
const BUTTONS_HEIGHT = 90;
 
const LANE_WIDTH = 90;
const LANE_LEFTS = [0, 90, 180, 270];
const BLOCK_HEIGHT = 90;
 
const HIT_Y_MIN = BUTTONS_TOP - BLOCK_HEIGHT;
const HIT_Y_MAX = BUTTONS_TOP + BUTTONS_HEIGHT;
 
const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 445;
 
const $start = document.getElementById('start');
const $zero = document.getElementById('zero');
const $one = document.getElementById('one');
const $two = document.getElementById('two');
const $three = document.getElementById('three');
 
const $canvas = document.getElementById('canvas');
const ctx = $canvas.getContext('2d');
 
let blocks = [];
 
const hitLaneNumbers = [];
const missLaneNumbers = [];
const throughLaneNumbers = [];
 
let isPlaying = false;
let speed = 8;
let hitCount = 0;
let missCount = 0;
let throughCount = 0;

const isKeysHit = [false, false, false, false];
document.onkeydown = (ev) => {
	if(ev.code == 'KeyV')
		onKeyHit(0)
	if(ev.code == 'KeyB')
		onKeyHit(1)
	if(ev.code == 'KeyN')
		onKeyHit(2)
	if(ev.code == 'KeyM')
		onKeyHit(3)
}

document.onkeyup = (ev) => {
	if(ev.code == 'KeyV')
		isKeysHit[0] = false;
	if(ev.code == 'KeyB')
		isKeysHit[1] = false;
	if(ev.code == 'KeyN')
		isKeysHit[2] = false;
	if(ev.code == 'KeyM')
		isKeysHit[3] = false;
}

function onKeyHit(index){
	if(!isPlaying || isKeysHit[index])
		return;

	isKeysHit[index] = true;
	const hits = blocks.filter(rect => !rect.IsHit && rect.X == LANE_LEFTS[index] && HIT_Y_MIN < rect.Y && rect.Y < HIT_Y_MAX);
	if(hits.length > 0){
		hits[0].IsHit = true;
		onHit(index);
	}
	else
		onMiss(index);

}

function clearCanvas(){
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, $canvas.width, $canvas.height);
}

function drawLanes(){
    ctx.strokeStyle = '#ccc';
    for(let i =0; i < LANE_LEFTS.length; i++)
        ctx.strokeRect(LANE_LEFTS[i], 0, LANE_WIDTH, $canvas.height);
}

function drawHit(laneNum){
    ctx.fillStyle = '#0ff';
    ctx.font = '20px bold ＭＳ ゴシック';
    const textWidth = ctx.measureText('Hit').width;
    ctx.fillText('HIT', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, HIT_Y_MAX + 10);
}

function drawThrough(laneNum){
    ctx.fillStyle = '#ff0';
    ctx.font = '20px bold ＭＳ ゴシック';
    const textWidth = ctx.measureText('Miss').width;
    ctx.fillText('Miss', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, HIT_Y_MAX + 30);
}

function drawMiss(laneNum){
    ctx.fillStyle = '#f0f';
    ctx.font = '20px bold ＭＳ ゴシック';
    const textWidth = ctx.measureText('Miss').width;
    ctx.fillText('Miss', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, HIT_Y_MAX + 50);
}

function onHit(laneNum){
    hitCount++;
    
    hitLaneNumbers.push(laneNum);
    setTimeout(() => {
        hitLaneNumbers.shift();
    }, 500);
}

function onMiss(laneNum){
    missCount++;
    
    missLaneNumbers.push(laneNum);
    setTimeout(() => {
        missLaneNumbers.shift();
    }, 500);
}

function onThrough(laneNum){
    throughCount++;
 
    throughLaneNumbers.push(laneNum);
    setTimeout(() => {
        throughLaneNumbers.shift();
    }, 500);
}

class Block{
    constructor(laneNum, delay){
        this.LaneNumber = laneNum;
        this.X = LANE_LEFTS[laneNum];
        this.Y = - 80 * delay;
        this.Width = LANE_WIDTH;
        this.Height = BLOCK_HEIGHT;
        this.IsHit = false;
        this.IsThrough = false;
    }
 
    Update(){
        if(!this.IsHit && !this.IsThrough && this.Y > HIT_Y_MAX){
            this.IsThrough = true;
            onThrough(this.LaneNumber);
        }
        this.Y += speed;
    }
 
    Draw(){
        ctx.fillStyle = '#dcdcdc';
        ctx.fillRect(this.X, this.Y + 20, this.Width, this.Height - 80);
    }
}

window.onload = () => {
    $canvas.width = CANVAS_WIDTH;
    $canvas.height = CANVAS_HEIGHT;
 
    clearCanvas();
    drawLanes();
 
    setPositionButtons();
    addEventListeners();
}

function setPositionButtons(){
    const buttons = [$zero, $one, $two, $three];
    for(let i = 0; i < buttons.length; i++){
        buttons[i].style.left = LANE_LEFTS[i] + 'px';
        buttons[i].style.top = BUTTONS_TOP + 'px';
        buttons[i].style.width = LANE_WIDTH + 'px';
        buttons[i].style.height = BUTTONS_HEIGHT + 'px';
    }
}

function addEventListeners(){
    $start.addEventListener('click', (ev) => {
        ev.preventDefault();
        gameStart();
    });
 
    const buttons = [$zero, $one, $two, $three];
    const events = ['mousedown', 'touchstart'];
 
    for(let i = 0; i < LANE_LEFTS.length; i++){
        for(let k = 0; k < events.length; k++){
            buttons[i].addEventListener(events[k], (ev) => {
                ev.preventDefault();
 
                if(!isPlaying)
                    return;
 
                const hits = blocks.filter(rect => !rect.IsHit && rect.X == LANE_LEFTS[i] && HIT_Y_MIN < rect.Y && rect.Y < HIT_Y_MAX);
                if(hits.length > 0){
                    hits[0].IsHit = true;
                    onHit(i);
                }
                else
                    onMiss(i);
            });
        }
    }
}

setInterval(() => {
    if(!isPlaying)
        return;
 
    clearCanvas();
    drawLanes();
 
    blocks.forEach(block => block.Update());
    blocks.forEach(block => block.Draw());
 
    hitLaneNumbers.forEach(num => drawHit(num));
    throughLaneNumbers.forEach(num => drawThrough(num));
    missLaneNumbers.forEach(num => drawMiss(num));
 
    ctx.font = '20px bold ＭＳ ゴシック';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#fff';
    ctx.fillText(`CRITICAL:${hitCount} NEAR:${missCount} ERROR:${throughCount}`, 10, 10);
}, 1000 / 60);

function gameStart(){
    blocks.length = 0;

    for(let i=0; i < 1; i += 1)
        blocks.push(new Block(0, i));
    for(let i=1; i < 1.5; i += 0.5)
        blocks.push(new Block(1, i));
    for(let i=1.5; i < 2; i += 0.5)
        blocks.push(new Block(2, i));
    for(let i=2; i < 3; i += 1)
        blocks.push(new Block(3, i));
    for(let i=3; i < 4; i += 1){
        blocks.push(new Block(0, i));
	blocks.push(new Block(1, i));
    }
    for(let i=4; i < 4.5; i += 0.5){
        blocks.push(new Block(0, i));
	blocks.push(new Block(1, i));
    }
    for(let i=4.5; i < 5; i += 0.5){
        blocks.push(new Block(1, i));
    	blocks.push(new Block(2, i));
    }
    for(let i=5; i < 2000; i += 1){
        blocks.push(new Block(2, i));
	blocks.push(new Block(3, i));
    }
    
    
    hitCount = 0;
    missCount = 0;
    throughCount = 0;
 
    speed = 8;
    isPlaying = true;
 
    setTimeout(() => {
        blocks = blocks.filter(rect => rect.Y > -10 && rect.Y < CANVAS_HEIGHT);
    }, 1000 * 30);
 
    setTimeout(async() => {
        isPlaying = false;
	
        const resultText = `CRITICAL:${hitCount}\nNEAR:${missCount}\nERROR:${throughCount}`;
        showResult(resultText);
    }, 1000 * 33);
}

function showResult(resultText){
    const arr = resultText.split('\n');
    if(arr.length < 3)
        return;
 
    ctx.fillStyle = '#ff0';
    ctx.font = '20px bold ＭＳ ゴシック';
 
    const textWidth1 = ctx.measureText('結果').width;
    const x1 =  (CANVAS_WIDTH - textWidth1) / 2;
    ctx.fillStyle = '#fff';
    ctx.fillText('結果', x1, 160);
 
    const textWidth = ctx.measureText(arr[1]).width;
    const x =  (CANVAS_WIDTH - textWidth) / 2;
    ctx.fillStyle = '#ff0';
    ctx.fillText(arr[0], x, 200);
    ctx.fillStyle = '#fff';
    ctx.fillText(arr[1], x, 230);
    ctx.fillStyle = '#fff';
    ctx.fillText(arr[2], x, 260);
 
    $start.style.display = 'block';
}
