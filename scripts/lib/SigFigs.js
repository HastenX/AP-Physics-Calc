export class SigFigs {
    sigFigs;
    output;
    
    userInputs;
    fixedInputs;

    constructor(...userInputs) {
        this.sigFigs = 999999999;
        this.fixedInputs = [];

        userInputs.forEach((num) => {
            if(num != undefined && num != 0 && num != "") {
                let fixedNum = String(num).split("e")[0];

                // IF SIG FIG HAS DECIMAL
                if (String(fixedNum).includes(".")) {
                    // IF SIG FIG HAS LEADING ZEROS
                    if((String(fixedNum).at(0) == "0" && String(fixedNum).includes(".")) || String(fixedNum).at(0) == ".") {

                        this.fixedInputs.push(String(fixedNum).replace(".","").length);
                        while (true) {
                            // ITERATES TO GET RID OF LEADING ZERO AND MAKES NUMBER TO BE USED
                            if(String(fixedNum).at(0) == "0" || String(fixedNum).at(0) == ".") {
                                fixedNum = fixedNum.slice(1);
                            } else {
                                this.fixedInputs.push(String(fixedNum).replace(".","").length);
                                break;
                            }
                        }
                    } else {
                        // IF SIG FIG HAS ZEROS PAST DECIMAL POINT
                        this.fixedInputs.push(String(fixedNum).replace(".","").length);
                    }
                } else {
                    // IF WHOLE NUMBER

                    let i;
                    // REMOVES TRAILING ZEROS OF WHOLE NUMBERS
                    if(String(fixedNum).at(fixedNum.length-1) == "0") {
                        for(i=fixedNum.length-1; i>0;  i--) {
                            if(fixedNum[i] != "0") {
                                break;
                            }
                        }
                        fixedNum = fixedNum.slice(0, i+1)
                    }
                    // REMOVES LEADING ZEROS OF WHOLE NUMBERS
                    if(fixedNum.at(0) == "0") {
                        for(i=0; i<fixedNum.length;  i++) {
                            if(fixedNum.at(i) != 0) {
                                break;
                            }
                        }
                        fixedNum = fixedNum.slice(i, fixedNum.length)
                    }
                    // IF SIG FIG HAS WHOLE NUMBER (NO DECIMAL), GET RID OF TRAILING ZEROS (USELESS)
                    this.fixedInputs.push(String(fixedNum).length);
                }
            }
        });
        this.sigFigs = Math.min(...this.fixedInputs);
    }

    getCounterExponent(clampNum) {
        let rawExponent = Math.log10(clampNum);
        let exponent;
        if (rawExponent == 0) {
            exponent = 0;
        }
        else {
            exponent = Math.floor(rawExponent) * -1;
        } 
        return exponent;
    }

    clamp(num) {
        return Math.round(num * Math.pow(10,this.sigFigs-1))/ Math.pow(10, this.sigFigs-1);
    }

    applySigFigs(clampNum) {
        let isNegative = clampNum < 0;
        if(clampNum == 0) {
            this.output = 0;
            return;
        }
        this.output = isNegative ? clampNum *-1 : clampNum;

        let exponent = this.getCounterExponent(this.output);
        this.output = this.clamp(this.output*10**exponent);
        if (Number(String(this.output).length)-1 < this.sigFigs && !String(this.output).includes(".")) {
            this.output = String(this.output).concat(".");
        }
        while (Number(String(this.output).length)-1 < this.sigFigs) {
            this.output = String(this.output).concat("0");
        }

        this.output = String(isNegative ? "-": "") + String(this.output).concat("x10^" + String(-exponent));
    }
    removeSigFig() {
        this.sigFigs--;
    }
}