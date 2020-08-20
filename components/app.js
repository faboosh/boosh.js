import { Component } from "../lib/component.js";
import { Test } from "./test.js";

export const App = new Component({
    components: {
        Test
    },
    data: {
        test: "wow, templating",
        test2: "bad boi templating"
    },
    methods: {
        funcTest() {
            return "this one even renders from a function"
        }
    },
    template: 
        `
            [Test]
            [Test]
            <p>{{test}}
                <b> {{test2}}</b>
                 that parses correctly, 
                 {{funcTest}}
            </p>
        `,
    templateRedux: [
        ['p', {}]
    ]
})


