import { Color, Normal, Position, Vector, Vector3D, Vec3 } from './vectors.js';
// definitions for AmbientLight, PointLight, DirectionalLight

export interface Light {
    intensity: number;
}

export class AmbientLight implements Light {
    constructor(public intensity: number, public color: Color) { }
}

export class PointLight implements Light {
    constructor(public intensity: number, public position: Position, public color: Color) { }
}

export class DirectionalLight implements Light {
    constructor(public intensity: number, public direction: Vector, public color: Color) { }
}

export const computeLighting = (point: Position, normal: Normal, lights: Light[]): number => {
    var intensity = 0;
    for (var i = 0; i < lights.length; i++) {
        const light = lights[i];
        var lightDirection: Vector3D = null;
        if (light instanceof AmbientLight) {
            intensity += light.intensity;
        } else {
            if (light instanceof PointLight) {
                lightDirection = Vec3.sub(light.position, point);
            } else if (light instanceof DirectionalLight) {
                lightDirection = light.direction;
            }
            if (light instanceof PointLight || light instanceof DirectionalLight) {
                const nDotL = Vec3.dot(normal, lightDirection);
                if (nDotL > 0) {
                    intensity += light.intensity * nDotL / (Vec3.magnitude(normal) * Vec3.magnitude(lightDirection));
                }
            }
        }

    }
    return intensity;
}