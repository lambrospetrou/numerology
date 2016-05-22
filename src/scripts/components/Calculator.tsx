import * as React from "react";
import { BaseComponent } from './BaseComponent';

interface CalculatorProps {}
interface CalculatorState {
    inputBirth: string;
    inputName: string;
}

export class Calculator extends BaseComponent<CalculatorProps, CalculatorState> {
    constructor() {
        super();
        this._bind('_onChangeBirth', '_onChangeName', '_calculateString');
        this.state = this._getInitialState();
    }

    private static parseDate(date: Date) {
        return String(date.getUTCFullYear()) + '-' + ('0'+String(date.getUTCMonth()+1)).slice(-2) + '-' + ('0'+String(date.getUTCDate())).slice(-2); 
    }

    private _getInitialState() {
        return {
            inputBirth: Calculator.parseDate(new Date()),
            inputName: ''
        };
    }

    private _onChangeBirth(evt) {
        this._setState({inputBirth: evt.target.value});
    }

    private _onChangeName(evt) {
        this._setState({inputName: evt.target.value});
    }

    private _calculateString(str: string) {
        if (!str || str == '') {
            return -1;
        }
        function isCoreValue(n: number) {
            return (n >= 1 && n <= 9) || n == 11 || n == 22;
        }

        function sumCharacters(str: string) {
            return Array.prototype.map.call((str || '').toLowerCase(), (ch) => {
                if (ch >= 'a' && ch <= 'z') {
                    return Number(ch.charCodeAt(0) - 'a'.charCodeAt(0))+1;
                }
                return (ch >= '0' && ch <= '9') ? Number(ch) : 0;
            }).reduce((sum, current) => sum + current, 0);
        }

        function calculateCore(str: string) {
            const sumBirth: number = sumCharacters(str);
            if (sumBirth == 0) {
                return -1;
            }
            return isCoreValue(sumBirth) ? sumBirth : calculateCore(String(sumBirth));
        }

        return calculateCore(str);
    }

    render() {
        console.log(this.state);
        return (
            <div class="calculator-container">
                <div>
                    <h3>Birth date</h3>
                    <input type="date" name="input-birth" id="input-birth" 
                        value={this.state.inputBirth}
                        onChange={this._onChangeBirth}/>
                    <section id="numerology-result-birth" className="numerology-result" >
                        <p>{this._calculateString(this.state.inputBirth)}</p>
                    </section>
                </div>

                <div>
                    <h3>Name (A-Z only)</h3>
                    <input type="text" name="input-name" id="input-name"
                        value={this.state.inputName}
                        onChange={this._onChangeName}/>
                    <section id="numerology-result-name" className="numerology-result">
                        <p>{this._calculateString(this.state.inputName)}</p>
                    </section>
                </div>
            </div>
        );
    }
}