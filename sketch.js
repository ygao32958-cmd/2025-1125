// 走路（現有）
let walkSheet;
const WALK_FRAMES = 8; // 保留原來的 frames 設定（若你的走路精靈是 9 幀，可改成 9）
let walkFrameW = 0;
let walkFrameH = 0;

// 跑步（空白鍵觸發）
let runSheet;
const RUN_FRAMES = 22; // 跑步精靈共有 22 幀
let runFrameW = 0;
let runFrameH = 0;

let xPos = 0;
let yPos = 0;
let baseY = 0; // 跑步前的原始 Y
let dir = 1; // 1 = face right, -1 = face left
const SPEED = 4;

// 狀態控制
let isRunning = false;
let runFrameIndex = 0;
const RUN_BOB_AMPLITUDE = 30; // 垂直移動幅度（像素）

function preload() {
  // 載入精靈表（相對於專案根目錄）
  walkSheet = loadImage('圖片/走路/走路.png');
  runSheet = loadImage('圖片/跑步/跑步.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(12); // 動畫播放速度
  imageMode(CENTER);
  // 根據載入的精靈表計算每一幀的寬高（圖片總寬 ÷ 幀數）
  if (walkSheet) {
    walkFrameW = walkSheet.width / WALK_FRAMES;
    walkFrameH = walkSheet.height;
  }
  if (runSheet) {
    runFrameW = runSheet.width / RUN_FRAMES;
    runFrameH = runSheet.height;
  }
  // 初始化角色位置在畫布中央
  xPos = width / 2;
  yPos = height / 2;
  baseY = yPos;
}

function draw() {
  background('#F0CEA0');

  // 處理左右按鍵移動（持續按住時移動）
  if (keyIsDown(LEFT_ARROW)) {
    xPos -= SPEED;
    dir = -1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    xPos += SPEED;
    dir = 1;
  }

  // 限制角色位置不超出畫布
  const halfW = (isRunning ? runFrameW : walkFrameW) / 2 || 0;
  xPos = constrain(xPos, halfW, width - halfW);

  // 決定要畫哪個動畫：跑步（一次性播放）或走路（循環）
  if (isRunning && runSheet && runFrameW > 0 && runFrameH > 0) {
    // 使用 runFrameIndex 播放跑步影格
    const currentFrame = runFrameIndex;
    const sx = currentFrame * runFrameW;
    const sy = 0;

    // 垂直位移（上下移動），以正弦波讓動作流暢
    const progress = runFrameIndex / RUN_FRAMES; // 0..(1-1/RUN_FRAMES)
    yPos = baseY + sin(progress * TWO_PI) * RUN_BOB_AMPLITUDE;

    push();
    translate(xPos, yPos);
    scale(dir, 1);
    image(runSheet, 0, 0, runFrameW, runFrameH, sx, sy, runFrameW, runFrameH);
    pop();

    // 前進一幀
    runFrameIndex++;
    if (runFrameIndex >= RUN_FRAMES) {
      // 跑步結束，回到原本位置並恢復走路狀態
      isRunning = false;
      runFrameIndex = 0;
      yPos = baseY;
    }
  } else if (walkSheet && walkFrameW > 0 && walkFrameH > 0) {
    // 走路動畫（持續循環）
    const currentFrame = floor(frameCount % WALK_FRAMES);
    const sx = currentFrame * walkFrameW;
    const sy = 0;

    push();
    translate(xPos, yPos);
    scale(dir, 1);
    image(walkSheet, 0, 0, walkFrameW, walkFrameH, sx, sy, walkFrameW, walkFrameH);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  // space (keyCode 32) 觸發跑步動畫（一次性播放）
  if ((key === ' ' || keyCode === 32) && !isRunning && runSheet) {
    isRunning = true;
    runFrameIndex = 0;
    // 紀錄起始 Y，跑完會回復
    baseY = yPos;
  }
}

