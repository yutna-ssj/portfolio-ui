import React, { createRef } from 'react';

class GraphComponent extends React.Component {

    constructor(_props) {
        super(_props);
        this.ref = createRef();
    }

    componentDidMount() {
        const resizeObserver = new ResizeObserver(entries => {
            this.createGraph(entries[0].target);
        });

        resizeObserver.observe(this.ref.current);
    }

    createGraph = (element) => {
        if (element) {
            const canvas = element;
            var ctx = canvas.getContext("2d");
            let scale = 2;

            const row = this.getRow(canvas.offsetWidth);

            const height = ((canvas.offsetWidth * scale) / (1.5 * 10));

            canvas.width = canvas.offsetWidth * scale;
            canvas.height = canvas.offsetHeight * scale;


            for (let i = 0; i < row; i++) {
                ctx.beginPath();
                ctx.moveTo(20, (height * i) + 20)
                ctx.lineTo(((canvas.offsetWidth * scale) - 20), (height * i) + 20);
                ctx.stroke();
                ctx.closePath();
            }

            ctx.beginPath();
            ctx.moveTo(20, 20);
            ctx.lineTo(20, (height * row) - height + 20);
            ctx.stroke();
            ctx.closePath();

            const width = (((canvas.offsetWidth * scale - 40) / 497));

            for (let i = 0; i < 497; i++) {
                ctx.beginPath();
                ctx.moveTo(20 + (i * width), (height * row) - (height + 20));
                ctx.lineTo(20 + (i * width), (height * row) - (height + 20));
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath();
                ctx.arc(20 + (i * width), (height * row) - (height - 20), 0.25, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();


            }



        }
    }

    getRow = (width) => {
        if (width > 500) {
            return 10;
        } else if (width > 350 && width <= 500) {
            return 6;
        } else {
            return 5;
        }
    }


    render() {
        return (<canvas ref={this.ref} style={{ height: '500px', width: '100%', backgroundColor: 'white' }}></canvas>);
    }
}

export default GraphComponent;