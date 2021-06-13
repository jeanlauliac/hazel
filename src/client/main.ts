import vec2, { Vec2 } from "./vec2";

type Box = { elem: HTMLDivElement; pos: Vec2; width: number };

(async () => {
    let boxes: Box[] = [];
    const guide_elem = document.createElement("div");
    guide_elem.style.width = "2px";
    guide_elem.style.height = "1000px";
    guide_elem.style.top = "0";
    guide_elem.style.background = "#ffd700";
    guide_elem.style.position = "absolute";
    guide_elem.style.display = "none";
    document.body.appendChild(guide_elem);

    const resz_elem = document.createElement("div");
    resz_elem.style.border = "solid 1px #333";
    resz_elem.style.width = "8px";
    resz_elem.style.height = "8px";
    resz_elem.style.top = "0";
    resz_elem.style.left = "0";
    resz_elem.style.position = "absolute";
    resz_elem.style.cursor = "col-resize";
    resz_elem.style.background = "white";
    resz_elem.style.zIndex = "10";
    resz_elem.style.display = "none";
    document.body.appendChild(resz_elem);

    let moving_box: Box | void = undefined;
    let sel_box: Box | void = undefined;

    const update_box = (box: Box) => {
        const { elem, pos } = box;
        elem.style.left = `${pos.x}px`;
        elem.style.top = `${pos.y}px`;
        elem.style.width = `${box.width}px`;

        if (sel_box === box) {
            resz_elem.style.display = "block";
            resz_elem.style.left = `${box.pos.x + box.width - 5}px`;
            resz_elem.style.top = `${
                box.pos.y + box.elem.clientHeight / 2 - 5
            }px`;
        }
    };

    const add_box = (text: string, pos: Vec2) => {
        const elem = document.createElement("div");
        elem.innerText = text;
        elem.style.position = "absolute";
        elem.style.cursor = "grab";

        elem.style.userSelect = "none";

        const width = 200;
        const box = { elem, pos, width };
        update_box(box);

        boxes.push(box);
        document.body.appendChild(elem);
    };

    add_box("hello, world", vec2(100, 100));
    add_box("this is text", vec2(150, 220));
    add_box("move me aroud", vec2(200, 300));

    document.body.style.position = "relative";

    // let prev_client_pos = vec2(0, 0);
    let client_origin = vec2(0, 0);
    let original_pos = vec2(0, 0);
    let original_width = 0;

    const find_box = (target: EventTarget | null) =>
        boxes.find((box) => box.elem === target);

    let is_resizing = false;

    document.addEventListener("mousedown", (ev) => {
        client_origin = vec2(ev.clientX, ev.clientY);

        if (ev.target === resz_elem) {
            document.body.style.cursor = "col-resize";
            original_width = sel_box?.width ?? 0;
            is_resizing = true;
            return;
        }

        const box = find_box(ev.target);
        if (box === undefined) {
            if (!sel_box) return;

            sel_box.elem.style.backgroundImage = "none";
            resz_elem.style.display = "none";
            sel_box = undefined;
            return;
        }

        moving_box = box;
        box.elem.style.cursor = "grabbing";
        original_pos = box.pos.clone();

        if (sel_box !== undefined && sel_box !== box) {
            sel_box.elem.style.backgroundImage = "none";
        }
        sel_box = box;

        update_box(box);
    });

    document.addEventListener("mouseup", (ev) => {
        if (is_resizing) {
            document.body.style.cursor = "auto";
            is_resizing = false;
            return;
        }
        if (!moving_box) return;

        moving_box.elem.style.cursor = "grab";
        moving_box = undefined;
        guide_elem.style.display = "none";
    });

    document.addEventListener("mousemove", (ev) => {
        const client_pos = vec2(ev.clientX, ev.clientY);

        if (is_resizing && sel_box !== undefined) {
            const new_width = client_pos.x - client_origin.x + original_width;
            sel_box.width = Math.max(new_width, 50);
            update_box(sel_box);
            return;
        }

        if (!moving_box) return;
        const fpos = client_pos.minus(client_origin).plus(original_pos);

        let guided = false;
        for (const box of boxes) {
            if (box === moving_box) continue;
            if (Math.abs(box.pos.x - fpos.x) < 20) {
                fpos.x = box.pos.x;
                guide_elem.style.left = `${box.pos.x}px`;
                guide_elem.style.display = "block";
                guided = true;
                break;
            }
        }
        if (!guided) {
            guide_elem.style.display = "none";
        }

        moving_box.pos = fpos;
        update_box(moving_box);
    });

    document.addEventListener("mouseover", (ev) => {
        if (moving_box) return;

        const box = find_box(ev.target);
        if (box === undefined) return;

        box.elem.style.backgroundImage = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='black' stroke-width='2' stroke-dasharray='3%2c 6' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`;
    });

    document.addEventListener("mouseout", (ev) => {
        if (moving_box) return;

        const box = find_box(ev.target);
        if (box === undefined) return;
        if (box === sel_box) return;

        box.elem.style.backgroundImage = "none";
    });
})();
