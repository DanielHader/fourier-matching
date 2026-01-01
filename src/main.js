let canvas, context;

const bounds = {
    x_min: -5,
    x_max: 5,
    y_min: -1.2,
    y_max: 1.2,
};

const amplitudes = [0.0, 1.0];
const phases = [0.0, 0.0];
const period = 1;

function fourier(x) {
    let y = 0;
    const scale = 2 * Math.PI / period;
    for (let i = 0; i < amplitudes.length; i++) {
	y += amplitudes[i] * Math.cos(scale * i * x - phases[i]);
    }
    return y;
}

function plot() {
    context.beginPath();
    for (let px = 0; px < canvas.width; px++) {
	const x = px / canvas.width * (bounds.x_max - bounds.x_min) + bounds.x_min;
	const y = fourier(x);
	const py = (y - bounds.y_min) / (bounds.y_max - bounds.y_min) * canvas.height;
	if (px == 0) {
	    context.moveTo(px, py);
	} else {
	    context.lineTo(px, py);
	}
    }
    context.stroke();
}

function resize_canvas() {
    const dpr = window.devicePixelRatio || 1;
    console.log(dpr);
    const buffer_width = canvas.clientWidth * dpr;
    const buffer_height = canvas.clientHeight * dpr;

    canvas.width = buffer_width;
    canvas.height = buffer_height;
}

function init() {
    canvas = document.getElementById("fourier-canvas");
    context = canvas.getContext("2d");

    resize_canvas();

    plot();
}

init();
