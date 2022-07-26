const carCanvas=document.getElementById("carCanvas");

const laneCount=8;
carCanvas.width=laneCount*50;

const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

let difficulty=0.01;
const diffScaling=0.01;

const carCtx = carCanvas.getContext("2d");
const road = new Road(carCanvas.width/2, carCanvas.width, laneCount);
const traffic = [new Car(road.getLaneCenter(1),-100,30,50,"DUMMY")];

const networkCtx = networkCanvas.getContext("2d");

const N=500;
const cars=generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.2);
        }
    }
}

animate();

function generateTraffic(furthestTrafficLocation){
    //determines the number of cars generated
    let numCars=Math.ceil(difficulty*laneCount);
    if (numCars>=laneCount){
        numCars=laneCount-1;
    }
    difficulty+=diffScaling;
    let laneIndex=[];
    for(let i=0;i<laneCount;i++){
        laneIndex.push(i);
    }
    shuffledLaneIndex = shuffleArray(laneIndex);
    for(let i=0;i<numCars;i++){
        traffic.push(new Car(
            road.getLaneCenter(shuffledLaneIndex[i]),
            furthestTrafficLocation-200,
            30,50,"DUMMY"))
        traffic[traffic.length-1].update(road.borders,[]);
    }
}

function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<N;i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 8));
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }

    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }

    //fitness function
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );

    //Checks if more traffic should be generated
    let furthestTraffic=traffic.find(
        c=>c.y==Math.min(
            ...traffic.map(c=>c.y)
        )
    );
    if(bestCar.y-furthestTraffic.y<400){
        generateTraffic(furthestTraffic.y);
    }

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);
    
    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }

    carCtx.globalAlpha=0.2;
    for(let i=1;i<cars.length;i++){
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,drawSensor=true);
    
    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}