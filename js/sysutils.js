/**
 * Системні утиліти
 * @type {SysUtils}
 * @author Віктор Таран <tarvics@gmail.com>
 */
if(!globalThis.SysUtils) globalThis.SysUtils = {
    /**
     * Параметри запуску функцій форматування грошових, числових даних та форматування дат
     * @type {object}
     * @property {Intl.NumberFormatOptions} currency Параметри форматування грошових даних
     * @property {Intl.NumberFormatOptions} number Параметри форматування числових даних
     * @property {Intl.DateTimeFormatOptions} dateTime Параметри форматування дати та часу
     * @property {Intl.DateTimeFormatOptions} date Параметри форматування дати
     * @property {Intl.DateTimeFormatOptions} time Параметри форматування часу
     */
    options: {
        currency: {
            style: "currency",
            currency: 'UAH',
            useGrouping: true
        },
        number: {
            useGrouping: true
        },
        dateTime: {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
        },
        date: {
            year: 'numeric', month: 'numeric', day: 'numeric'
        },
        time: {
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
        }
    },

    /**
     * Коллбек для додаткової обробки даних за допомогою функції {@link fmtStr}
     * @callback fnFormatCallback
     * @param {any} value Значення, яке піддається форматуванню
     * @param {string|undefined} type Тип даних згідно заданого шаблону.
     *   Допустимі значення: 'b', 'd', 'e', 'f', 'h', 'm', 'n', 'o', 'p', 's', 't', 'x', 'y',
     *   або undefined - у випадку, якщо форматуються дані, які не були задіяні під час форматування згідно шаблону
     *   Опис значень, які підтримуються, виконано в {@link fmtStr}
     */

    /**
     * Форматоване представлення даних
     * @param {fnFormatCallback} fnFmtCallback Коллбек для додаткової обробки даних
     * @param {string} msgFmt Шаблон для форматування даних. У випадку, якщо цей параметр не є текстом, результат
     *   виконання фунції буде лише значення, яке міститься у цьому параметрі
     * @param {...any} args Значення для підстановки до шаблону
     * @returns {string|any}
     * @description
     * Функція <i>fmtStr</i> забезпечує форматування кількох простих типів даних у рядок.
     *
     * Параметр <i>msgFmt</i> визначає, як вхідні дані, які задані у наступних параметрах функції <i>args</i>
     * перетворяться на повернений рядок.
     *
     * Рядок форматування може складатися зі звичайних символів (які передаються незмінними в рядок результату)
     * і символів форматування даних. Це форматування найкраще пояснюється на прикладі коду.
     *
     * Простіше кажучи, кожен підрядок форматування даних починається з "%" і закінчується індикатором типу даних:
     *
     *   b - логічний тип
     *   d - десяткове (ціле)
     *   e - науковий
     *   f - фіксований
     *   h - час
     *   m - гроші
     *   n - число (плаваюче)
     *   o - об'єкт
     *   p - число заданої точності
     *   s - рядок
     *   t - дата та час
     *   x - шістнадцяткове число
     *   y - дата
     * %08#16[red]x
     * Загальний формат кожного підрядка форматування такий:
     *
     * %[Індекс:][-][Ширина][.Точність][#Система кодування (2,7,10,16)]Тип
     *
     * де квадратні дужки вказують на додаткові параметри, а ":" ".", "#" - символи є літералами
     * @example
     *   SysUtils.fmtStr((value, type) => type ? '<' + value + '>' : value, '%08#16x', 65535) // <0000ffff>
     */

    fmtStr: function (fnFmtCallback, msgFmt, ...args) {
        if(typeof msgFmt !== 'string') return msgFmt;

        const supportedTypes = 'bdefhmnopstxyBDEFHMNOPSTXY';

        let result = '';

        let argsIndex = 0;
        let maxIndex = 0;

        let currPos = 0;
        let lastPos = 0;

        while (~(currPos = msgFmt.indexOf('%', lastPos)/* currPos != -1 */)) {
            result += msgFmt.substring(lastPos, currPos);

            // %2:-10.4d, %8.6d, %10.4d, %-10.4d, %.4d, %4d, %-7d, %d, %s, %1:s, %*.4d, %*.*d
            // %5.2d, %5.2f, %10.2e, %5.3p, %5x, %20#2x, %6#2d, %6#16d

            let currOp = 0; // 0 - none, 1 - param, 2 - sign, 3 - point, 4 - base
            let delta = 0;
            let digit = '';

            let type = '';
            let param = '';
            let minus = '';
            let width = '';
            let precision = '';
            let base = '';

            let char = '';

            while (char = msgFmt[currPos + ++delta]) {
                if (char >= '0' && char <= '9') {
                    if (digit/* * */) break;
                    digit = char;
                    while ((char = msgFmt[currPos + delta + 1]) && char >= '0' && char <= '9') {
                        digit += char;
                        delta++;
                    }
                } else if (char === '*') {
                    if (digit/* 0-9,* */) break;
                    digit = char;
                } else if (char === ':') {
                    if (currOp !== 0 || !digit) break;
                    param = digit;
                    digit = '';
                    currOp = 1; /* param */
                } else if (char === '-') {
                    if (currOp > 1 /* param */ || digit) break;
                    minus = char;
                    currOp = 2; /* sign */
                } else if (char === '.') {
                    if (currOp >= 3/* point */) break;
                    if (digit) {
                        width = digit;
                        digit = '';
                    }
                    currOp = 3; /* point */
                } else if (char === '#') {
                    if (currOp === 4) break;
                    if (currOp === 3/* point */) {
                        if (!digit) break;
                        precision = digit;
                        digit = '';
                    } else if (digit) {
                        width = digit;
                        digit = '';
                    }
                    currOp = 4; /* base */
                } else if (~supportedTypes.indexOf(char)) {
                    if (currOp === 2/* sign */ && !digit) break;
                    if (currOp === 4/* base */) {
                        if (!digit) break;
                        base = digit;
                        digit = '';
                    } else if (currOp === 3/* point */) {
                        if (!digit) break;
                        precision = digit;
                        digit = '';
                    } else if (digit) {
                        width = digit;
                        digit = '';
                    }
                    type = char;
                    break;
                } else break;
            }

            if (type) {
                if (param) {
                    if (maxIndex < argsIndex) maxIndex = argsIndex;
                    argsIndex = +param;
                }

                if (width === '*')
                    width = '' + args[argsIndex++];
                if (precision === '*')
                    precision = '' + args[argsIndex++];

                let val = args[argsIndex++];

                switch (type) {
                    case 'b':
                    case 'B':
                        val = !!val;
                        break;
                    case 'd':
                    case 'D':
                        val = parseFloat(parseInt(val, base ? +base : 10)
                            .toPrecision(precision ? +precision : undefined)).toFixed(0);
                        break;
                    case 'e':
                    case 'E':
                        val = parseFloat(val)
                            .toExponential(precision ? +precision : undefined);
                        break;
                    case 'f':
                    case 'F':
                        val = parseFloat(val)
                            .toFixed(precision ? +precision : undefined);
                        break;
                    case 'h':
                    case 'H':
                        if (val instanceof Date) {
                            if (!this.timeIntl)
                                this.timeIntl = new Intl.DateTimeFormat('default', this.options.time);
                            val = this.timeIntl.format(val);
                        } else
                            val = val.toString();
                        break;
                    case 'm':
                    case 'M':
                        if (!this.currencyIntl)
                            this.currencyIntl = new Intl.NumberFormat('default', this.options.currency);
                        val = this.currencyIntl.format(parseFloat(val));
                        break;
                    case 'n':
                    case 'N':
                        if (!this.numberIntl)
                            this.numberIntl = new Intl.NumberFormat('default', this.options.number);
                        val = this.numberIntl.format(parseFloat(val));
                        break;
                    case 'o':
                    case 'O':
                        if (typeof val == 'object' && !fnFmtCallback) val = JSON.stringify(val);
                        break;
                    case 'p':
                    case 'P':
                        val = parseFloat(val)
                            .toPrecision(precision ? +precision : undefined);
                        break;
                    case 's':
                    case 'S':
                        if (typeof val == 'object') val = JSON.stringify(val);
                        break;
                    case 't':
                    case 'T':
                        if (val instanceof Date) {
                            if (!this.dateTimeIntl)
                                this.dateTimeIntl = new Intl.DateTimeFormat('default', this.options.dateTime);
                            val = this.dateTimeIntl.format(val).replace(',', '');
                        } else
                            val = val.toString();
                        break;
                    case 'x':
                    case 'X':
                        val = parseInt(val)
                            .toString(base ? +base : 16);
                        break;
                    case 'y':
                    case 'Y':
                        if (val instanceof Date) {
                            if (!this.dateIntl)
                                this.dateIntl = new Intl.DateTimeFormat('default', this.options.date);
                            val = this.dateIntl.format(val);
                        } else
                            val = val.toString();
                        break;
                }

                if (width) {
                    let pad = +width;
                    let ch = width[0] === '0' ? '0' : ' ';
                    if (minus) {
                        while (val.length < pad) val += ch;
                    } else {
                        while (val.length < pad) val = ch + val;
                    }
                }

                result += fnFmtCallback ? fnFmtCallback(val, type) : val;

                lastPos = currPos + delta + 1;
            } else {
                // result += '%';
                // lastPos = currPos + (char === '%' /* %% -> % */ ? 2 : 1);

                if (char === '%' /* %% -> % */) {
                    result += '%';
                    lastPos = currPos + 2;
                } else if(!fnFmtCallback) {
                    result += '%';
                    lastPos = currPos + 1;
                } else {
                    let res = fnFmtCallback(args[argsIndex], char);
                    if(res === undefined) {
                        result += '%';
                        lastPos = currPos + 1;
                    } else {
                        argsIndex++
                        result += res;
                        lastPos = currPos + 2;
                    }
                }
            }
        }
        result += msgFmt.substring(lastPos);

        if(fnFmtCallback) {
            if (maxIndex < argsIndex) maxIndex = argsIndex;
            for (let i = maxIndex; i < args.length; i++) {
                fnFmtCallback(args[i], undefined);
            }
        }

        return result;
    },
    /**
     * Форматоване представлення даних без додаткової обробки даних
     * @param {string} msgFmt Шаблон для форматування даних
     * @param {...any} args Значення для підстановки до шаблону
     * @returns {string}
     * @description Дивись {@link fmtStr}
     * @example
     *   SysUtils.format('%0:o test %d', {"name": [1, 2, 3]}, 123);
     *   SysUtils.format('<%5d>', 12);               // <   12>
     *   SysUtils.format('<%05d>', 12);              // <00012>
     *   SysUtils.format('<%-5d>', 12);              // <12   >
     *   SysUtils.format('<%5.2d>', 123);            // <  120>
     *   SysUtils.format('<%5.2d>', 127);            // <  130>
     *   SysUtils.format('<%5.2f>', 1.1);            // < 1.10>
     *   SysUtils.format('<%10.2e>', 1234.1234);     // <   1.23e+3>
     *   SysUtils.format('<%5.3p>', 1.12345);        // < 1.12>
     *   SysUtils.format('<%5x>', 45054);            // < affe>
     *   SysUtils.format('<%20#2x>', '45054');       // <    1010111111111110>
     *   SysUtils.format('<%6#2d>', '111');          // <     7>
     *   SysUtils.format('<%6#16d>', 'affe');        // < 45054>
     *   SysUtils.format('<%*.*d>', 10, 4, 1234);    // <      1234>
     *   SysUtils.format('<%t>', new Date());        // <07.08.2022 22:35:49>
     *   SysUtils.format('<%y>', new Date());        // <07.08.2022>
     *   SysUtils.format('<%h>', new Date());        // <22:35:49>
     *   SysUtils.format('<%m>', 1.35);              // <1,35 ₴>
     *   SysUtils.format('<%n>', 100234.35);         // <100 234,35>
     *   SysUtils.format('<%.8p>', 12345.678);       // <12345.678>
     *   SysUtils.format('<%.3f>', 12345.678);       // <12345.678>
     *   SysUtils.format('<%.3f>', 12345.678);       // <12345.678>
     *   SysUtils.format('<%o>', [31, 1, 2, 3]) // <[31,1,2,3]>
     *   SysUtils.format('<%s>', [31, 1, 2, 3]) // <[31,1,2,3]>
     *   SysUtils.format('<%o test %d>', {"name": [1, 2, 3]}, 123) // <{"name":[1,2,3]} test 123>
     *   SysUtils.format('<%08#16x>', 65535)         // <0000ffff>
     *   SysUtils.format('<%s %0:s %s %1:s %s>', 'One', 'Two', 'Three', 'Four')); // <One One Two Two Three> Four
     */
    format: function (msgFmt, ...args) {
        return this.fmtStr(undefined, msgFmt, ...args)
    }
}

/**
 * Повторення функій console але із форматованим виводом, який базується на {@link SysUtils.format}
 * @type {consolex}
 * @author Віктор Таран <tarvics@gmail.com>
 */
if(!globalThis.consolex) {
    globalThis.consolex = {};
    for (const method in console) globalThis.consolex[method] = console[method]
    /**
     * Стилі для виведення у консоль у відповідності із типом даних
     * @type {object}
     * @property {string} boolean Стиль boolean
     * @property {string} header Стиль для показу заголовку
     * @property {string} none Стиль для викнення налаштування кольору
     * @property {string} number Стиль number
     * @property {string} string Стиль string
     */
    globalThis.consolex.styles = {
        boolean: 'color: mediumpurple;',
        header: 'border-left: 4px solid green; padding-left: 10px; display: block; white-space: pre-wrap;',
        none: 'color: none;',
        number: 'color: forestgreen;',
        string: 'color: cornflowerblue;'
    }
    /**
     * Виведення даних у консоль із врахуванням стилю.
     * @param {string} method Назва функції об'єкта console, за допомогою якої буде виконано друк
     * @param {string} msgFmt Шаблон для форматування даних
     * @param {...any} args Значення для підстановки до шаблону
     * @description Детальний опис параметрів <i>msgFmt</i> та <i>args</i> дивись тут {@link SysUtils.fmtStr}
     */
    globalThis.consolex._consoleWrite = function (method, msgFmt, ...args) {
        if(typeof msgFmt !== 'string') {
            console[method](msgFmt, ...args);
            return;
        }

        const argsNew = [];
        const fnArgs = (value, type) => {
            if(type === undefined) {
                argsNew.push(value);
            } else if(type === 'O') {
                argsNew.push(value);
                value = '%o';
            } else if(type === 'c' || type === 'C') {
                argsNew.push(value);
                value = '%c';
            } else if(['D', 'E', 'F', 'M', 'N', 'P', 'X'].includes(type)) {
                value = '%c' + value + '%c';
                argsNew.push(this.styles.number, this.styles.none);
            } else if(type === 'B') {
                value = '%c' + value + '%c';
                argsNew.push(this.styles.boolean, this.styles.none);
            } else if(type === 'S') {
                value = '%c"' + value + '"%c';
                argsNew.push(this.styles.string, this.styles.none);
            }

            return value;
        }

        let format = SysUtils.fmtStr(fnArgs, msgFmt, ...args)
        console[method](format, ...argsNew);
    }
    for(const method of ['debug', 'error', 'info', 'log', 'warn']) {
        globalThis.consolex[method] = function (msgFmt, ...args) {
            this._consoleWrite(method, msgFmt, ...args)
        }
    }
    /**
     * Друк заголовка із врахуванням стилю {@link styles.header}
     * @param text Текст для показу
     */
    globalThis.consolex.header = function (text) {
        console.info('%c%s', this.styles.header, text);
    }
}
/*
consolex.header('Приклади застосування');
consolex.log('%0:o test %d', {"name": [1, 2, 3]}, 123);
consolex.log('<%5d>', 12);               // <   12>
consolex.log('<%05d>', 12);              // <00012>
consolex.log('<%-5d>', 12);              // <12   >
consolex.log('<%5.2d>', 123);            // <  120>
consolex.log('<%5.2d>', 127);            // <  130>
consolex.log('<%5.2f>', 1.1);            // < 1.10>
consolex.log('<%10.2e>', 1234.1234);     // <   1.23e+3>
consolex.log('<%5.3p>', 1.12345);        // < 1.12>
consolex.log('<%5x>', 45054);            // < affe>
consolex.log('<%20#2x>', '45054');       // <    1010111111111110>
consolex.log('<%6#2d>', '111');          // <     7>
consolex.log('<%6#16d>', 'affe');        // < 45054>
consolex.log('<%*.*d>', 10, 4, 1234);    // <      1234>
consolex.log('<%t>', new Date());        // <07.08.2022 22:35:49>
consolex.log('<%y>', new Date());        // <07.08.2022>
consolex.log('<%h>', new Date());        // <22:35:49>
consolex.log('<%m>', 1.35);              // <1,35 ₴>
consolex.log('<%n>', 100234.35);         // <100 234,35>
consolex.log('<%.8p>', 12345.678);       // <12345.678>
consolex.log('<%.3f>', 12345.678);       // <12345.678>
consolex.log('<%.3f>', 12345.678);       // <12345.678>
consolex.log('Тест %s', '"' + 12345.678 + '"');       // <12345.678>
consolex.log('Тест %b', true);       // <12345.678>

console.log(SysUtils.format('<%o>', [31, 1, 2, 3])) // <[31,1,2,3]>
console.log(SysUtils.format('<%s>', [31, 1, 2, 3])) // <[31,1,2,3]>
console.log(SysUtils.format('<%o test %d>', {"name": [1, 2, 3]}, 123)); // <{"name":[1,2,3]} test 123>
console.log(SysUtils.format('<%08#16x>', 65535)); // <0000ffff>
*/
