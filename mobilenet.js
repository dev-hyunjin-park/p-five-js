let mobilenet;
let classifier;

let video;
let label = "loading model";
let HappyButton;
let SadButton;
let trainButton;
let saveButton;

function modelReady() {
  console.log("Model is ready!");
  // 로드 파일 - 하나의 파일을 로드하면 자동적으로 같은 위치에 있는 나머지 파일을 찾도록 설정되어있다
  classifier.load("model.json", customModelReady);
}

function customModelReady() {
  console.log("Custom Model is ready!");
  label = "model ready";
  classifier.classify(gotResults);
}

function videoReady() {
  console.log("Video is ready!");
}

// training process에 대해 report back to me
// function whileTraining(loss) {
//   if (loss == null) {
//     console.log("Training Complete");
//     classifier.classify(gotResults);
//   } else {
//     console.log(loss);
//   }
// }

function gotResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
    label = result[0].label;
    classifier.classify(gotResults);
  }
}

function setup() {
  createCanvas(640, 550);
  video = createCapture(VIDEO);
  video.hide();
  background(0);
  mobilenet = ml5.featureExtractor("MobileNet", modelReady);
  classifier = mobilenet.classification(video, videoReady);

  // HappyButton = createButton("happy");
  // HappyButton.mousePressed(function () {
  //   classifier.addImage("happy");
  // });
  // SadButton = createButton("sad");
  // SadButton.mousePressed(function () {
  //   classifier.addImage("sad");
  // });
  // trainButton = createButton("train");
  // trainButton.mousePressed(function () {
  //   classifier.train(whileTraining);
  // });
  saveButton = createButton("save");
  saveButton.mousePressed(function () {
    classifier.save();
  });
}

function draw() {
  background(0);
  image(video, 0, 0);
  // 캡쳐된 비디오 장면을 실제 캔버스 위에 그린다
  fill(255);
  textSize(32);
  text(label, 10, height - 20);
}
