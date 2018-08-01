export default class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toPolar() {
    return {
      magnitude: Math.hypot(this.x, this.y),
      angle: Math.atan2(this.y, this.x)
    };
  }

  static fromPolar(mag, angle) {
    return new Vec(
      mag * Math.cos(angle),
      mag * Math.sin(angle)
    );
  }

  static plus(vec1, vec2) {
    return new Vec(
      vec1.x + vec2.x,
      vec1.y + vec2.y
    );
  }

  static minus(vec1, vec2) {
    return new Vec(
      vec1.x - vec2.x,
      vec1.y - vec2.y
    );
  }

  static times(vec, scalar) {
    return new Vec(
      vec.x * scalar,
      vec.y * scalar
    );
  }
}
