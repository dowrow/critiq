/**
 * Minimal DOMMatrix polyfill for Node.js environments.
 *
 * pdfjs-dist (used by pdf-parse) creates a module-scope
 * `const SCALE_MATRIX = new DOMMatrix()` which throws
 * "DOMMatrix is not defined" when running on the server.
 *
 * This polyfill provides just enough surface area so that
 * pdfjs-dist can load without errors.  Only text-extraction
 * code paths are exercised on the server; the matrix
 * maths used for canvas rendering is never reached.
 */

if (typeof globalThis.DOMMatrix === "undefined") {
  class DOMMatrixPolyfill {
    m11: number;
    m12: number;
    m13: number;
    m14: number;
    m21: number;
    m22: number;
    m23: number;
    m24: number;
    m31: number;
    m32: number;
    m33: number;
    m34: number;
    m41: number;
    m42: number;
    m43: number;
    m44: number;

    constructor(init?: number[] | Float32Array | Float64Array) {
      // Identity matrix defaults
      this.m11 = 1;
      this.m12 = 0;
      this.m13 = 0;
      this.m14 = 0;
      this.m21 = 0;
      this.m22 = 1;
      this.m23 = 0;
      this.m24 = 0;
      this.m31 = 0;
      this.m32 = 0;
      this.m33 = 1;
      this.m34 = 0;
      this.m41 = 0;
      this.m42 = 0;
      this.m43 = 0;
      this.m44 = 1;

      if (init && init.length === 6) {
        this.m11 = init[0];
        this.m12 = init[1];
        this.m21 = init[2];
        this.m22 = init[3];
        this.m41 = init[4];
        this.m42 = init[5];
      } else if (init && init.length === 16) {
        this.m11 = init[0];
        this.m12 = init[1];
        this.m13 = init[2];
        this.m14 = init[3];
        this.m21 = init[4];
        this.m22 = init[5];
        this.m23 = init[6];
        this.m24 = init[7];
        this.m31 = init[8];
        this.m32 = init[9];
        this.m33 = init[10];
        this.m34 = init[11];
        this.m41 = init[12];
        this.m42 = init[13];
        this.m43 = init[14];
        this.m44 = init[15];
      }
    }

    // 2-D aliases
    get a() {
      return this.m11;
    }
    set a(v: number) {
      this.m11 = v;
    }
    get b() {
      return this.m12;
    }
    set b(v: number) {
      this.m12 = v;
    }
    get c() {
      return this.m21;
    }
    set c(v: number) {
      this.m21 = v;
    }
    get d() {
      return this.m22;
    }
    set d(v: number) {
      this.m22 = v;
    }
    get e() {
      return this.m41;
    }
    set e(v: number) {
      this.m41 = v;
    }
    get f() {
      return this.m42;
    }
    set f(v: number) {
      this.m42 = v;
    }

    get is2D() {
      return (
        this.m13 === 0 &&
        this.m14 === 0 &&
        this.m23 === 0 &&
        this.m24 === 0 &&
        this.m31 === 0 &&
        this.m32 === 0 &&
        this.m33 === 1 &&
        this.m34 === 0 &&
        this.m43 === 0 &&
        this.m44 === 1
      );
    }

    get isIdentity() {
      return (
        this.m11 === 1 &&
        this.m12 === 0 &&
        this.m13 === 0 &&
        this.m14 === 0 &&
        this.m21 === 0 &&
        this.m22 === 1 &&
        this.m23 === 0 &&
        this.m24 === 0 &&
        this.m31 === 0 &&
        this.m32 === 0 &&
        this.m33 === 1 &&
        this.m34 === 0 &&
        this.m41 === 0 &&
        this.m42 === 0 &&
        this.m43 === 0 &&
        this.m44 === 1
      );
    }

    invertSelf(): this {
      const { m11, m12, m21, m22, m41, m42 } = this;
      const det = m11 * m22 - m12 * m21;
      if (det === 0) return this;
      const invDet = 1 / det;
      this.m11 = m22 * invDet;
      this.m12 = -m12 * invDet;
      this.m21 = -m21 * invDet;
      this.m22 = m11 * invDet;
      this.m41 = (m21 * m42 - m22 * m41) * invDet;
      this.m42 = (m12 * m41 - m11 * m42) * invDet;
      return this;
    }

    multiplySelf(other: DOMMatrixPolyfill): this {
      const a = this.m11 * other.m11 + this.m12 * other.m21;
      const b = this.m11 * other.m12 + this.m12 * other.m22;
      const c = this.m21 * other.m11 + this.m22 * other.m21;
      const d = this.m21 * other.m12 + this.m22 * other.m22;
      const e =
        this.m41 * other.m11 + this.m42 * other.m21 + other.m41;
      const f =
        this.m41 * other.m12 + this.m42 * other.m22 + other.m42;
      this.m11 = a;
      this.m12 = b;
      this.m21 = c;
      this.m22 = d;
      this.m41 = e;
      this.m42 = f;
      return this;
    }

    preMultiplySelf(other: DOMMatrixPolyfill): this {
      const a = other.m11 * this.m11 + other.m12 * this.m21;
      const b = other.m11 * this.m12 + other.m12 * this.m22;
      const c = other.m21 * this.m11 + other.m22 * this.m21;
      const d = other.m21 * this.m12 + other.m22 * this.m22;
      const e =
        other.m41 * this.m11 + other.m42 * this.m21 + this.m41;
      const f =
        other.m41 * this.m12 + other.m42 * this.m22 + this.m42;
      this.m11 = a;
      this.m12 = b;
      this.m21 = c;
      this.m22 = d;
      this.m41 = e;
      this.m42 = f;
      return this;
    }

    translateSelf(tx: number, ty: number): this {
      this.m41 += tx * this.m11 + ty * this.m21;
      this.m42 += tx * this.m12 + ty * this.m22;
      return this;
    }

    translate(tx: number, ty: number): DOMMatrixPolyfill {
      const m = new DOMMatrixPolyfill([
        this.m11,
        this.m12,
        this.m21,
        this.m22,
        this.m41,
        this.m42,
      ]);
      return m.translateSelf(tx, ty);
    }

    scaleSelf(sx: number, sy?: number): this {
      sy = sy ?? sx;
      this.m11 *= sx;
      this.m12 *= sx;
      this.m21 *= sy;
      this.m22 *= sy;
      return this;
    }

    scale(sx: number, sy?: number): DOMMatrixPolyfill {
      const m = new DOMMatrixPolyfill([
        this.m11,
        this.m12,
        this.m21,
        this.m22,
        this.m41,
        this.m42,
      ]);
      return m.scaleSelf(sx, sy);
    }

    toFloat64Array(): Float64Array {
      return new Float64Array([
        this.m11,
        this.m12,
        this.m13,
        this.m14,
        this.m21,
        this.m22,
        this.m23,
        this.m24,
        this.m31,
        this.m32,
        this.m33,
        this.m34,
        this.m41,
        this.m42,
        this.m43,
        this.m44,
      ]);
    }

    static fromFloat64Array(arr: Float64Array): DOMMatrixPolyfill {
      return new DOMMatrixPolyfill(Array.from(arr));
    }

    static fromFloat32Array(arr: Float32Array): DOMMatrixPolyfill {
      return new DOMMatrixPolyfill(Array.from(arr));
    }

    static fromMatrix(other: DOMMatrixPolyfill): DOMMatrixPolyfill {
      return new DOMMatrixPolyfill([
        other.m11,
        other.m12,
        other.m13,
        other.m14,
        other.m21,
        other.m22,
        other.m23,
        other.m24,
        other.m31,
        other.m32,
        other.m33,
        other.m34,
        other.m41,
        other.m42,
        other.m43,
        other.m44,
      ]);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).DOMMatrix = DOMMatrixPolyfill;
}
