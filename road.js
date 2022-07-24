class Road{
    constructor(x, width, laneCount=3){
        this.x=x;
        const shoulder=0.9;
        this.width=width*shoulder;
        this.laneCount=laneCount;

        this.left=x-this.width/2;
        this.right=x+this.width/2;

        const infinity=9999999;
        this.top=-infinity;
        this.bottom=infinity;

        const topLeft={x:this.left,y:this.top};
        const bottomLeft={x:this.left,y:this.bottom};
        const topRight={x:this.right,y:this.top};
        const bottomRight={x:this.right,y:this.bottom};
        this.borders=[
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ]
    }

    getLaneCenter(laneIndex) {
        const laneWidth=this.width/this.laneCount;
        return this.left + laneWidth/2 + laneWidth * laneIndex;
    }

    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="white";

        for (let i=1; i<this.laneCount; i++) {
            const x = linInterp(this.left, this.right, i/this.laneCount);
            ctx.beginPath();
            ctx.setLineDash([20]);
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x,border[1].y);
            ctx.stroke();
        })
    }
}

