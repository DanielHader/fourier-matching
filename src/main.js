
const slider_params = {
    width: 300,
    height: 8,
    color: "rgb(220, 220, 220)",
    
    knob_width: 6,
    knob_height: 16,
    knob_color: "rgb(180, 210, 255)",
};

class Slider {
    constructor(x, y, value=4, min_value=0, max_value=10, tick_interval=1) {
	this.x = x;
	this.y = y;
	
	this.value = value;
	this.min_value = min_value;
	this.max_value = max_value;
	this.tick_interval = tick_interval;
    }

    draw(ctx, params) {
	const ratio = this.value / (this.max_value - this.min_value);
	ctx.strokeStyle = "black";

	ctx.fillStyle = params.color;
	ctx.fillRect(this.x, this.y - params.height / 2, params.width, params.height);
	ctx.strokeRect(this.x, this.y - params.height / 2, params.width, params.height);
	
	
	ctx.fillStyle = params.knob_color;
	ctx.fillRect(this.x + params.width * ratio - params.knob_width / 2,
		       this.y - params.knob_height / 2,
		       params.knob_width,
		       params.knob_height);
	ctx.strokeRect(this.x + params.width * ratio - params.knob_width / 2,
		       this.y - params.knob_height / 2,
		       params.knob_width,
		       params.knob_height);
	
    }
}

function init(degree) {
    const canvas = document.getElementById("fourier-canvas");
    const context = canvas.getContext("2d");
    
    const slider = new Slider(10, 20);
    slider.draw(context, slider_params);
}

init(1);
