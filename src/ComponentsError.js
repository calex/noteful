import React from 'react';

export default class ComponentsError extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    
    render() {
        if (this.state.hasError) {      
        return (
                <h5>{this.props.message}.</h5>
            );
        }
        return this.props.children;
    }
}