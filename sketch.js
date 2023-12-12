let mobilenet;

let puffin;

function gotResults(error, results) {
  if (error) {
    console.error(error);
  } else {
    console.log(results);
    let label = results[0].label;
    let confidence = results[0].confidence;
    fill(0);
    textSize(64);
    text(label, 10, height - 50);
    createP(label);
    createP(confidence);
  }
}

function modelReady() {
  mobilenet.predict(puffin, gotResults);
}

function imageReady() {
  image(puffin, 0, 0, width, height);
}

function setup() {
  createCanvas(640, 480);
  puffin = createImg("images/puffin.jpeg", imageReady);
  puffin.hide();
  background(0);

  mobilenet = ml5.imageClassifier("MobileNet", modelReady);
}
