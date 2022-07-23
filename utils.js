function linInterp(left, right, percent) {
    return left + percent * (right - left);
}

function getIntersection(A,B,C,D){
    const denominator=(D.y-C.y)*(B.x-A.x)-(B.y-A.y)*(D.x-C.x);
    let t1;
    let t2;
    if (denominator == 0){
        return (undefined)
    } else {
        const numerator=(A.y-C.y)*(D.x-C.x)-(D.y-C.y)*(A.x-C.x);
        t1=numerator/denominator;
        if (D.x-C.x != 0) {
            t2=((B.x-A.x)*t1+(A.x-C.x))/(D.x-C.x);
        } else {
            t2=((B.y-A.y)*t1+(A.y-C.y))/(D.y-C.y);
        }
        if (t1<=1 & t1>=0 & t2<=1 & t2>=0) {
            const touchX=linInterp(A.x,B.x,t1);
            const touchY=linInterp(A.y,B.y,t1);
            return {x:touchX,y:touchY,offset:t1};
        }
    }
}

function polysIntersect(poly1, poly2){
    for (let i=0;i<poly1.length;i++){
        for (let j=0;j<poly2.length-1;j++){
            const touch=getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if (touch) {
                return true;
            }
        }
    }
}