import * as React from "react";
import { BaseComponent } from './BaseComponent';

interface CalculatorProps {}
interface CalculatorState {
    inputBirth: string
}

export class Calculator extends BaseComponent<CalculatorProps, CalculatorState> {
    constructor() {
        super();
        this._bind('_onChangeBirth', '_calculate');
        this.state = this._getInitialState();
    }

    private static parseDate(date: Date) {
        return String(date.getUTCFullYear()) + '-' + ('0'+String(date.getUTCMonth()+1)).slice(-2) + '-' + ('0'+String(date.getUTCDate())).slice(-2); 
    }

    private _getInitialState() {
        return {
            inputBirth: Calculator.parseDate(new Date())
        };
    }

    private _onChangeBirth(evt) {
        this.setState({inputBirth: evt.target.value});
    }

    private _calculateString(str: string) {
        if (!str || str == '') {
            return -1;
        }
        function isCoreValue(n: number) {
            return (n >= 1 && n <= 9) || n == 11 || n == 22;
        }

        function sumCharacters(str: string) {
            return Array.prototype.map.call(str, (ch) => {
                return (ch >= '0' && ch <= '9') ? Number(ch) : 0;
            }).reduce((sum, current) => sum + current, 0);
        }

        function calculateCore(str: string) {
            const sumBirth: number = sumCharacters(str);
            return isCoreValue(sumBirth) ? sumBirth : calculateCore(String(sumBirth));
        }

        return calculateCore(str);
    }

    private _calculate() {
        return this._calculateString(this.state.inputBirth);
    }

    render() {
        console.log(this.state);
        return (
            <div class="calculator-container">
                <input type="date" name="input-birth" class="input-birth" 
                    value={this.state.inputBirth}
                    onChange={this._onChangeBirth}/>
                <section class="numerology-result">
                    <p>{this._calculate()}</p>
                </section>
            </div>
        );
    }
}