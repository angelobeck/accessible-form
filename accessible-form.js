
var formularyData = [];
var formularyControls = [];

function eventLoad() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState != 4 || this.status != 200)
            return;

        createFormulary(JSON.parse(this.responseText));
    }
    request.open("GET", "./accessible-form-fields.json", true);
    request.send();
}

function createFormulary(controls) {
    element = document.createElement("DIV");
    document.body.appendChild(element);
    var fields = [];
    for (let i = 0; i < controls.children.length; i++) {
        let control = controls.children[i];
        let field = false;
        switch (control.filter) {
            case "free":
                field = new filter(control);
                break;
            case "select":
                field = new filterSelect(control);
                break;
            case "numeric":
                field = new filterNumeric(control);
                break;
            case "checkbox":
                field = new filterCheckbox(control);
                break;
            case "button":
                field = new filterButton(control);
                break;
            case "separator":
                field = new filterSeparator(control);
                break;
        }
        if (!field)
            continue;
        fields.push(field);
        field.create(element);
    }
}

window.addEventListener("load", eventLoad);
