export class Vec2 {
    constructor(public x: number, public y: number) {}

    clone(): Vec2 {
        return vec2(this.x, this.y);
    }

    add(v: Vec2): void {
        this.x += v.x;
        this.y += v.y;
    }

    subtract(v: Vec2): void {
        this.x -= v.x;
        this.y -= v.y;
    }

    plus(v: Vec2): Vec2 {
        return vec2(this.x + v.x, this.y + v.y);
    }

    minus(v: Vec2): Vec2 {
        return vec2(this.x - v.x, this.y - v.y);
    }
}

export default function vec2(x: number, y: number) {
    return new Vec2(x, y);
}
