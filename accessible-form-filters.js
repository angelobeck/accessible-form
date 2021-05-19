
class filter {

    constructor(control) {
        this.control = control;
        this.id = control.id;
    }

    create(parentElement) {
        this.tip = document.createElement("SPAN");
        this.tip.className = "tip";
        this.tip.hidden = true;
        this.tip.setAttribute("aria-live", "polite");

        this.label = document.createElement("LABEL");
        this.label.setAttribute("for", this.id);
        this.label.appendChild(document.createTextNode(this.control.label));
        this.label.appendChild(this.tip);

        this.input = document.createElement("INPUT");
        this.input.id = this.id;
        this.input.filter = this;

        this.container = document.createElement("DIV");
        this.container.className = "form-group";
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

        return "ok";
    }

    eventFocus() {
        this.hiddeAllTips();
        this.tip.hidden = false;
        this.updateTip();
    }

    updateTip() {
        var message = this.check();
        const messages = {
            ok: { className: "tip-ok", text: "Ok" },
            required: { className: "tip-error", text: "Campo obrigatório" },
            continue: { className: "tip-alert", text: "Continue a digitar" },
            cpf_invalid: { className: "tip-error", text: "CPF não validado" },
            cep_requesting: { className: "tip-alert", text: "Buscando endereço..." },
            cep_found: { className: "tip-ok", text: "Endereço encontrado" },
            cep_not_found: { className: "tip-error", text: "Endereço não encontrado" }
        }
        if (this.tip.innerHTML == messages[message].text)
            return;
        this.tip.innerHTML = messages[message].text;
        this.tip.className = messages[message].className;
    }

    hiddeAllTips() {
        for (let i = 0; i < formularyControls.length; i++) {
            let control = formularyControls[i];
            if (control.tip)
                control.tip.hidden = true;
        }
    }

    get value() {
        return this.input.value;
    }

}

class filterText extends filter {

    create(parentElement) {
        super.create(parentElement);
        this.input.onfocus = function () { this.filter.eventFocus(); };
        this.input.onkeyup = function () { this.filter.updateTip(); };
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
        this.container.className = "form-group-checkbox";
        this.container.appendChild(this.input);
        this.container.appendChild(this.label);

        parentElement.appendChild(this.container);
    }

    check() {
        if (this.input.checked || !this.control.required)
            return "ok";

        return this.id + '_agree';
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

    get value() {
        return this.input.options[this.input.selectedIndex].text;
    }

}

class filterNumeric extends filter {

    constructor(control) {
        super(control);
    }

    create(parentElement) {
        super.create(parentElement);
        this.input.setAttribute("type", "tel");
        this.input.onfocus = function () { this.filter.eventFocus(); };

        if (!this.control.template)
            return;
        this.input.value = this.control.template;
        this.input.onkeyup = function () { this.filter.eventKeyUp(); };
        this.input.onkeydown = function (event) { this.filter.eventKeyDown(event); };
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

    check() {
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
        var cpf = this.input.value.slice(0, 9) + this.input.value.slice(10, 12);
        var Soma = 0;
        var dv;
        if (cpf == "00000000000")
            return "cpf_invalid";

        for (let i = 1; i <= 9; i++) {
            Soma = Soma + parseInt(cpf.substr(i - 1, 1)) * (11 - i);
        }
        dv = (Soma * 10) % 11;

        if ((dv == 10) || (dv == 11))
            dv = 0;
        if (dv != parseInt(cpf.substring(9, 10)))
            return "cpf_invalid";

        Soma = 0;
        for (let i = 1; i <= 10; i++) {
            Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        dv = (Soma * 10) % 11;

        if ((dv == 10) || (dv == 11))
            dv = 0;
        if (dv != parseInt(cpf.substring(10, 11)))
            return "cpf_invalid";

        return "ok";
    }

    validateCep() {
        if (this.status == "cep_requesting")
            return "cep_requesting";

        var cep = this.input.value.slice(0, 5) + this.input.value.slice(6, 9);
        if (this.cep == cep)
            return this.status;
        this.cep = cep;
        this.status = "cep_requesting";

        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (this.readyState != 4 || this.status != 200)
                return;

            var filter = document.getElementById("cep").filter;
            var received = JSON.parse(this.responseText);

            const fields = {
                street: "logradouro",
                district: "bairro",
                city: "localidade",
                state: "uf"
            }

            for (let id in fields) {
                let field = fields[id];
                if (!received[field] || received[field] == "") {
                    filter.status = "cep_not_found";
                    filter.updateTip();
                    return;
                }
            }

            for (let id in fields) {
                let field = fields[id];
                let input = document.getElementById(id);
                if (id == "state") {
                    for (let index = 0; index < input.options.length; index++) {
                        if (input.options[index].value == received[field]) {
                            input.selectedIndex = index;
                            break;
                        }
                    }
                } else {
                    input.value = received[field];
                }
            }

            filter.status = "cep_found";
            filter.updateTip();
        }
        request.open("GET", "https://viacep.com.br/ws/" + cep + "/json/", true);
        request.send();

        setTimeout(function (filter) {
            if (filter.status != "cep_requesting")
                return;

            filter.status = "cep_not_found";
            filter.updateTip();
        }, 3000, this);

        return "cep_requesting";
    }

    get value() {
        if (this.control.template && this.input.value == this.control.template)
            return "";

        return this.input.value;
    }

}

class filterButton extends filter {

    constructor(control) {
        super(control);
    }

    create(parentElement) {
        this.input = document.createElement("BUTTON");
        this.input.appendChild(document.createTextNode(this.control.label));
        this.input.filter = this;
        this.input.onclick = function () { this.filter.eventClick(); };

        this.container = document.createElement("DIV");
        this.container.className = "form-group-button";
        this.container.appendChild(this.input);

        parentElement.appendChild(this.container);
    }

    check() {
        return "ok";
    }

    eventClick() {
        tabs[this.control.action].show();
        window.scrollTo(0, 0);
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
