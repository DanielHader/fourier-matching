

function resize_canvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    console.log(dpr);
    const buffer_width = canvas.clientWidth * dpr;
    const buffer_height = canvas.clientHeight * dpr;

    canvas.width = buffer_width;
    canvas.height = buffer_height;
}

function init(degree) {
    const canvas = document.getElementById("fourier-canvas");
    const context = canvas.getContext("2d");
    resize_canvas(canvas);

    canvas.addEventListener("pointerdown", (e) => handle_pointerdown_event(e, canvas));
    canvas.addEventListener("pointerup",   (e) => handle_pointerup_event(e, canvas));
    canvas.addEventListener("pointermove", (e) => handle_pointermove_event(e, canvas));
}

init(1);
