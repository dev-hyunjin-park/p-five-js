let video;
let poseNet;
let pose;
let skeleton;

let brain;

let state = "waiting";
let targetLabel;

function keyPressed() {
  if (key == "s") {
    brain.saveData();
  } else {
    targetLabel = key;
    console.log(targetLabel);

    setTimeout(function () {
      console.log("collecting");
      state = "collecting";

      // 10초동안만 포즈를 수집한다
      setTimeout(function () {
        console.log("not collecting");
        state = "waiting";
      }, 10000);
    }, 1000);
  }
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);

  let options = {
    inputs: 34, // pose
    outputs: 4,
    task: "classification",
    debug: true,
  };
  brain = ml5.neuralNetwork(options);
}

function gotPoses(poses) {
  //   console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;

    if (state == "collecting") {
      let inputs = [];
      for (let i = 0; i < pose.keypoints.length; i++) {
        //   console.log(pose.keypoints[i]);
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        inputs.push(x);
        inputs.push(y);
      }
      let target = [targetLabel];
      brain.addData(inputs, target);
      // inputs: 모든 포즈의 x, y 좌표
    }
  }
}

function modelLoaded() {
  console.log("poseNet ready");
}

function draw() {
  // 좌우 반전
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);

    fill(255, 0, 0);
    ellipse(pose.nose.x, pose.nose.y, d);

    fill(255, 255, 255);
    ellipse(eyeL.x, eyeL.y, d * 0.8);
    fill(0, 0, 0);
    ellipse(eyeL.x, eyeL.y, d * 0.4);

    fill(255, 255, 255);
    ellipse(eyeR.x, eyeR.y, d * 0.8);
    fill(0, 0, 0);
    ellipse(eyeR.x, eyeR.y, d * 0.4);

    // fill(255, 255, 0);
    // ellipse(pose.rightWrist.x, pose.rightWrist.y, 12);
    // fill(255, 255, 0);
    // ellipse(pose.leftWrist.x, pose.leftWrist.y, 12);
    // console.log(pose);
    for (let i = 0; i < pose.keypoints.length; i++) {
      //   console.log(pose.keypoints[i]);
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0, 255, 0);
      ellipse(x, y, 15, 15);
    }
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
  }
}
