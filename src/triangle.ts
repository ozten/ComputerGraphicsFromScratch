import { Color, Vector3D } from "./vectors.js"

export class Triangle {
    vertices: Vector3D[];
    color: Color;

    static make(x: number, y: number, z: number, allVertices: Vector3D[], color: Color): Triangle {
        return {
            vertices: [
                allVertices[x],
                allVertices[y],
                allVertices[z]
            ],
            color
        };
    }
}

