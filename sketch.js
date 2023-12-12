let mobilenet;

let video;
let label = "";

function gotResults(error, results) {
  if (error) {
    console.error(error);
  } else {
    label = results[0].label;

    mobilenet.predict(gotResults);
  }
}

function modelReady() {
  console.log("Model is ready!");
  mobilenet.predict(gotResults); // loop
}

// function imageReady() {
//   image(puffin, 0, 0, width, height);
// }

function setup() {
  createCanvas(640, 550);
  video = createCapture(VIDEO);
  video.hide();
  background(0);

  mobilenet = ml5.imageClassifier("MobileNet", video, modelReady);
  // 이미지 분류 모델로 MobileNet을 사용한다, 분류 대상, 콜백 함수
}

function draw() {
  background(0);
  image(video, 0, 0);
  // 캡쳐된 비디오 장면을 실제 캔버스 위에 그린다
  fill(255);
  textSize(32);
  text(label, 10, height - 20);
}
