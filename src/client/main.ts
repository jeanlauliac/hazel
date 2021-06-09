(async () => {
    const box = document.createElement("div");
    box.innerText = "hello, world";
    box.style.border = "dashed 1px #333";
    box.style.position = "absolute";
    box.style.left = "100px";
    box.style.top = "100px";
    box.style.cursor = "grab";

    // box.style.pointerEvents = "none";
    box.style.userSelect = "none";

    document.body.style.position = "relative";
    document.body.appendChild(box);

    let moving = false;
    let prev = [0, 0];
    let pos = [100, 100];

    document.addEventListener("mousedown", (ev) => {
        if (ev.target !== box) return;

        moving = true;
        prev = [ev.clientX, ev.clientY];
    });
    document.addEventListener("mouseup", (ev) => {
        moving = false;
    });

    document.addEventListener("mousemove", (ev) => {
        if (!moving) return;
        const np = [ev.clientX, ev.clientY];
        pos[0] += np[0] - prev[0];
        pos[1] += np[1] - prev[1];

        prev = np;

        box.style.left = `${pos[0]}px`;
        box.style.top = `${pos[1]}px`;
    });
})();
