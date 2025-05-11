import { blue, cyan, green, purple, red, yellow } from "./colors.js";
import { Triangle } from "./triangle.js";
import { Vec3, Vector3D } from "./vectors.js";

// TODO: remove this...
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

var xOffset = 0;
var yOffset = 0;

const vAf: Vector3D = Vec3.position(-2 + xOffset, -0.5 + yOffset, -0.5);
const vBf: Vector3D = Vec3.position(-2 + xOffset, 0.5 + yOffset, -0.5);
const vCf: Vector3D = Vec3.position(-1 + xOffset, 0.5 + yOffset, -0.5);
const vDf: Vector3D = Vec3.position(-1 + xOffset, -0.5 + yOffset, -0.5);

const vAb: Vector3D = Vec3.position(-2 + xOffset, -0.5 + yOffset, 0.5);
const vBb: Vector3D = Vec3.position(-2 + xOffset, 0.5 + yOffset, 0.5);
const vCb: Vector3D = Vec3.position(-1 + xOffset, 0.5 + yOffset, 0.5);
const vDb: Vector3D = Vec3.position(-1 + xOffset, -0.5 + yOffset, 0.5);

const cubeModel = {
  name: "cube",
  verticies: [vAf, vBf, vCf, vDf, vAb, vBb, vCb, vDb],
  triangles: [
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
  ],
};

const cube1 = {
  model: cubeModel,

  transform: {
    scale: 1.0,
    rotation: Vec3.vector(0, 10, 0),
    translation: Vec3.position(-1, -1, 5),
  },
};

const cube2 = {
  model: cubeModel,
  transform: {
    scale: 1.0,
    rotation: Vec3.vector(0, 0, 0),
    translation: Vec3.position(-0.5, -1, 10),
  },
};

export const scene = {
  instances: [cube1, cube2],
};
