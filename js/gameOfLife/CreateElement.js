export default class CreateElement {

    button(className, text, boolean, callback) {
        const button = document.createElement('button');
        button.type = 'button';
        button.innerText = text;
        button.className = className;
        button.disabled = boolean;
        button.addEventListener("click", callback);
        return button
    }

    input(className, value, id, callback) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = value;
        input.className = className;
        input.id = id;
        input.addEventListener("input", callback);
        return input
    }

    label(className, text, id) {
        const label = document.createElement('label');
        label.innerText = text;
        label.className = className;
        label.setAttribute("for", id);
        return label
    }

    
}
