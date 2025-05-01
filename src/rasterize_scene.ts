import { interpolate } from './util.js';
import { Color, RGBColor, Vector3D, Vec3 } from './vectors.js';
import { Triangle} from "./triangle.js";
import { drawLine, putPixel, renderToCanvas, VIEWPORT_BOTTOM, VIEWPORT_LEFT, VIEWPORT_RIGHT, VIEWPORT_TOP } from './canvas.js';


const vertices: Vector3D[] = [
    
    Vec3.position(1, 1, 1),
    Vec3.position(-1, 1, 1 ),
    Vec3.position(-1, -1, 1 ),
    Vec3.position(1, -1, 1 ),
    Vec3.position(1,  1, -1 ),
    Vec3.position(-1,  1, -1 ),
    Vec3.position(-1,  -1, -1 ),
    Vec3.position(1,  -1, -1 ),
];

const red = RGBColor.fromRGB(1, 0, 0);
const green = RGBColor.fromRGB(0, 1, 0);
const blue = RGBColor.fromRGB(0, 0, 1);
const yellow = RGBColor.fromRGB(1, 1, 0);
const purple = RGBColor.fromRGB(1, 0, 1);
const cyan = RGBColor.fromRGB(0, 1, 1);

const triangles: Triangle[] = [
    Triangle.make(0, 1, 2, vertices, red),
    Triangle.make(0, 2, 3, vertices, red),
    Triangle.make(4, 0, 3, vertices, green),
    Triangle.make(4, 3, 7, vertices, green),
    Triangle.make(5, 4, 7, vertices, blue),
    Triangle.make(5, 7, 6, vertices, blue),
    Triangle.make(1, 5, 6, vertices, yellow),
    Triangle.make(1, 6, 2, vertices, yellow),
    Triangle.make(4, 5, 1, vertices, purple),
    Triangle.make(4, 1, 0, vertices, purple),
    Triangle.make(2, 6, 7, vertices, cyan),
    Triangle.make(2, 7, 3, vertices, cyan),
];

function renderObject(verticies: Vector3D, triangles: Triangle[]) {
    var projected = [];
    for (var i=0; i < vertices.length; i++) {
        const vertex = vertices[i];
projected.push(projectVertex);
    }
    for (var i=0; i < triangles.length; i++) {
        const triangle = triangles[i];
        renderTriangle(triangle, projected);
    }
}

function projectVertex(vertex: Vector3D) {
    // ...
}

function renderTriangle(triangle: Triangle, projected: any) {
    /*
  drawWireframeTriangle(projected[triangle.vertices[0].x],
    projected[triangle.vertices[0].y],
    projected[triangle.vertices[0].z],
triangle.color);
*/
}

function drawWireframeTriangle(triangle: Triangle, projected: any, color: Color) {
    
}
    

function main() {
    console.log('main is running', triangles);
    for (let canvasX = VIEWPORT_LEFT; canvasX <= VIEWPORT_RIGHT; canvasX++) {
        for (let canvasY = VIEWPORT_BOTTOM; canvasY <= VIEWPORT_TOP; canvasY++) {
            putPixel(Vec3.vector(canvasX, canvasY, 0), RGBColor.fromRGB(255, 255, 255));
        }
    }

    drawLine(Vec3.vector(0, 0, 0), 
             Vec3.vector(0, 3, 0), 
             RGBColor.fromRGB(255, 1, 255));

             /*
    // Next step - draw very small lines and debug all the < versus <= stuff
    drawLine(Vec3.vector(-200, -100, 0), 
             Vec3.vector(240, 120, 0), 
             RGBColor.fromRGB(255, 1, 1));

             drawLine(Vec3.vector(-50, -200, 0), 
             Vec3.vector(60, 240, 0), 
             RGBColor.fromRGB(1, 255, 1));
             */
    renderToCanvas();
}
main();