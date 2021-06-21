import { Vec2 } from "./vec2";

export class Vec2Accessor {
    constructor(
        private set_x: (v: number) => void,
        private set_y: (v: number) => void
    ) {}

    set x(value: number) {
        this.set_x(value);
    }

    set y(value: number) {
        this.set_y(value);
    }

    set(value: Vec2) {
        this.set_x(value.x);
        this.set_y(value.y);
    }
}

export default class Element {
    private elem: HTMLElement;
    public position: Vec2Accessor;
    public size: Vec2Accessor;

    constructor(tag: string) {
        this.elem = document.createElement(tag);
        this.elem.style.position = "absolute";
        this.position = new Vec2Accessor(
            (value) => (this.elem.style.left = `${value}px`),
            (value) => (this.elem.style.top = `${value}px`)
        );
        this.size = new Vec2Accessor(
            (value) => (this.elem.style.width = `${value}px`),
            (value) => (this.elem.style.height = `${value}px`)
        );
    }

    set background(value: string) {
        this.elem.style.background = value;
    }

    set visible(value: boolean) {
        this.elem.style.display = value ? "block" : "none";
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    append_to(root: Node) {
        root.appendChild(this.elem);
    }
}
