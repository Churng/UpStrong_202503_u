class CustomAlert {
	body = document.body;
	div = null;
	content = "";
	timer = null;

	constructor(props) {
		this.content = props.content;

		this.createDiv();
		this.createSetTimout();
		this.render();
	}

	createDiv() {
		const div = document.createElement("div");

		div.className = "alert alert-danger custom-alert";
		div.role = "alert";
		div.textContent = this.content;

		this.div = div;
	}

	removeDiv = () => {
		this.body.removeChild(this.div);
	};

	createSetTimout() {
		this.timer = setTimeout(this.removeDiv, 10000);
	}

	render() {
		this.body.appendChild(this.div);
	}
}
// window.CustomAlert = CustomAlert;
