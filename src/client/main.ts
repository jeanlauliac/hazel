type Vec2 = [number, number];
type Box = { elem: HTMLDivElement; pos: Vec2 };

(async () => {
    let boxes: Box[] = [];
    const h_guides: number[] = [];
    const guide_elem = document.createElement("div");
    guide_elem.style.width = "2px";
    guide_elem.style.height = "1000px";
    guide_elem.style.top = "0";
    guide_elem.style.background = "#ffd700";
    guide_elem.style.position = "absolute";
    guide_elem.style.display = "none";

    document.body.appendChild(guide_elem);

    const update_box = (box: Box) => {
        const { elem, pos } = box;
        elem.style.left = `${pos[0]}px`;
        elem.style.top = `${pos[1]}px`;
    };

    const add_box = (text: string, pos: Vec2) => {
        const elem = document.createElement("div");
        elem.innerText = text;
        elem.style.position = "absolute";
        elem.style.cursor = "grab";

        elem.style.userSelect = "none";

        const box = { elem, pos };
        update_box(box);

        boxes.push(box);
        document.body.appendChild(elem);
        h_guides.push(pos[0]);
    };

    add_box("hello, world", [100, 100]);
    add_box("this is text", [150, 220]);
    add_box("move me aroud", [200, 300]);

    document.body.style.position = "relative";

    let moving_box: Box | void = undefined;
    let prev = [0, 0];
    let pos = [0, 0];

    const find_box = (target: EventTarget | null) =>
        boxes.find((box) => box.elem === target);

    document.addEventListener("mousedown", (ev) => {
        const box = find_box(ev.target);
        if (box === undefined) return;

        moving_box = box;

        const gi = h_guides.indexOf(box.pos[0]);
        if (gi) h_guides.splice(gi, 1);

        prev = [ev.clientX, ev.clientY];
        pos = [box.pos[0], box.pos[1]];
    });

    document.addEventListener("mouseup", (ev) => {
        if (!moving_box) return;

        h_guides.push(moving_box.pos[0]);
        moving_box = undefined;
        guide_elem.style.display = "none";
    });

    document.addEventListener("mousemove", (ev) => {
        if (!moving_box) return;
        const np = [ev.clientX, ev.clientY];
        pos[0] += np[0] - prev[0];
        pos[1] += np[1] - prev[1];

        const fpos: Vec2 = [pos[0], pos[1]];

        let guided = false;
        for (const gx of h_guides) {
            if (Math.abs(gx - fpos[0]) < 20) {
                fpos[0] = gx;
                guide_elem.style.left = `${gx}px`;
                guide_elem.style.display = "block";
                guided = true;
                break;
            }
        }
        if (!guided) {
            guide_elem.style.display = "none";
        }

        moving_box.pos = fpos;
        prev = np;

        update_box(moving_box);
    });

    document.addEventListener("mouseover", (ev) => {
        if (moving_box) return;

        const box = find_box(ev.target);
        if (box === undefined) return;

        box.elem.style.border = "dashed 1px #333";
        box.elem.style.margin = "-1px 0 0 -1px";
    });

    document.addEventListener("mouseout", (ev) => {
        if (moving_box) return;

        const box = find_box(ev.target);
        if (box === undefined) return;

        box.elem.style.border = "none";
        box.elem.style.margin = "0";
    });
})();
