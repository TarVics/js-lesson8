consolex.header(`- Створити функцію конструктор для об'єктів User з полями id, name, surname , email, phone
  створити пустий масив, наповнити його 10 об'єктами new User(....)
`);

const femaleNames = ['Anya', 'Sanaa', 'Jaylin', 'Damaris', 'Jasmine', 'Presley', 'Litzy', 'Carmen', 'Karina',
    'Ayana', 'Ireland', 'Kaelyn', 'Abigail', 'Hana', 'Jolie', 'Tara', 'Averi', 'Kendall', 'Leslie', 'Brynlee',
    'Avah', 'Emilie', 'Lilianna', 'Monserrat', 'Bryanna', 'Carla', 'Rylie', 'Gracelyn', 'Sanai', 'Yadira'];
const maleNames = [
    'Dominik', 'Gaven', 'Anthony', 'Rocco', 'Dayton', 'Chad', 'Brady', 'Nicolas', 'Paxton', 'Kamden', 'Alessandro',
    'Gunnar', 'Javon', 'Odin', 'Glenn', 'Carmelo', 'Ashton', 'Quentin', 'Kameron', 'Aaron', 'Steve', 'Kellen',
    'Brennan', 'Richard', 'Tyrese', 'Quincy', 'Beau', 'Josh', 'Graham', 'Michael'];
const surNames = ['Roberts', 'Kennedy', 'Medina', 'Caldwell', 'Weiss', 'Velazquez', 'Brennan', 'Daugherty', 'Wiggins',
    'Hurley', 'Petty', 'Hess', 'Sharp', 'Osborn', 'Stanton', 'Glass', 'Bennett', 'Cowan', 'Wong', 'Ali', 'Jenkins',
    'Gillespie', 'Shepard', 'Bray', 'Ramirez', 'Goodman', 'Davies', 'Ray', 'Callahan', 'Wise']
const mobileOperators = [
    {preffix: '39', description: 'Голден Телеком, тепер Київстар'},
    {preffix: '50', description: 'Vodafone Україна'},
    {preffix: '63', description: 'lifecell'},
    {preffix: '66', description: 'Vodafone Україна'},
    {preffix: '67', description: 'Київстар'},
    {preffix: '68', description: 'Київстар'},
    {preffix: '73', description: 'lifecell'},
    {preffix: '89', description: 'Інтертелеком для SIP-телефонії'},
    {preffix: '91', description: 'ТриМоб'},
    {preffix: '92', description: 'PEOPLEnet'},
    {preffix: '93', description: 'lifecell'},
    {preffix: '94', description: 'Інтертелеком'},
    {preffix: '95', description: 'Vodafone Україна'},
    {preffix: '96', description: 'Київстар'},
    {preffix: '97', description: 'Київстар'},
    {preffix: '98', description: 'Київстар'},
    {preffix: '99', description: 'Vodafone Україна'}
];

const genPersonName = function(genFemale) {
    if(genFemale === undefined) {
        genFemale = Math.random() > 0.5;
    }
    let names = genFemale ? femaleNames : maleNames;
    return [
        names[Math.round(Math.random() * (names.length - 1))],
        surNames[Math.round(Math.random() * (surNames.length - 1))]
    ];
}
const genPhone = function() {
    let res = '+380' + mobileOperators[Math.round(Math.random() * (mobileOperators.length - 1))].preffix;
    for (let i = 0; i < 7; i++) res += Math.round(Math.random() * 9);
    return res;
}

const User = function ({id, name, surname, email, phone}) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.phone = phone;
}

const users = [];
for (let i = 1; i <= 10; i++) {
    const [name, surname] = genPersonName();
    const user = new User({
        id: i,
        name: name,
        surname: surname,
        email: `${(name + '.' + surname).toLowerCase()}@email.net`,
        phone: genPhone()
    });
    users.push(user);
}

users.forEach((user, index) => consolex.log('%D. %O', index + 1, user));

/********************************************************************/

consolex.header(`- Взяти масив з  User[] з попереднього завдання, та відфільтрувати , 
  залишивши тільки об'єкти з парними id (filter)
`);

const evenUsers = users.filter(user => !(user.id % 2));
evenUsers.forEach((user, index) => consolex.log('%D. %O', index + 1, user));

/********************************************************************/

consolex.header(`- Взяти масив з  User[] з попереднього завдання, та відсортувати його по id. по зростанню (sort)
`);

const sortedUsers = evenUsers.sort((a, b) => a.id - b.id);
sortedUsers.forEach((user, index) => consolex.log('%D. %O', index + 1, user));

/********************************************************************/

consolex.header(`- створити класс для об'єктів Client з полями 
id, name, surname, email, phone, order (поле є масивом зі списком товарів)
створити пустий масив, наповнити його 10 об'єктами Client
`);

class Client {
    constructor({id, name, surname, email, phone, order}) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.phone = phone;
        this.order = [].concat(order); // на випадок передачі не об'єкта
    }
}

const products = ['Bread', 'Milk', 'Cheese', 'Potato', 'Apples', 'Bananas',
    'Orange', 'Beer', 'Salt', 'Sugar', 'Onion', 'Cabbage', 'Plums', 'Rice', 'Coffee', 'Tea'];
const clients = [];
for (let i = 1; i <= 10; i++) {
    const [name, surname] = genPersonName();
    const client = new Client({
        id: i,
        name: name,
        surname: surname,
        email: `${(name + '.' + surname).toLowerCase()}@email.net`,
        phone: genPhone(),
        order: products.filter(() => Math.random() < 0.2)
    });
    clients.push(client);
}

clients.forEach((client, index) => consolex.log('%D. %O', index + 1, client));

/********************************************************************/

consolex.header(`- Взяти масив (Client [] з попереднього завдання).
Відсортувати його по кількості товарів в полі order по зростанню. (sort)
`);

const sortedClients = clients.sort((a, b) => a.order.length - b.order.length);
sortedClients.forEach((client, index) => consolex.log('%D. %O', index + 1, client));

/********************************************************************/

consolex.header(`- Створити функцію конструктор яка дозволяє створювати об'єкти car, з властивостями 
модель, виробник, рік випуску, максимальна швидкість, об'єм двигуна. додати в об'єкт функції:
-- drive () - яка виводить в консоль \`їдемо зі швидкістю \${максимальна швидкість} на годину\`
-- info () - яка виводить всю інформацію про автомобіль в форматі \`назва поля - значення поля\`
-- increaseMaxSpeed (newSpeed) - яка підвищує значення максимальної швидкості на значення newSpeed
-- changeYear (newValue) - змінює рік випуску на значення newValue
-- addDriver (driver) - приймає об'єкт який "водій" з довільним набором полів, і додає його в поточний об'єкт car
`);

const CarByFunc = function ({model, producer, year, maxSpeed, engineVolume}) {
    this.model = model;
    this.producer = producer;
    this.year = year;
    this.maxSpeed = maxSpeed;
    this.engineVolume = engineVolume;
    this.drive = function () {
        console.log(`їдемо зі швидкістю ${this.maxSpeed} км на годину`);
    }
    this.info = function () {
        let carPos = 0;
        for (const [name, value] of Object.entries(this)) {
            if (typeof value !== 'function') {
                consolex.log('%D. %s -' + (typeof value === 'string' ? ' %S' : '%O'), ++carPos, name, value);
            }
        }
    }
    this.increaseMaxSpeed = function (newSpeed) {
        if (newSpeed > 0) this.maxSpeed += newSpeed;
    }
    this.changeYear = function (newValue) {
        if (newValue > 1900) this.year = newValue;
    }
    this.addDriver = function (driver) {
        if (typeof driver === 'object') this.driver = driver;
    }
}

const carByFunc = new CarByFunc({
    model: 'Volkswagen Golf R',
    producer: 'Volkswagen',
    year: 2015,
    maxSpeed: 250,
    engineVolume: 2.0
})

carByFunc.increaseMaxSpeed(20);
carByFunc.changeYear(2018);
carByFunc.addDriver(users[Math.round(Math.random() * (users.length - 1))]);
carByFunc.info();
carByFunc.drive();

/********************************************************************/

consolex.header(`- (Те саме, тільки через клас)
Створити клас який дозволяє створювати об'єкти car, з властивостями модель, виробник, рік випуску, 
максимальна швидкість, об'єм двигуна. додати в об'єкт функції:
-- drive () - яка виводить в консоль \`їдемо зі швидкістю \${максимальна швидкість} на годину\`
-- info () - яка виводить всю інформацію про автомобіль в форматі \`назва поля - значення поля\`
-- increaseMaxSpeed (newSpeed) - яка підвищує значення максимальної швидкості на значення newSpeed
-- changeYear (newValue) - змінює рік випуску на значення newValue
-- addDriver (driver) - приймає об'єкт який "водій" з довільним набором полів, і додає його в поточний об'єкт car
`);

class CarByClass {
    constructor({model, producer, year, maxSpeed, engineVolume}) {
        this.model = model;
        this.producer = producer;
        this.year = year;
        this.maxSpeed = maxSpeed;
        this.engineVolume = engineVolume;
    }

    drive() {
        console.log(`їдемо зі швидкістю ${this.maxSpeed} км на годину`);
    }

    info() {
        let carPos = 0;
        for (const [name, value] of Object.entries(this)) {
            if (typeof value !== 'function') {
                consolex.log('%D. %s -' + (typeof value === 'string' ? ' %S' : '%O'), ++carPos, name, value);
            }
        }
    }

    increaseMaxSpeed(newSpeed) {
        if (newSpeed > 0) this.maxSpeed += newSpeed;
    }

    changeYear(newValue) {
        if (newValue > 1900) this.year = newValue;
    }

    addDriver(driver) {
        if (typeof driver === 'object') this.driver = driver;
    }
}

const carByClass = new CarByClass({
    model: 'Mercedes-AMG E63S 4Matic+ (S213)',
    producer: 'Mercedes-AMG',
    year: 2017,
    maxSpeed: 250,
    engineVolume: 4.0
})

carByClass.increaseMaxSpeed(20);
carByClass.changeYear(2018);
carByClass.addDriver(users[Math.round(Math.random() * (users.length - 1))]);
carByClass.info();
carByClass.drive();

/********************************************************************/

consolex.header(`-створити класс/функцію конструктор попелюшка з полями ім'я, вік, розмір ноги. 
Створити масив з 10 попелюшок.
Сторити об'єкт класу "принц" за допомоги класу який має поля ім'я, вік, туфелька яку він знайшов.
За допомоги циклу знайти яка попелюшка повинна бути з принцом.
Додатково, знайти необхідну попелюшку за допомоги функції масиву find та відповідного колбеку
`);

class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

class Cinderella extends Person {
    constructor(name, age, feetSize) {
        super(name, age);
        this.feetSize = feetSize;
    }
}

class Prince extends Person {

    constructor(name, age, shoeSize) {
        super(name, age);
        this.shoeSize = shoeSize;
    }

    findCinderella(cinderellas) {
        let res = null;
        if (!Array.isArray(cinderellas)) return res;
        for (let i = 0; !res && i < cinderellas.length; i++) {
            const cinderella = cinderellas[i];
            if (cinderella.feetSize === this.shoeSize) res = cinderella;
        }
        return res;
    }

    findCinderella2(cinderellas) {
        return Array.isArray(cinderellas) && cinderellas.find(cinderella => cinderella.feetSize === this.shoeSize) || null;
    }
}

const cinderellas = [];
for (let i = 1; i <= 10; i++) {
    const cinderella = new Cinderella(genPersonName(true).join(' '),
        Math.round(16 + Math.random() * (30 - 16)),
        Math.round(35 + Math.random() * (40 - 35)));
    cinderellas.push(cinderella);
    consolex.log('%D. %O', i, cinderella);
}

const prince = new Prince(genPersonName(false).join(' '),
    Math.round(16 + Math.random() * (30 - 16)),
    Math.round(35 + Math.random() * (40 - 35)));

consolex.log('Prince %O', prince);

const cinderella = prince.findCinderella(cinderellas);
if (cinderella) {
    consolex.log('1. Cinderella found %O', cinderella);
} else {
    consolex.log('1. Cinderella not found');
}

const cinderella2 = prince.findCinderella2(cinderellas);
if (cinderella2) {
    consolex.log('2. Cinderella found %O', cinderella2);
} else {
    consolex.log('2. Cinderella not found');
}

/********************************************************************/
