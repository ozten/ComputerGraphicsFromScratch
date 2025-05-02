import { interpolate, interpolateFloat } from "./util.js";
import { Color, RGBColor, Vector3D, Vec3 } from "./vectors.js";
import { Triangle } from "./triangle.js";
import {
  drawLine,
  putPixel,
  renderToCanvas,
  projectVertex,
  VIEWPORT_BOTTOM,
  VIEWPORT_LEFT,
  VIEWPORT_RIGHT,
  VIEWPORT_TOP,
} from "./canvas.js";

var scale = 255;

const vertices: Vector3D[] = [
  Vec3.position(1 * scale, 1 * scale, 1), // 0
  Vec3.position(-1 * scale, 1 * scale, 1), // 1
  Vec3.position(-1 * scale, -1 * scale, 1), // 2
  Vec3.position(1 * scale, -1 * scale, 1), // 3
  Vec3.position(1 * scale, 1 * scale, -1), // 4
  Vec3.position(-1 * scale, 1 * scale, -1), // 5
  Vec3.position(-1 * scale, -1 * scale, -1), // 6
  Vec3.position(1 * scale, -1 * scale, -1), // 7
];

// 0 to 1 how strongly we will show the color
const intensities: number[] = [0, 0, 1];

const red = RGBColor.fromRGB(1 * scale, 0, 0);
const green = RGBColor.fromRGB(0, 1 * scale, 0);
const blue = RGBColor.fromRGB(0, 0, 1 * scale);
const yellow = RGBColor.fromRGB(1 * scale, 1 * scale, 0);
const purple = RGBColor.fromRGB(1 * scale, 0, 1 * scale);
const cyan = RGBColor.fromRGB(0, 1 * scale, 1 * scale);

const triangles: Triangle[] = [
  Triangle.make(0, 1, 2, vertices, red), // 0
  Triangle.make(0, 2, 3, vertices, red), // 1
  Triangle.make(4, 0, 3, vertices, green), // 2
  Triangle.make(4, 3, 7, vertices, green), // 3
  Triangle.make(5, 4, 7, vertices, blue), // 4
  Triangle.make(5, 7, 6, vertices, blue), // 5
  Triangle.make(1, 5, 6, vertices, yellow), // 6
  Triangle.make(1, 6, 2, vertices, yellow), // 7
  Triangle.make(4, 5, 1, vertices, purple), // 8
  Triangle.make(4, 1, 0, vertices, purple), // 9
  Triangle.make(2, 6, 7, vertices, cyan), // 10
  Triangle.make(2, 7, 3, vertices, cyan), // 11
];



function renderObject(vertices: Vector3D[], triangles: Triangle[]) {
  var projected = [];
  for (var i = 0; i < vertices.length; i++) {
    const vertex = vertices[i];
    let projectedVertex = projectVertex(vertex);
    
    projected.push(projectedVertex);
  }
  for (var i = 0; i < triangles.length; i++) {
    const triangle = triangles[i];
    renderTriangle(triangle, projected);
  }
}

function renderTriangle(triangle: Triangle, projected: any) {
  /* drawWireframeTriangle(projected[triangle.vertices[0]],
    projected[triangle.vertices[1]],
    projected[triangle.vertices[2]],
triangle.color); */

  drawWireframeTriangle(
    Triangle.make(triangle.x, triangle.y, triangle.z, projected, triangle.color)
  );
}

function drawWireframeTriangle(
  triangle: Triangle
  /* projected: any,
  color: Color */
) {
  drawLine(triangle.vertices[0], triangle.vertices[1], triangle.color);
  drawLine(triangle.vertices[1], triangle.vertices[2], triangle.color);
  drawLine(triangle.vertices[2], triangle.vertices[0], triangle.color);
}

function removeLast(anArray) {
  return anArray.slice(0, anArray.length - 1);
}

function drawFilledTriangle(triangle: Triangle) {
  var p0 = triangle.vertices[0];
  var p1 = triangle.vertices[1];
  var p2 = triangle.vertices[2];

  if (p1.y < p0.y) {
    var t = p0;
    p0 = p1;
    p1 = t;
  }
  if (p2.y < p0.y) {
    var t = p0;
    p0 = p2;
    p2 = t;
  }
  if (p2.y < p1.y) {
    var t = p1;
    p1 = p2;
    p2 = t;
  }

  // TODO: these are not baked into the Triangle yet.
  // Chapter 8 is weird, didn't want to commit
  var h0 = intensities[0];
  var h1 = intensities[1];
  var h2 = intensities[2];

  var x01 = removeLast(interpolate(p0.y, p0.x, p1.y, p1.x));
  var h01 = removeLast(interpolateFloat(p0.y, h0, p1.y, h1));
  var x12 = interpolate(p1.y, p1.x, p2.y, p2.x);
  var h12 = interpolateFloat(p1.y, h1, p2.y, h2);
  var x02 = interpolate(p0.y, p0.x, p2.y, p2.x);
  var h02 = interpolateFloat(p0.y, h0, p2.y, h2);

  var x012 = x01.concat(x12);
  var h012 = h01.concat(h12);

  var m = Math.floor(x02.length / 2);
  var xLeft, xRight, hLeft, hRight;
  if (x02[m] < x012[m]) {
    xLeft = x02;
    hLeft = h02;
    xRight = x012;
    hRight = h012;
  } else {
    xLeft = x012;
    hLeft = h012;
    xRight = x02;
    hRight = h02;
  }

  for (var y = p0.y; y <= p2.y; y++) {
    var yMinusP0y = y - p0.y;

    var xLeftThisY = xLeft[yMinusP0y];
    var hLeftThisY = hLeft[yMinusP0y];
    var xRightThisY = xRight[yMinusP0y];
    var hRightThisY = hRight[yMinusP0y];
    var hSegment = interpolateFloat(
      xLeftThisY,
      hLeftThisY,
      xRightThisY,
      hRightThisY
    );

    for (var x = xLeft[y - p0.y]; x < xRight[y - p0.y]; x++) {
      var shadedColor = Vec3.mulScalar(triangle.color, hSegment[yMinusP0y]);
      putPixel(Vec3.vector(x, y, 0), RGBColor.fromVec3(shadedColor));
    }
  }
}

function main() {
  // White background
  for (let canvasX = VIEWPORT_LEFT; canvasX <= VIEWPORT_RIGHT; canvasX++) {
    for (let canvasY = VIEWPORT_BOTTOM; canvasY <= VIEWPORT_TOP; canvasY++) {
      putPixel(
        Vec3.vector(canvasX, canvasY, 0),
        RGBColor.fromRGB(255, 255, 255)
      );
    }
  }

  /*
  drawLine(
    Vec3.vector(0, 0, 0),
    Vec3.vector(30, 30, 0),
    RGBColor.fromRGB(255, 1, 255)
  );

 // 768x512   -384 to 384 x -256 to 256
  // Repeating long diagonal line
  // Next step - draw very small lines and debug all the < versus <= stuff

  drawLine(
    Vec3.vector(-200, -100, 0),
    Vec3.vector(240, 120, 0),
    RGBColor.fromRGB(255, 1, 1)
  ); 






  drawLine(
    Vec3.vector(-50, -200, 0),
    Vec3.vector(60, 240, 0),
    RGBColor.fromRGB(1, 255, 1)
  );


  
  */

  /*
  for (var i=0; i < triangles.length; i++) {
    drawWireframeTriangle(triangles[i]);
  }*/

  /*   drawFilledTriangle(triangles[0]); */

  function debugProjectVertex(v: Vector3D) {
    console.log(v, "projects to", projectVertex(v));
  }

  /*
debugProjectVertex(vAf);
debugProjectVertex(vBf);
debugProjectVertex(vCf);
debugProjectVertex(vDf);
*/

/*
  drawLine(
    projectVertex(Vec3.position(6.1, 6, 2)),
    projectVertex(Vec3.position(6.5, 6, 2)),
    blue
  );

  // Back face
  drawLine(projectVertex(vAb), projectVertex(vBb), red);
  drawLine(projectVertex(vBb), projectVertex(vCb), red);
  drawLine(projectVertex(vCb), projectVertex(vDb), red);
  drawLine(projectVertex(vDb), projectVertex(vAb), red);

  // Front to Back edges
  drawLine(projectVertex(vAf), projectVertex(vAb), green);
  drawLine(projectVertex(vBf), projectVertex(vBb), green);
  drawLine(projectVertex(vCf), projectVertex(vCb), green);
  drawLine(projectVertex(vDf), projectVertex(vDb), green);

  // Front face
  drawLine(projectVertex(vAf), projectVertex(vBf), blue);
  drawLine(projectVertex(vBf), projectVertex(vCf), blue);
  drawLine(projectVertex(vCf), projectVertex(vDf), blue);
  drawLine(projectVertex(vDf), projectVertex(vAf), blue);
*/

// Cube Verticies and Triangles

let cxOffset = -2;
let cyScale = 1;
let cyTranslate = -1.5;



let czOffset = 8 + Math.sin(new Date().getTime() / 500);


const cV: Vector3D[] = [
  Vec3.position(1 + cxOffset , (1 * cyScale) + cyTranslate, 1 + czOffset), // 0 A
  Vec3.position(-1 + cxOffset, (1 * cyScale) + cyTranslate, 1 + czOffset), // 1 B
  Vec3.position(-1 + cxOffset, (-1 * cyScale) + cyTranslate, 1 + czOffset), // 2 C
  Vec3.position(1 + cxOffset, (-1 * cyScale) + cyTranslate, 1 + czOffset), // 3 D
  Vec3.position(1 + cxOffset, (1 * cyScale) + cyTranslate, -1 + czOffset), // 4 E
  Vec3.position(-1 + cxOffset, (1 * cyScale) + cyTranslate, -1 + czOffset), // 5 F
  Vec3.position(-1 + cxOffset, (-1 * cyScale) + cyTranslate, -1 + czOffset), // 6 G
  Vec3.position(1 + cxOffset, (-1 * cyScale) + cyTranslate, -1 + czOffset), // 7 H
];

const cT: Triangle[] = [
  Triangle.make(0, 1, 2, vertices, red), // 0
  Triangle.make(0, 2, 3, vertices, red), // 1
  Triangle.make(4, 0, 3, vertices, green), // 2
  Triangle.make(4, 3, 7, vertices, green), // 3
  Triangle.make(5, 4, 7, vertices, blue), // 4
  Triangle.make(5, 7, 6, vertices, blue), // 5
  Triangle.make(1, 5, 6, vertices, yellow), // 6
  Triangle.make(1, 6, 2, vertices, yellow), // 7
  Triangle.make(4, 5, 1, vertices, purple), // 8
  Triangle.make(4, 1, 0, vertices, purple), // 9
  Triangle.make(2, 6, 7, vertices, cyan), // 10
  Triangle.make(2, 7, 3, vertices, cyan), // 11
];
  renderObject(cV, cT);

  renderToCanvas();
}

var xOffset = -1;
var yOffset = -2;

const vAf: Vector3D = Vec3.position(-2 + xOffset, -0.5 + yOffset, 5);
const vBf: Vector3D = Vec3.position(-2 + xOffset, 0.5 + yOffset, 5);
const vCf: Vector3D = Vec3.position(-1 + xOffset, 0.5 + yOffset, 5);
const vDf: Vector3D = Vec3.position(-1 + xOffset, -0.5 + yOffset, 5);

const vAb: Vector3D = Vec3.position(-2 + xOffset, -0.5 + yOffset, 6);
const vBb: Vector3D = Vec3.position(-2 + xOffset, 0.5 + yOffset, 6);
const vCb: Vector3D = Vec3.position(-1 + xOffset, 0.5 + yOffset, 6);
const vDb: Vector3D = Vec3.position(-1 + xOffset, -0.5 + yOffset, 6);

let running = true;
function loop() {
    requestAnimationFrame(() => {
        main();
        if (running) {
            loop();
        }
        
    })
    
}

loop();
