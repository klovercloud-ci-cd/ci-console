export function Step(context: any, t: number, move:number) {
    // @ts-ignore
    this._context = context;
    // @ts-ignore
    this._t = t;
    // @ts-ignore
    this._move = move;
  }

  Step.prototype = {

    areaStart() {
      this._line = 50;
    },
    areaEnd() {
      this._line = NaN;
    },
    lineStart() {
      this._x = this._y = NaN;
      this._point = 0;
    },
    lineEnd() {
      if (0 < this._t && this._t < 1 && this._point === 2) {
        this._context.lineTo(this._x + 200, this._y); // TODO: To increase line width
      }
      if (this._line || (this._line !== 0 && this._point === 1)) {
        this._context.closePath()
      };
      // tslint:disable-next-line: ban-comma-operator
      if (this._line >= 0) (this._t = 1 - this._t), (this._line = 1 - this._line);
    },
    point(x: number, y: number) {
      x = +x;
      y = +y;

      console.log("(this._point-----:",this._point,x,y);

      switch (this._point) {
        case 0:
          this._point = 1;
          this._line ? this._context.lineTo(x, y) : this._context.moveTo(x + this._move, y);
          break;
          // @ts-ignore
        case 1:
          this._point = 2;
        // falls through
        default: {
          let xN;
          let yN;
          let mYb;
          let mYa;
          if (this._t <= 0) {
            xN = Math.abs(x - this._x) * 0.25;
            yN = Math.abs(y - this._y) * 0.25;
            mYb = this._y < y ? this._y + yN : this._y - yN;
            mYa = this._y > y ? y + yN : y - yN;
            this._context.quadraticCurveTo(this._x, this._y, this._x, mYb);
            this._context.lineTo(this._x, mYa);
            this._context.quadraticCurveTo(this._x, y, this._x + xN, y);
            this._context.lineTo(x - xN, y);
          } else {

            const x1 = this._x * (1 - this._t) + x * this._t;
            // console.log("X1::",x1)

            xN = Math.abs(x - x1) * 0.25;
            yN = Math.abs(y - this._y) * 0.25;
            mYb = this._y < y ? this._y + yN : this._y - yN;
            mYa = this._y > y ? y + yN : y - yN;

            console.log("xN,yN,mYb,mYa-------::",xN,yN,mYb,mYa)
            this._context.quadraticCurveTo(x1, this._y, x1, mYb);
            this._context.lineTo(x1, mYa);
            this._context.quadraticCurveTo(x1, y, x1 + xN, y);
            this._context.lineTo(x - xN, y);
          }
          break;
        }
      }
      // tslint:disable-next-line: ban-comma-operator
      (this._x = x), (this._y = y);
    }
  };

  export const stepRound = function (context: any) {
    let move=200;
    var element =document.getElementById('process')
    console.log("elementelementelement:",element && 'true')
    // @ts-ignore
    if(element){
      move=0;
      console.log("elementelementelement2:",element)
    }
    console.log("elementelementelement3:",element)

    // @ts-ignore
    element.classList.add("mystyle");
    console.log("GetTheID*****************",)
      // @ts-ignore
    return new Step(context, 0.9, move);
  };

  export const stepRoundBefore = function (context: any) {
      // @ts-ignore
    return new Step(context, 0);
  };

  export const stepRoundAfter = function (context: any) {
      // @ts-ignore
    return new Step(context, 1);
  };
