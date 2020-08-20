export class Bind {
    constructor(attribute, element, data) {
        this.attribute = attribute;
        this.element = element;
        this.data = data;
    }

    update(newAttrib) {
        console.log(this.element[this.attribute])
        //this.element[this.attribute] = newAttrib;
        if(this.attribute = 'innerText') {
            this.element.innerText = newAttrib;
        }
    }
}