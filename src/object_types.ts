import { Triangle } from "./triangle";
import { Vector3D } from "./vectors";

export interface Model {
  name: string;
  verticies: Vector3D[];
  triangles: Triangle[];
}

export interface Transform {
  scale: number;
  rotation: Vector3D;
  translation: Vector3D;
}

export interface Instance {
  model: Model;
  transform: Transform;
}
