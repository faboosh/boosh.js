import { Bind } from './bind.js';

export class Component {
    constructor({data, methods, template, components}) {
        this.data = data;
        this.methods = methods;
        this.template = template;
        this.components = components;

        //Bind methods to class instance
        for(const method in methods) {
            methods[method] = methods[method].bind(this);
        }
    }

    render() {
        const _mount = document.createElement('component'); 

        this.template.forEach(component => {
            this.mount(component, _mount);
        })

        return _mount;
    }

    mount(component, mount) {
        let elem;
        let innerText = component[1];
        const name = component[0];

        //Render child component if name is present in component list
        if(this.components && this.components[name]) {
            elem = this.components[name].render();
        
        //Else treat name as element
        } else {
            elem = document.createElement(name);
            if(this.methods[innerText]) {
                innerText = this.methods[innerText]();
            }
            else if(this.data[innerText]) {

                innerText = this.data[innerText];
            }

            if(innerText)  {
                elem.innerText = innerText;
            }
        }

        //Extract child elements and attributes from component
        const children = component[component.findIndex(val => Array.isArray(val))];
        const attributes = component[component.findIndex(val => !Array.isArray(val) && typeof(val) == 'object')];

        //Add child components to parent element
        if(children && children.length && children.length > 0) children.forEach(child => { this.mount(child, elem) });

        //Set attributes
        for(const attribute in attributes) {
            if(this.methods[attributes[attribute]]) {
                const methodCall = function(e) {
                    const event = new CustomEvent('methodCall', { detail: { name: attributes[attribute], rootEvent: e }});
                    elem.dispatchEvent(event);
                }

                elem[attribute] = function(e) { methodCall(e) };
                
            } else {
                console.log(attribute, attributes[attribute])
                elem.setAttribute(attribute, attributes[attribute])
            }
        }

        mount.appendChild(elem);

        elem.addEventListener('methodCall', (e) => {
            const { name, rootEvent } = e.detail;
            this.methods[name](rootEvent);
        })
    }

    setState(newState) {
        return this.data
    }
}