export class DOMNode {
    constructor({name, innerText}) {
        this.name = name;
        this.innerText = innerText || "";
        this.elem = null;
        this.textNode = document.createElement('textnode');
        this.parentNode = null;
    }

    from(elem) {
        if(!(elem instanceof Element)) {
            elem = document.createElement(elem);
        }
        this.elem = elem;
    }
}