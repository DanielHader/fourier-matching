let canvas, context;

const bounds = {
    x_min: -1.4,
    x_max:  1.4,
    y_min: -2.2,
    y_max:  2.2,
};

const amplitude_sliders = [];
const amplitude_inputs = [];
const phase_sliders = [];
const phase_inputs = [];

const amplitudes = [0];
const phases = [0];
const period = 1;

function fourier(x) {
    let y = 0;
    const scale = 2 * Math.PI / period;
    for (let i = 0; i < amplitudes.length; i++) {
	y += amplitudes[i] * Math.cos(scale * (i * x - phases[i]));
    }
    return y;
}

function affine(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) / (in_max - in_min) * (out_max - out_min) + out_min;
}

function plot() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    let y_lower = bounds.y_min;
    let y_upper = bounds.y_max;
    const xs = [];
    const ys = [];
    for (let px = 0; px < canvas.width; px++) {
	const x = affine(px, 0, canvas.width, bounds.x_min, bounds.x_max);
	const y = fourier(x);
	ys.push(y);

	if (y - 0.2 < y_lower) y_lower = y - 0.2;
	if (y + 0.2 > y_upper) y_upper = y + 0.2;
    }
    
    context.strokeStyle = "#000000";
    context.lineWidth = 2;
    context.beginPath();
    for (let px = 0; px <= canvas.width; px++) {
	const py = affine(ys[px], y_lower, y_upper, canvas.height, 0);
	if (px == 0) {
	    context.moveTo(px, py);
	} else {
	    context.lineTo(px, py);
	}
    }
    context.stroke();

    context.lineWidth = 1;
    for (let x = Math.ceil(bounds.x_min); x <= Math.floor(bounds.x_max); x++) {
	if (x == 0) context.strokeStyle = "#aa0000";
	else context.strokeStyle = "#888888";
	
	context.beginPath();
	
	const px = affine(x, bounds.x_min, bounds.x_max, 0, canvas.width);
	context.moveTo(px, 0);
	context.lineTo(px, canvas.height);

	context.stroke();
    }
    for (let y = Math.ceil(y_lower); y <= Math.floor(y_upper); y++) {
	if (y == 0) context.strokeStyle = "#00aa00";
	else context.strokeStyle = "#888888";
	    
	context.beginPath();
	
	const py = affine(y, y_lower, y_upper, canvas.height, 0);
	context.moveTo(0, py);
	context.lineTo(canvas.width, py);

	context.stroke();
    }
}

function resize_canvas() {
    const dpr = window.devicePixelRatio || 1;
    console.log(dpr);
    const buffer_width = canvas.clientWidth * dpr;
    const buffer_height = canvas.clientHeight * dpr;

    canvas.width = buffer_width;
    canvas.height = buffer_height;
}

function amplitude_slider_event(event, index) {
    const value = Number(event.target.value);
    amplitudes[index] = value;

    if (isNaN(value)) {
	amplitude_inputs[index].style.background = "#ffaaaa";
    } else {
	amplitude_inputs[index].style.background = "#ffffff";
	if (event.target === amplitude_inputs[index]) {
	    amplitude_sliders[index].value = value;
	} else {
	    amplitude_inputs[index].value = value;
	}
    }

    plot();
}

function phase_slider_event(event, index) {
    const value = Number(event.target.value);
    phases[index] = value;
    
    if (isNaN(value)) {
	phase_inputs[index].style.background = "#ffaaaa";
    } else {
	phase_inputs[index].style.background = "#ffffff";
	if (event.target === phase_inputs[index]) {
	    phase_sliders[index].value = value;
	} else {
	    phase_inputs[index].value = value;
	}
    }
    
    plot();
}



function init(degree) {
    canvas = document.getElementById("fourier-canvas");
    context = canvas.getContext("2d");

    const control_div = document.getElementById("controls");
    for (let i = 1; i <= degree; i++) {
	const a_label = Object.assign(document.createElement("span"), {
	    className: "label-span",
	    textContent: `Amplitude ${i}`,
	});

	const p_label = Object.assign(document.createElement("span"), {
	    className: "label-span",
	    textContent: `Phase ${i}`,
	});

	const amplitude = Math.round(20.0 * (Math.random() * 2.0 - 1.0)) / 20.0;
	const phase = Math.round(20.0 * Math.random()) / 20.0;
	
	amplitudes.push(amplitude);
	const a_slider = Object.assign(document.createElement("input"), {
	    className: "slider",
	    type: "range",
	    id: `amplitude-slider-${i}$`,
	    min: -1.0,
	    max: 1.0,
	    step: 0.05,
	    value: amplitude,
	});
	a_slider.addEventListener("input", (event) => amplitude_slider_event(event, i));
	amplitude_sliders[i] = a_slider;
	
	phases.push(phase);
	const p_slider = Object.assign(document.createElement("input"), {
	    className: "slider",
	    type: "range",
	    id: `phase-slider-${i}$`,
	    min: 0.0,
	    max: 1.0,
	    step: 0.05,
	    value: phase,
	});
	p_slider.addEventListener("input", (event) => phase_slider_event(event, i));
	phase_sliders[i] = p_slider;
	
	const a_input = Object.assign(document.createElement("input"), {
	    id: `amplitude-input-${i}$`,
	    value: amplitude,
	});
	a_input.addEventListener("input", (event) => amplitude_slider_event(event, i));
	amplitude_inputs[i] = a_input;

	const p_input = Object.assign(document.createElement("input"), {
	    id: `phase-input-${i}$`,
	    value: phase,
	});
	p_input.addEventListener("input", (event) => phase_slider_event(event, i));
	phase_inputs[i] = p_input;

	controls.appendChild(a_label);
	controls.appendChild(a_slider);
	controls.appendChild(a_input);
	controls.appendChild(p_label);
	controls.appendChild(p_slider);
	controls.appendChild(p_input);
    }
    
    resize_canvas();

    plot();
}

window.addEventListener("load", () => init(5));
