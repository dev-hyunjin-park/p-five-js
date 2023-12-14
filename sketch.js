let img;
let detector;

function preload() {
  img = loadImage("images/dog_cat.jpeg");
  // Coco SD 모델 로드
  detector = ml5.objectDetector("cocossd");
}

function gotDetections(error, results) {
  if (error) {
    console.error(error);
  }
  for (let i = 0; i < results.length; i++) {
    let object = results[i];
    console.log(object);

    // 객체의 경계
    stroke(0, 255);
    strokeWeight(4);
    noFill();
    rect(object.x, object.y, object.width, object.height);

    // 탐색된 객체
    noStroke();
    fill(0, 255, 0);
    textSize(54);
    text(object.label, object.x + 10, object.y + 54);

    // 정확도
    noStroke();
    fill(0, 255, 0);
    textSize(54);

    // 소수점 둘째 자리까지 반올림
    let roundedAccuracy = Math.round(object.confidence * 10000) / 100;
    // 백분율로 변환
    let percentageAccuracy = roundedAccuracy + "%";

    text(`정확도: ${percentageAccuracy}`, object.x + 10, object.y + 120);
    console.log(percentageAccuracy);
  }
  console.log(results);
}

function setup() {
  createCanvas(img.width, img.height);
  // console.log(detector);
  image(img, 0, 0);
  detector.detect(img, gotDetections);
}
function draw() {
  // background(220);
}
