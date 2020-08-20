export class Component {
    constructor({data, methods, template, components}) {
        this.data = data;
        this.methods = methods;
        this.template = template;
        this.children = [];
        this.components = components;
    }

    render() {
        const root = document.createElement('component');
        let { template, data, methods } = this;
        const variables = template.match(/[^{\{]+(?=}\})/g);

        let components = template.match(/[[][A-Z][a-z]*[\]]/gm); 
        
        console.log(components);

        components = components.map(component => {
            console.log(component)
            return component.replace(/[[|\]]/gm, '').trim();
        });

        variables.forEach(str => {
            if(methods[str]) {
                template = template.replace(str, methods[str]());
            }
            else if(data[str]) {
                template = template.replace(str, data[str]);
            }
        })

        template = template.replace( /[{}]/g, '');

        
        console.log(template)
        
        if(components) {
            components.forEach(component => {
                console.log(this.components[component].render());
                root.appendChild(this.components[component].render());
            })
        }
        
        root.innerHTML = template;
        
        return root;
    }
}