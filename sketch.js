const scalingFactor = 1/Math.sqrt(7);
const iterTotal = 4;
const newLength = 410;
let shiftAngle;

const x1 = 2560/2;
const y1 = 1440/2+450;

const color1 = '#FFCDD7' ;
const color2 = 'white';
const strokeColor = '#05297D';

let angleDegree1;
let resultDots1;
let resultDots2;

function setup() {
  createCanvas(2560, 1440);
  c1 = color(color1);
  c2 = color(color2);
  
  for(let y=0; y<height; y++){
    n = map(y,0,height,0,1);
    let newc = lerpColor(c1,c2,n);
    stroke(newc);
    line(0,y,width, y);
  }
  strokeWeight(2.7);
  stroke(strokeColor);

  angleDegree1 = 0*PI;
  shiftAngle = 1/3*PI; // constant of 60 degrees, has to be neg because

  const p1 = {'point': {'x': x1, 'y':y1},'angleDegree':angleDegree1 };
  const p2 = kochLineEnd(p1.point.x, p1.point.y,newLength,p1.angleDegree);
  const p3 = kochLineEnd(p2.point.x, p2.point.y,newLength,p2.angleDegree+shiftAngle);
  const p4 = kochLineEnd(p3.point.x, p3.point.y,newLength,p3.angleDegree+2*shiftAngle);
  const pt5 = kochLineEnd(p4.point.x, p4.point.y,newLength,p4.angleDegree-shiftAngle);
  const p6 = kochLineEnd(pt5.point.x, pt5.point.y,newLength, pt5.angleDegree-2*shiftAngle);
  const p7 = kochLineEnd(p6.point.x, p6.point.y,newLength,p6.angleDegree);
  const p8 = kochLineEnd(p7.point.x, p7.point.y,newLength,p7.angleDegree-shiftAngle);
  startDots = [p1,p2,p3,p4,pt5,p6,p7,p8];

  resultDots1 = kochGenerator(iterTotal,[startDots]);
  connectTheDots(resultDots1);
  saveCanvas('gosper_curve_gradient1', 'png');
}

function draw() {
  stroke(strokeColor);
  connectTheDots(resultDots1);
}

function connectTheDots(dotsArray) {
  let index1 = 0;
  let index2 = 1;
  dotsArray.forEach(subArr => {
    while(index2 <= subArr.length-1){
      line(subArr[index1].point.x,
        subArr[index1].point.y,
        subArr[index2].point.x,
        subArr[index2].point.y
          );
      index1++;
      index2++;
      }
    index1 = 0;
    index2 = 1;
  })
  }

  function drawDots(dotsArray) {
    const flatArray = dotsArray.flat();
    flatArray.forEach((dot) => {
      circle(dot.point.x, dot.point.y,5)
    });
    }

function kochGenerator(iterTotal,dotsArray) {
  if (iterTotal===0) { return dotsArray};
  let nextDotsArray = [];
  let arrPointer = 0;
  while (arrPointer < dotsArray.length) {
    const p1 = dotsArray[arrPointer][0];
    const p2 = dotsArray[arrPointer][1];
    const p3 = dotsArray[arrPointer][2];
    const p4 = dotsArray[arrPointer][3];
    const pt5 = dotsArray[arrPointer][4];
    const p6 = dotsArray[arrPointer][5];
    const p7 = dotsArray[arrPointer][6];
    const p8 = dotsArray[arrPointer][7];
    nextDotsArray.push(convertLineToLeftRightKochShape(p1.point.x, p1.point.y, p2.point.x, p2.point.y, p2.angleDegree));
    nextDotsArray.push(convertLineToLeftRightKochShape(p3.point.x, p3.point.y, p2.point.x, p2.point.y, PI+p3.angleDegree));
    nextDotsArray.push(convertLineToLeftRightKochShape(p4.point.x, p4.point.y, p3.point.x, p3.point.y, PI+p4.angleDegree));
    nextDotsArray.push(convertLineToLeftRightKochShape(p4.point.x, p4.point.y, pt5.point.x, pt5.point.y, pt5.angleDegree));
    nextDotsArray.push(convertLineToLeftRightKochShape(pt5.point.x, pt5.point.y, p6.point.x, p6.point.y, p6.angleDegree));
    nextDotsArray.push(convertLineToLeftRightKochShape(p6.point.x, p6.point.y, p7.point.x, p7.point.y, p7.angleDegree));
    nextDotsArray.push(convertLineToLeftRightKochShape(p8.point.x, p8.point.y, p7.point.x, p7.point.y, PI+p8.angleDegree));
    arrPointer++;
  }
  return kochGenerator(iterTotal-1,nextDotsArray);
}

function kochLineEnd(x1,y1,length,angleDegree) {
  const endingPointX = x1+length*cos(angleDegree);
  const endingPointY = y1-length*sin(angleDegree);
  return {'point':{x: endingPointX, y:endingPointY},angleDegree};
}

function convertLineToLeftRightKochShape(x1,y1,x2,y2,angleDegree) {
  const bs = 22.72/12*PI+angleDegree; 
  const length = Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));
  const newLength = scalingFactor*length;
  const lineArray = leftRightGosperLine(x1,y1,newLength,bs);
  return lineArray;
}

function convertLineToRightLeftKochShape(x1,y1,x2,y2,angleDegree) {
  const bs = 22.72/12*PI+angleDegree; 
  const length = Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));
  const newLength = scalingFactor*length;
  const lineArray = rightLeftGosperLine(x1,y1,newLength,bs);
  return lineArray;
}

function leftRightGosperLine(x,y,newLength,angleDegree) {
  const p1 = {'point': {'x': x, 'y':y},angleDegree };
  const p2 = kochLineEnd(p1.point.x, p1.point.y,newLength,p1.angleDegree);
  const p3 = kochLineEnd(p2.point.x, p2.point.y,newLength,p2.angleDegree+shiftAngle);
  const p4 = kochLineEnd(p3.point.x, p3.point.y,newLength,p3.angleDegree+2*shiftAngle);
  const pt5 = kochLineEnd(p4.point.x, p4.point.y,newLength,p4.angleDegree-shiftAngle);
  const p6 = kochLineEnd(pt5.point.x, pt5.point.y,newLength, pt5.angleDegree-2*shiftAngle);
  const p7 = kochLineEnd(p6.point.x, p6.point.y,newLength,p6.angleDegree);
  const p8 = kochLineEnd(p7.point.x, p7.point.y,newLength,p7.angleDegree-shiftAngle);
  return [p1,p2,p3,p4,pt5,p6,p7,p8];
}

function rightLeftGosperLine(x,y,newLength,angleDegree) {
  const p1 = {'point': {'x': x, 'y':y},angleDegree };
  const p2 = kochLineEnd(p1.point.x, p1.point.y,newLength,p1.angleDegree-shiftAngle);
  const p3 = kochLineEnd(p2.point.x, p2.point.y,newLength,p2.angleDegree+shiftAngle);
  const p4 = kochLineEnd(p3.point.x, p3.point.y,newLength,p3.angleDegree);
  const pt5 = kochLineEnd(p4.point.x, p4.point.y,newLength,p4.angleDegree+2*shiftAngle);
  const p6 = kochLineEnd(pt5.point.x, pt5.point.y,newLength, pt5.angleDegree+shiftAngle);
  const p7 = kochLineEnd(p6.point.x, p6.point.y,newLength,p6.angleDegree-2*shiftAngle);
  const p8 = kochLineEnd(p7.point.x, p7.point.y,newLength,p7.angleDegree-shiftAngle);
  return [p1,p2,p3,p4,pt5,p6,p7,p8];
}
