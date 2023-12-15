let video;
let features;
let knn;
let labelP;
let ready = false;
let x;
let y;
let label = "loading model";

function modelReady() {
  console.log("MobileNet loaded!");
  knn = ml5.KNNClassifier();
  knn.load("./model.json", function () {
    console.log("KNN Data loaded");
    goClassify();
  });
}

function setup() {
  createCanvas(320, 240);
  video = createCapture(VIDEO);
  video.size(320, 240);
  // 좌우 반전: -1로 x축을 뒤집는다
  video.style("transform", "scale(-1, 1");
  features = ml5.featureExtractor("MobileNet", modelReady);
  labelP = createP("need training data");
  labelP.style("font-size", "32pt");
  x = width / 2;
  y = height / 2;
}

// 숫자 레이블을 원래의 텍스트 레이블로 변환하는 함수
function convertToOriginalLabel(labelNumber) {
  switch (labelNumber) {
    case "0":
      return "left";
    case "1":
      return "right";
    case "2":
      return "up";
    case "3":
      return "down";
    // 레이블에 따라 추가적인 케이스를 필요에 따라 처리할 수 있습니다.
    default:
      return "unknown";
  }
}

function goClassify() {
  const logits = features.infer(video);
  knn.classify(logits, function (error, result) {
    if (error) {
      console.error(error);
    } else {
      const numericLabel = result.label;
      label = convertToOriginalLabel(numericLabel);
      console.log(numericLabel, label);
      labelP.html(label);
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
  } else if (key == "d") {
    knn.addExample(logits, "down");
    console.log("down");
  } else if (key == " ") {
    knn.addExample(logits, "stay");
    console.log("stay");
  } else if (key == "s") {
    knn.save("model.json");
  }
}

function draw() {
  background(0);
  fill(255);
  ellipse(x, y, 24);

  if (label == "left") {
    x--;
  } else if (label == "right") {
    x++;
  } else if (label == "up") {
    y--;
  } else if (label == "down") {
    y++;
  }

  // x, y값을 0과 width, height의 사이의 값으로 유지시킨다
  x = constrain(x, 0, width);
  y = constrain(y, 0, height);
}
