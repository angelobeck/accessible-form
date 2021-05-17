
class filter {

    constructor(control) {
        this.control = control;
        this.id = control.id;
    }

    create(parentElement) {
        this.label = document.createElement("LABEL");
        this.label.setAttribute("for", this.id);
        this.label.appendChild(document.createTextNode(this.control.label));

        this.tip = document.createElement("SPAN");
        this.tip.setAttribute("aria-live", "polite");

        this.label.appendChild(this.tip);

        this.input = document.createElement("INPUT");
        this.input.id = this.id;

        this.container = document.createElement("DIV");
        this.container.className = "form-container";
        this.container.appendChild(this.label);
        this.container.appendChild(this.input);

        parentElement.appendChild(this.container);
    }

    check() {
        if (!this.control.required)
            return "ok";

        var value = this.input.value;

        if (value == "")
            return "required";
    }

    get value() {
        return this.input.value;
    }

}

class filterCheckbox extends filter {

    constructor(control) {
        super(control);
    }

    create(parentElement) {
        this.label = document.createElement("LABEL");
        this.label.setAttribute("for", this.id);
        this.label.appendChild(document.createTextNode(this.control.label));

        this.input = document.createElement("INPUT");
        this.input.setAttribute("type", "checkbox");
        this.input.id = this.id;

        this.container = document.createElement("DIV");
        this.container.className = "form-container-checkbox";
        this.container.appendChild(this.input);
        this.container.appendChild(this.label);

        parentElement.appendChild(this.container);
    }

    check() {
        if (this.input.checked || !this.control.required)
            return "ok";

        if (this.control.error_msg)
            return this.control.error_msg;

        return "required";
    }

    get value() {
        if (this.input.checked)
            return "Sim";

        return "Não";
    }

}

class filterSelect extends filter {

    constructor(control) {
        super(control);
    }

    create(parentElement) {
        this.label = document.createElement("LABEL");
        this.label.setAttribute("for", this.id);
        this.label.appendChild(document.createTextNode(this.control.label));

        this.input = document.createElement("SELECT");
        this.input.id = this.id;

        if (this.control.children) {
            for (let i = 0; i < this.control.children.length; i++) {
                let child = this.control.children[i];
                let option = document.createElement("OPTION");
                option.value = child.value;
                option.text = child.label;
                this.input.appendChild(option);
            }
        }
        this.container = document.createElement("DIV");
        this.container.className = "form-container";
        this.container.appendChild(this.label);
        this.container.appendChild(this.input);

        parentElement.appendChild(this.container);
    }

}

class filterNumeric extends filter {

    constructor(control) {
        super(control);
    }

    create(parentElement) {
        super.create(parentElement);
        this.input.setAttribute("type", "tel");
        if (!this.control.template)
            return;
        this.input.filter = this;
        this.input.value = this.control.template;
        this.input.onkeyup = function () { this.filter.eventKeyUp(); };
        this.input.onkeydown = function (event) { this.filter.eventKeyDown(event); };
        this.input.onfocus = function (event) { this.filter.eventFocus(event); };
    }

    eventFocus(){
        if(this.input.value == this.control.template){
            this.input.selectionStart = 0;
            this.input.selectionEnd = 0;
        }
    }
    
    eventKeyDown(event) {
        if (event.shiftKey || event.altKey || event.metaKey || event.ctrlKey)
            return;

        var selectionStart = 0;
        switch (event.key) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "Delete":
                while (this.input.selectionStart < this.control.template.length && this.control.template.charAt(this.input.selectionStart) != "_") {
                    this.input.selectionStart++;
                    this.input.selectionEnd = this.input.selectionStart;
                }
        }
    }

    eventKeyUp() {
        var buffer = "";
        var bufferIndex = 0;
        var value = this.input.value;
        for (let i = 0; i < value.length; i++) {
            switch (value.charAt(i)) {
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    buffer += value.charAt(i);
            }
        }
        value = "";
        for (let i = 0; i < this.control.template.length; i++) {
            if (this.control.template.charAt(i) != "_") {
                value += this.control.template.charAt(i);
                continue;
            }
            if (bufferIndex < buffer.length) {
                value += buffer.charAt(bufferIndex);
                bufferIndex++;
            } else {
                value += "_";
            }
        }
        var selectionStart = this.input.selectionStart;
        var selectionEnd = this.input.selectionEnd;
        this.input.value = value;
        this.input.selectionStart = selectionStart;
        this.input.selectionEnd = selectionEnd;
        this.updateTip();
    }

    updateTip() {
        this.tip.innerHTML = this.validate();
    }

    validate() {
        if (!this.input.value.match(/[0-9]/)) {
            if (this.control.required)
                return "required";

            return "ok";
        }
        if (this.input.value.includes("_"))
            return "continue";
        if (this.control.validator) {
            switch (this.control.validator) {
                case "cep":
                    return this.validateCep();
                case "cpf":
                    return this.validateCpf();
            }
        }
        return "ok";
    }

    validateCpf() {
        var value = this.input.value;
        if (value == "")
            return "required";
        if (value.match(/^[0-9]{9}[-]?[0-9]{2}$/))
            return "ok";

        return "continue";
    }

    validateCep() {
        var value = this.input.value;
        if (value == "")
            return "required";
        if (value.match(/^[0-9]{5}[-]?[0-9]{2}$/))
            return "ok";

        return "continue";
    }

}

class filterButton extends filter {

    constructor(control) {
        super(control);
    }

    create(parentElement) {
        this.input = document.createElement("BUTTON");
        this.input.appendChild(document.createTextNode(this.control.label));

        this.container = document.createElement("DIV");
        this.container.className = "form-container-button";
        this.container.appendChild(this.input);

        parentElement.appendChild(this.container);
    }

    check() {
        return "ok";
    }

    get value() {
        return false;
    }

}

class filterSeparator extends filterButton {

    constructor(control) {
        super(control);
    }

    create(parentElement) {
        this.input = document.createElement("HR");

        this.container = document.createElement("DIV");
        this.container.className = "form-container-button";
        this.container.appendChild(this.input);

        parentElement.appendChild(this.container);
    }

}
