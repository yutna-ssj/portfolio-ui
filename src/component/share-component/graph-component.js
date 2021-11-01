import React, { createRef } from 'react';
import { Line } from 'react-chartjs-2';
class GraphComponent extends React.Component {

    // constructor(_props) {
    //     super(_props);

    //      this.ref = createRef();
    // }

    // componentDidMount() {
    //     const resizeObserver = new ResizeObserver(entries => {
    //         this.createGraph(entries[0].target);
    //     });

    //     resizeObserver.observe(this.ref.current);
    // }

    // getSnapshotBeforeUpdate(PrevProps, PrevState) {
    //     if (PrevProps.dataSet.length !== this.props.dataSet.length) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    // componentDidUpdate(snapshot) {
    //     if (snapshot) {
    //         this.createGraph(this.ref.current);
    //     }
    // }

    // createGraph = (element) => {
    //     const data = this.props.dataSet;
    //     console.log(this.props)
    //     if (element && data.length > 0) {
    //         console.log(data);
    //         const canvas = element;
    //         var ctx = canvas.getContext("2d");
    //         let scale = 2;

    //         const margin_x = 60;
    //         const margin_y = 10;
    //         const row = this.getRow(canvas.offsetWidth);
    //         const height = ((canvas.offsetWidth * scale) / (1.5 * row));

    //         canvas.width = canvas.offsetWidth * scale;
    //         canvas.height = canvas.offsetHeight * scale;

    //         const max = 5000;
    //         const value_text = max / (row);
    //         let count = max;
    //         for (let i = 0; i <= row; i++) {
    //             ctx.beginPath();
    //             ctx.moveTo(margin_x, (height * i) + margin_y)
    //             ctx.lineTo(((canvas.offsetWidth * scale) - margin_y), (height * i) + margin_y);
    //             ctx.stroke();
    //             ctx.closePath();

    //             ctx.font = "18px Verdana";
    //             if (count < value_text) {
    //                 count = 0;
    //             }

    //             if (count > 999) {

    //             }
    //             ctx.fillText(count, 0, (height * i) + margin_y + 5);
    //             count = Math.ceil(count - value_text);
    //         }

    //         ctx.beginPath();
    //         ctx.moveTo(margin_x, margin_y);
    //         ctx.lineTo(margin_x, (height * row) + margin_y);
    //         ctx.stroke();
    //         ctx.closePath();

    //         console.log(data);
    //         const width = (((canvas.offsetWidth * scale - (margin_y + margin_x)) / (data.length - 1)));
    //         for (let i = 0; i < data.length; i++) {
    //             try {
    //                 ctx.beginPath();
    //                 ctx.fillStyle = "tomato";
    //                 ctx.lineWidth  = 2;
    //                 ctx.strokeStyle = "tomato";
    //                 ctx.arc(margin_x + ((i * width)), height * row - (data[i].NewConfirmed / max * 100) / 100 * height * row + margin_y, 1, 0, 2 * Math.PI);
    //                 ctx.moveTo(margin_x + ((i * width)), height * row - (data[i].NewConfirmed / max * 100) / 100 * height * row + margin_y);
    //                 ctx.lineTo(margin_x + ((i * width)), height * row - (data[i + 1].NewConfirmed / max * 100) / 100 * height * row + margin_y);
    //                 ctx.fill();
    //                 ctx.stroke();
    //             } catch (e) {

    //             }
    //         }
    //     }
    // }

    // getRow = (width) => {
    //     if (width > 500) {
    //         return 10;
    //     } else if (width > 350 && width <= 500) {
    //         return 6;
    //     } else {
    //         return 5;
    //     }
    // }


    render() {
        const { height, data, labels, color } = this.props
        return (
            // <canvas ref={this.ref} style={{ height: '500px', width: '100%', backgroundColor: 'white' }}></canvas>
            <Line data={[]} height={height} />
        );
    }
}

export default GraphComponent;