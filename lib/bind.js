export class Bind {
    constructor({attribute, element, data}) {
        this.attribute = attribute;
        this.element = element;
        this.data = data;
        this.parent = null;
    }

    update(newAttrib) {
        if(this.attribute = 'innerText') {
            this.element.innerText = newAttrib;
        }
    }
}