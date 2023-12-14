// let img;
let video;
let detector;
let detections = {};
let idCount = 0;

function preload() {
  // img = loadImage('dog_cat.jpg');
  detector = ml5.objectDetector("cocossd");
}

function gotDetections(error, results) {
  if (error) {
    console.error(error);
  }

  let labels = Object.keys(detections);
  for (let label of labels) {
    let objects = detections[label];
    // label 기준으로 객체 정보를 저장한다
    for (let object of objects) {
      object.taken = false;
      // 각 객체의 taken 초기값은 false로 저장한다
    }
  }

  for (let i = 0; i < results?.length; i++) {
    let object = results[i];
    let label = object.label;

    if (detections[label]) {
      let existing = detections[label];
      // 저장된 객체가 아니라면 idCount를 부여한 후 저장한다
      // 각 객체의 타이머는 100으로 시작한다
      if (existing.length == 0) {
        object.id = idCount;
        idCount++;
        existing.push(object);
        object.timer = 100;
      } else {
        // 해당 라벨이 저장된 적 있는 객체라면
        // 이미 존재하는 객체들과의 거리를 비교해서 가장 가까운 객체를 찾는다
        let recordDist = Infinity;
        let closest = null;
        for (let candidate of existing) {
          let d = dist(candidate.x, candidate.y, object.x, object.y);
          if (d < recordDist && !candidate.taken) {
            recordDist = d;
            closest = candidate;
          }
        }
        // 최소 거리에 있는 객체를 찾으면, 해당 객체의 위치와 크기를 부드러운 움직임 효과를 주면서(lerp 함수 사용) 현재 객체의 정보로 갱신하고, taken 속성을 true로 설정합니다.
        if (closest) {
          // copy x,y,w,h
          let amt = 0.75; //0.75;
          closest.x = lerp(object.x, closest.x, amt);
          closest.y = lerp(object.y, closest.y, amt);
          closest.width = lerp(object.width, closest.width, amt);
          closest.height = lerp(object.height, closest.height, amt);
          closest.taken = true;
          closest.timer = 100;
        } else {
          // 최소 거리에 있는 객체가 없다면, 현재 객체를 새로운 객체로 인식하고 idCount를 부여한 후 existing 배열에 추가합니다.
          object.id = idCount;
          idCount++;
          existing.push(object);
          object.timer = 100;
        }
      }
    } else {
      object.id = idCount;
      idCount++;
      detections[label] = [object];
      object.timer = 100;
    }
  }
  detector.detect(video, gotDetections);
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  detector.detect(video, gotDetections);
}

function draw() {
  image(video, 0, 0);

  let labels = Object.keys(detections);
  for (let label of labels) {
    let objects = detections[label];
    for (let i = objects.length - 1; i >= 0; i--) {
      let object = objects[i];
      if (object.label !== "person") {
        stroke(0, 255, 0);
        strokeWeight(4);
        fill(0, 255, 0, object.timer); // timer 값으로 투명도 설정
        rect(object.x, object.y, object.width, object.height);
        noStroke();
        fill(0);
        textSize(32);
        text(object.label + " " + object.id, object.x + 10, object.y + 24);
      }
      object.timer -= 2;
      // 화면에 표시된 후 감소하면서 해당 객체를 화면에서 제거하는데 사용됩니다.
      if (object.timer < 0) {
        objects.splice(i, 1);
      }
    }
  }
}
