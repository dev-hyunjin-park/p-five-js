let model;
let targetLabel = "C";
// let trainingData=[];

let state = "collection";

let notes = {
  C: 261.6256, // 연주를 위한 주파수 - 순서대로 도레미파솔라시 (4옥타브)
  D: 293.6648,
  E: 329.6276,
  F: 349.2282,
  G: 391.9954,
  A: 440.0,
  B: 493.8833,
};

let env, wave;

function setup() {
  createCanvas(800, 1000);
  background(226, 226, 226);

  // 소리 생성
  env = new p5.Envelope();
  env.setADSR(0.05, 0.1, 0.5, 1); // Attack(증폭 시작), Decay(감쇠), Sustain(유지), Release(해제) 값
  env.setRange(1.2, 0); // 엔벨롭의 최대 및 최소 범위

  wave = new p5.Oscillator(); // 소리의 주기를 생성

  wave.setType("sine");
  wave.start();
  wave.freq(440); // 주파수
  wave.amp(env); // 음량을 env로 제어한다

  // neural network option 지정
  let options = {
    inputs: ["x", "y"],
    outputs: ["label"],
    task: "classification",
    debug: "true",
    learningRate: 0.5,
  };

  // 모델 초기화
  model = ml5.neuralNetwork(options);

  // load data
  model.loadData("2023-12-16_21-45-12.json", dataLoaded);

  // load pre-trained model
  const modelDetails = {
    model: "model/model.json",
    metadata: "model/model_meta.json",
    weights: "model/model.weights.bin",
  };
  model.load(modelDetails, modelLoaded);
}

function modelLoaded() {
  console.log("model loaded");
  state = "prediction";
}

function dataLoaded() {
  console.log("data loaded");
  let data = model.data;
  console.log(model);
  for (let i = 0; i < data.length; i++) {
    let inputs = data[i].xs;
    let target = data[i].ys;
    stroke(0);
    noFill();
    ellipse(inputs.x, inputs.y, 24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(target.label, inputs.x, inputs.y);
  }
  // state = "training";
  // console.log("starting training");
  // model.normalizeData();
  // let options = {
  //   epochs: 200, // 전체 데이터 세트를 200번 반복해서 학습한다
  // };
  // model.train(options, whileTraining, finishedTraining);
}

function whileTraining(epochs, loss) {
  // console.log(epochs);
}

function finishedTraining() {
  state = "prediction";
  console.log("finished training");
}

function keyPressed() {
  if (key == "t") {
    state = "training";
    console.log("starting training");
    model.normalizeData();
    let options = {
      epochs: 200, // 전체 데이터 세트를 200번 반복해서 학습한다
    };
    model.train(options, whileTraining, finishedTraining);
    // whileTraining은 매 epochs마다 실행된다
  } else if (key == "s") {
    model.saveData();
  } else if (key == "m") {
    // custom name으로 저장할 경우 에러 있음
    model.save();
  } else {
    targetLabel = key.toUpperCase();
  }
}

function mousePressed() {
  let inputs = {
    x: mouseX, // 마우스의 x 좌표를 입력 변수 x에 할당
    y: mouseY, // 마우스의 y 좌표를 입력 변수 y에 할당
  };

  if (state == "collection") {
    let target = {
      label: targetLabel, // 현재 설정된 targetLabel 값을 가진 label을 출력 변수로 설정
    };

    model.addData(inputs, target); // 모델에 입력과 출력 데이터를 추가하여 학습 데이터 수집
    // 입출력 데이터는 모델 초기화 때 넘겨준 options과 같은 형식을 가져아한다

    stroke(0);
    noFill();
    ellipse(mouseX, mouseY, 24);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(targetLabel, mouseX, mouseY);
  } else if (state == "prediction") {
    model.classify(inputs, gotResults);
  }
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  userStartAudio();
  stroke(0);
  fill(0, 0, 255, 100);
  ellipse(mouseX, mouseY, 24);

  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);

  let label = results[0].label;
  text(label, mouseX, mouseY);
  wave.freq(notes[label]);
  env.play();
}
