import React, { createRef } from 'react';

class GraphComponent extends React.Component {

    constructor(_props) {
        super(_props);
        this.canvas = createRef();
    }

    componentDidMount() {
        window.addEventListener('resize', this.test);
        this.createGraph(this.canvas.current);
    }

    componentWillUnmount() {
        window.removeEventListener('resize',this.test);
    }


    test = () => {
        this.createGraph(this.canvas.current);
    }

    createGraph = (element) => {

        if (element) {
            console.log(element.offsetHeight, element.offsetWidth);
            var ctx = element.getContext("2d");
            let scale = 2;
            element.height = element.offsetHeight * scale;
            element.width = element.offsetWidth * scale;
            ctx.beginPath();
            ctx.moveTo(20 * scale, 20 * scale);
            ctx.lineTo(20 * scale, 250 * scale);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(10 * scale, 250 * scale);
            ctx.lineTo(element.width * scale, 250 * scale);
            ctx.stroke();
            ctx.closePath();
        }
    }


    render() {
        return (<canvas ref={this.canvas} style={{ height: '400px', width: '100%' }}></canvas>);
    }
}

export default GraphComponent;