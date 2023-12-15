let features;
let knn;
let labelP;
let ready = false;

let video;
let label = "loading model";
let HappyButton;
let SadButton;
let trainButton;
let saveButton;

function modelReady() {
  console.log("Model is ready!");
}

function videoReady() {
  console.log("Video is ready!");
}

function goClassify() {
  const logits = features.infer(video);
  knn.classify(logits, function (error, result) {
    if (error) {
      console.error(error);
    } else {
      // console.log(result);
      label = result.label;
      labelP.html(result.label);
      goClassify();
    }
  });
}

function keyPressed() {
  const logits = features.infer(video); // 특정 이미지에서 로짓을 추론...
  // 특징 추출
  if (key == "l") {
    knn.addExample(logits, "left");
    console.log("left");
  } else if (key == "r") {
    knn.addExample(logits, "right");
    console.log("right");
  } else if (key == "u") {
    knn.addExample(logits, "up");
    console.log("up");
  }
}

function setup() {
  createCanvas(640, 550);
  video = createCapture(VIDEO);
  video.hide();
  background(0);
  features = ml5.featureExtractor("MobileNet", modelReady);
  knn = ml5.KNNClassifier();
  labelP = createP("need training data");
  labelP.style("font-size", "32pt");
}

function draw() {
  image(video, 0, 0);
  if (!ready && knn.getNumLabels() > 0) {
    goClassify();
    ready = true;
  }
}
