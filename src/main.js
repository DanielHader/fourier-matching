let canvas, context;

const bounds = {
    x_min: -2,
    x_max: 2,
    y_min: -1.2,
    y_max: 1.2,
};

const sliders = [];
const inputs = [];

const amplitudes = [0];
const phases = [0];
const period = 1;

function fourier(x) {
    let y = 0;
    const scale = 2 * Math.PI / period;
    for (let i = 0; i < amplitudes.length; i++) {
	y += amplitudes[i] * Math.cos(scale * i * x - phases[i]);
    }
    return y;
}

function affine(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) / (in_max - in_min) * (out_max - out_min) + out_min;
}

function plot() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    /*
    context.lineWidth = 1;
    context.beginPath();
    for (let x = Math.ceil(bounds.x_min); x <= Math.floor(bounds.x_max); x++) {
	
	//context.moveTo(
    }
    context.stroke();
    */
    
    context.lineWidth = 2;
    context.beginPath();
    for (let px = 0; px <= canvas.width; px++) {
	const x = affine(px, 0, canvas.width, bounds.x_min, bounds.x_max);
	//const x = px / canvas.width * (bounds.x_max - bounds.x_min) + bounds.x_min;
	const y = fourier(x);
	const py = affine(y, bounds.y_min, bounds.y_max, 0, canvas.height);
	//const py = (y - bounds.y_min) / (bounds.y_max - bounds.y_min) * canvas.height;
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

function slider_event(event, index) {
    const value = Number(event.target.value);
    amplitudes[index] = value;
    inputs[index].value = value;
    plot();
}

function init(degree) {
    canvas = document.getElementById("fourier-canvas");
    context = canvas.getContext("2d");

    const slider_table = document.getElementById("slider-table");
    for (let i = 1; i <= degree; i++) {
	const tr = document.createElement("tr");

	const label_td = Object.assign(document.createElement("td"), {
	    className: "label-td",
	    textContent: `Coefficient ${i}`,
	});

	const slider_td = Object.assign(document.createElement("td"), {
	    className: "slider-td",
	});
	const slider = Object.assign(document.createElement("input"), {
	    className: "slider",
	    type: "range",
	    id: `slider-${i}$`,
	    value: 0.0,
	    min: -2.0,
	    max: 2.0,
	    step: 0.1,
	});
	slider_td.appendChild(slider);
	slider.addEventListener("input", (event) => slider_event(event, i));
	sliders[i] = slider;
	
	const input_td = Object.assign(document.createElement("td"), {
	    className: "input-td",
	});
	const input = Object.assign(document.createElement("input"), {
	    id: `input-${i}$`,
	    value: 0.0,
	});
	input_td.appendChild(input);
	inputs[i] = input;

	tr.appendChild(label_td);
	tr.appendChild(slider_td);
	tr.appendChild(input_td);
	
	slider_table.appendChild(tr);

	amplitudes.push(0);
	phases.push(0);
    }
    
    resize_canvas();

    plot();
}

window.addEventListener("load", () => init(5));
