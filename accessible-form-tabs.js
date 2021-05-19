
class tab {

    constructor() {
        this.element = document.createElement("DIV");
        this.element.tab = this;
        document.body.appendChild(this.element);
    }

    hide() {
        this.element.hidden = true;
    }

    show() {
        this.hideAllTabs();
        this.element.hidden = false;
    }

    hideAllTabs() {
        for (let i in tabs) {
            tabs[i].hide();
        }
    }

}

class tabAlert extends tab {

    show(filter) {
        this.returnId = filter.id;
        var buffer = '<h2>Ooops!</h2>';
        switch (filter.check()) {
            case "required":
                buffer += '<p>O campo "' + filter.control.label + '" é de preenchimento obrigatório</p>';
                buffer += '<p>Preencha-o antes de continuar</p>';
                break;

            case "continue":
                buffer += '<p>O campo "' + filter.control.label + '" não está completamente preenchido.</p>';
                buffer += '<p>Complete-o antes de continuar</p>';
                break;

            case "cpf_invalid":
                buffer += '<p>O CPF informado não pôde ser validado.</p>';
                buffer += '<p>Verifique se o digitou corretamente.</p>';
                break;

            case "cep_not_found":
                buffer += '<p>O CEP informado não corresponde a um endereço válido.</p>';
                buffer += '<p>Verifique se o digitou corretamente.</p>';
                break;

            case "service_terms_agree":
                buffer += '<p>Para continuar, você precisa concordar com os termos que regem este serviço.</p>';
                buffer += '<button onclick="tabs.serviceTerms.show()">Consultar os termos de serviço</button>';
                break;

            case "privacy_policy_agree":
                buffer += '<p>Para continuar, você precisa concordar com a política de privacidade que aplicamos a seus dados pessoais.</p>';
                buffer += '<button onclick="tabs.privacyPolicy.show()">Consultar a política de privacidade</button>';
                break;

        }
        buffer += '<button onclick="tabs.alert.goBack()">Corrigir</button>';
        this.element.innerHTML = buffer;
        this.element.className = "alert-modal";
        this.element.hidden = false;
    }


    goBack() {
        this.element.hidden = true;
        document.getElementById(this.returnId).focus();
    }
}

class tabReview extends tab {

    show() {
        for (let i = 0; i < formularyControls.length; i++) {
            let control = formularyControls[i];
            switch (control.check()) {
                case "required":
                case "continue":
                case "cpf_invalid":
                case "cep_not_found":
                case "service_terms_agree":
                case "privacy_policy_agree":
                    tabs.alert.show(control);
                    return;
            }
        }
        this.hideAllTabs();
        this.element.hidden = false;
        var buffer = '<h2>Confira seus dados</h2>';
        buffer += '<table>';
        for (let i = 0; i < formularyControls.length; i++) {
            let filter = formularyControls[i];
            let value = filter.value;
            if (value == "" || value == false || value == "Sim")
                continue;

            buffer += '<tr><td>' + filter.control.label + '</td><td>' + filter.value + '</td></tr>';
        }
        buffer += '</table>';
        buffer += '<button onclick="tabs.form.show()">Retroceder</button><button onclick="tabs.done.show()">Concluir</button>';
        this.element.innerHTML = buffer;
    }

}

class tabForm extends tab {

}

class tabServiceTerms extends tab {

    constructor() {
        super();
        this.hasLoaded = false;
    }

    show() {
        this.hideAllTabs();
        this.element.hidden = false;
        var buffer = '<h2>Termos de serviço</h2>';
        buffer += '<button onclick="tabs.serviceTerms.goBack();">Voltar</button>';
        this.element.innerHTML = buffer;
    }


    goBack() {
        tabs.form.show();
        setTimeout(function () {
            var button = document.getElementById("service_terms");
            button.scrollIntoView();
            button.focus();
        }, 10);
    }

}

class tabPrivacyPolicy extends tab {

    show() {
        this.hideAllTabs();
        this.element.hidden = false;
        var buffer = '<h2>Política de privacidade</h2>';
        buffer += '<button onclick="tabs.privacyPolicy.goBack()">Voltar</button>';
        this.element.innerHTML = buffer;
    }

    goBack() {
        tabs.form.show();
        setTimeout(function () {
            var button = document.getElementById("privacy_policy");
            button.scrollIntoView();
            button.focus();
        }, 10);
    }

}

class tabDone extends tab {

    show() {
        this.hideAllTabs();
        this.element.hidden = false;
        var name = document.getElementById("name").value;
        var buffer = '<h2>Pronto!</h2>';
        buffer += '<p>Olá ' + name + '</p>';
        buffer += '<p>Obrigado por cadastrar-se</p><p>Em breve entraremos em contato!</p><p>Equipe de atração</p>';
        this.element.innerHTML = buffer;
    }

}
