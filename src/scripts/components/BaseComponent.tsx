import * as React from "react";

export class BaseComponent<P, S> extends React.Component<P, S> {
    // Helper to bind all methods to the 'this' of each component 
    _bind(...methods: string[]) {
        methods.forEach((method: string) => {
            this[method] = this[method].bind(this);
        });
    }

    _setState(partialState: any) {
        this.setState(Object.assign({}, this.state, partialState));
    }
}