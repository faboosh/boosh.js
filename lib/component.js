import { Bind } from './bind.js';

export class Component {
    constructor({data, methods, template, components}) {
        this.data = data;
        this.methods = methods;
        this.template = template;
        this.components = components;
        this.binds = [];

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
        let textNode = document.createElement('textNode');
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
                
                this.binds.push(
                    new Bind(
                        'innerText',
                        textNode,
                        innerText
                    )
                )
                innerText = this.data[innerText];
            }

            textNode.innerText = innerText;

            if(innerText)  {
                elem.appendChild(textNode);
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
        console.log(this);
        for(const val in this.data) {
            if(this.data[val] != newState[val]) {
                const bind = this.binds[this.binds.findIndex(bind => {return bind.data == val})];
                console.log(this.binds);
                bind.update(newState[val]);
            }
        }
    }
}