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


