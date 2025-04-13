// Base interface for 3D vectors with x, y, z components
export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

// Color representation with r, g, b components
// Also implements Vector3D interface for compatibility
export interface Color extends Vector3D {
  r: number;
  g: number;
  b: number;

  // Getters to map r,g,b to x,y,z for Vector3D compatibility
  get x(): number;
  get y(): number;
  get z(): number;
}

// Position in 3D space
export type Position = Vector3D;

// Regular vector in 3D space
export type Vector = Vector3D;

// Normal vector with length = 1
export interface Normal extends Vector3D {
  readonly _normalBrand: unique symbol; // Type branding to enforce normal constraint
}

// Helper functions to create and verify these types
export class Vec3 {
  // Create a position vector
  static position(x: number, y: number, z: number): Position {
    return { x, y, z };
  }

  // Create a regular vector
  static vector(x: number, y: number, z: number): Vector {
    return { x, y, z };
  }

  // Create a normal vector (normalizes the input)
  static normal(x: number, y: number, z: number): Normal {
    const length = Math.sqrt(x * x + y * y + z * z);
    if (length === 0) throw new Error("Cannot create a normal from zero vector");
    
    // Using type assertion since TypeScript can't verify runtime constraints
    return {
      x: x / length,
      y: y / length,
      z: z / length,
      _normalBrand: Symbol() as any
    };
  }

  // Validate if a Vector3D is a properly normalized normal vector
  static isNormal(v: Vector3D): v is Normal {
    const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    return Math.abs(length - 1) < 0.00001; // Floating point epsilon check
  }
  
  // Convert a vector to a normal
  static normalize(v: Vector3D): Normal {
    return Vec3.normal(v.x, v.y, v.z);
  }

  // Vector operations
  static add(a: Vector3D, b: Vector3D): Vector3D {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
  }

  static sub(a: Vector3D, b: Vector3D): Vector3D {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  }

  static mul(a: Vector3D, b: Vector3D): Vector3D {
    return { x: a.x * b.x, y: a.y * b.y, z: a.z * b.z };
  }

  static mulScalar(v: Vector3D, s: number): Vector3D {
    return { x: v.x * s, y: v.y * s, z: v.z * s };
  }

  static subScalar(v: Vector3D, s: number): Vector3D {
    return { x: v.x - s, y: v.y - s, z: v.z - s };
  }

  static div(a: Vector3D, b: Vector3D): Vector3D {
    return { x: a.x / b.x, y: a.y / b.y, z: a.z / b.z };
  }

  static dot(a: Vector3D, b: Vector3D): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  static cross(a: Vector3D, b: Vector3D): Vector3D {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x
    };
  }

  // Vector length/magnitude - renamed from 'length' to avoid conflict with Function.length
  static magnitude(v: Vector3D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  }
}

// Color implementation with Vector3D compatibility
export class RGBColor implements Color {
  constructor(
    public r: number,
    public g: number,
    public b: number
  ) {}

  get x(): number { return this.r; }
  get y(): number { return this.g; }
  get z(): number { return this.b; }

  // Helper to create a color from RGB values (0-255)
  static fromRGB(r: number, g: number, b: number): RGBColor {
    return new RGBColor(r, g, b);
  }
}
