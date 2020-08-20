import { Component } from "../lib/component.js";

export const Test = new Component({
    data: {
        test: "this is a",
        test2: "child component"
    },
    methods: {
        funcTest() {
            return "with its own method"
        }
    },
    template: 
        `
            <p>{{test}}
                <b> {{test2}}</b> 
                that parses correctly, {{funcTest}}
            </p>
        `
})