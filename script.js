"use strict;"


// селектор
const selector = document.getElementById('selector');


// кнопка
let button = document.getElementById("button");
button.addEventListener("click", clearTable);


// создаём таблицу
let tableEl = document.createElement("table");
let right = document.getElementsByClassName("right")[0];
right.appendChild(tableEl);

let headEl = document.createElement("thead");
tableEl.appendChild(headEl);

let trEl = document.createElement("tr");
headEl.appendChild(trEl);

const tableHeaders = ["Id", "Name", "Telephone", "Salary"];

tableHeaders.forEach(item => {
    let thEl = document.createElement("th");
    thEl.innerText = item;
    trEl.appendChild(thEl);
});

let bodyEl = document.createElement("tbody");
tableEl.appendChild(bodyEl);


// тут будут храниться "нажатые" элементы
let selectedItems = [];


// очистка таблицы
function clearTable() {
    selectedItems.forEach(el => el.classList.remove("orange"));
    selectedItems = [];

    bodyEl.remove();
    bodyEl = document.createElement("tbody");
    tableEl.appendChild(bodyEl);

    button.disabled = true;
}


// создаём массив работников
const employees = [
    {
        dept_unit_id: 0,
        id: 0,
        name: "YarikHead",
        tel: "123-123-3",
        salary: 3000
    },
    {
        id: 1,
        name: "MashaLead",
        dept_unit_id: 1,
        tel: "123-123-3",
        salary: 2000
    },
    {
        id: 2,
        name: "SashaLead",
        dept_unit_id: 1,
        tel: "123-123-3",
        salary: 2200
    },
    {
        id: 3,
        name: "MirraDev",
        dept_unit_id: 2,
        tel: "123-123-3",
        salary: 1200
    },
    {
        id: 4,
        name: "IraDev",
        dept_unit_id: 2,
        tel: "123-123-3",
        salary: 1000
    },
    {
        id: 5,
        name: "DanikHead3",
        dept_unit_id: 3,
        tel: "123-123-33",
        salary: 3000
    },
    {
        id: 6,
        name: "OliaLead3",
        dept_unit_id: 4,
        tel: "123-123-3",
        salary: 2200
    },
    {
        id: 7,
        name: "KoliaLead",
        dept_unit_id: 4,
        tel: "123-123-3",
        salary: 2000
    },
    {
        id: 8,
        name: "LenaTest",
        dept_unit_id: 5,
        tel: "123-123-3",
        salary: 1200
    },
    {
        id: 9,
        name: "SienaTest",
        dept_unit_id: 5,
        tel: "123-123-3",
        salary: 1000
    }
];


let devDeptHead = {
    name: 'Development Management',
    id: 0,
    dept_units: 'Lead Developers',
};
let devLead = {
    name: 'Lead Developers',
    id: 1,
    dept_units: "Developers"
};
let developer = {
    name: 'Developers',
    id: 2,
    dept_units: null,
};
let qaDeptHead = {
    name: 'Quality Assurance Management',
    id: 3,
    dept_units: 'Lead QA',
};
let qaLead = {
    name: 'Lead QA',
    id: 4,
    dept_units: "Testers",
};
let qaTester = {
    name: 'Testers',
    id: 5,
    dept_units: null,
};


let firstTree = [devDeptHead, devLead, developer, qaDeptHead, qaLead, qaTester];


// добавляем сотрудников в отделы
firstTree.forEach(dept => {
    employees.forEach(worker => {
        if (worker.dept_unit_id === dept.id) {
            if (!dept.children) {
                dept.children = [];
            }

            dept.children.push(worker);
        }
    });
});


// добавляем отделы в родительские отделы
firstTree.forEach(parent => {
    if (parent.dept_units != null) {
        firstTree.forEach(child => {
            if (parent.dept_units === child.name) {
                if (!parent.children) {
                    parent.children = [];
                }

                parent.children.push(child);
            }
        });
    }
});


let rootTree = [devDeptHead, qaDeptHead];


// переходим к добавлению дерева на страницу
let ulTree = document.getElementById("ul_tree");


// рекурсивный обход дерева
function traverseTree(elements, parentEl) {
    if (!elements) {
        return;
    }

    elements.forEach(function (el) {
        let liEl = document.createElement('li');
        liEl.innerText = el.name;
        parentEl.appendChild(liEl);

        if (!el.children) {
            liEl.setAttribute("data-id", el.id);
        } else {
            // добавляем каретку
            let str = "<span class=\"caret\"></span>";
            liEl.innerHTML = str;
            liEl.innerHTML += el.name;

            // добавляем класс "родителя" и в записываем data id департамента
            liEl.classList.add("dept_class");
            liEl.setAttribute("data-dept-id", el.id);

            let ulEl = document.createElement('ul');
            liEl.appendChild(ulEl);
            traverseTree(el.children, ulEl);
        }
    });
}

traverseTree(rootTree, ulTree);


//обработка событий
document.addEventListener("click", showItems);
// selector.addEventListener("change", showItems);


let temp;// для отладки


function showItems() {
    temp = event.target;
    console.log(temp);

    if (event.target.tagName === "LI") {
        clearTable();
        event.target.classList.toggle("orange");
        selectedItems.push(event.target);

        if (!event.target.classList.contains("dept_class")) {// если нажали на человека
            let id = +event.target.dataset.id;
            let person = employees.filter(item => item.id === id);
            fillTable(person);

        } else {// если нажали на отдел
            let deptId = +event.target.dataset.deptId;
            let persons = employees.filter(item => item.dept_unit_id === deptId);
            fillTable(persons);
        }

    } else if (event.target.tagName === "SPAN") { // если нажали на каретку
        event.target.parentElement.childNodes[2].classList.toggle("nested");
        event.target.classList.toggle("caret-down");
    }
}


// заполнение таблицы
async function fillTable(arr) {
    for (let i = 0; i < arr.length; i++) {
        let tempTrEl = document.createElement("tr");
        bodyEl.appendChild(tempTrEl);

        let person = {}; // деструктуризируем
        [person.id, person.name, person.telephone] = [arr[i]["id"], arr[i]["name"], arr[i]["tel"]];

        person.salary = (arr[i]["salary"] * selector[selector.selectedIndex].dataset.currRate).toFixed(2);

        for (const key in person) {
            let tempTdEl = document.createElement("td");
            tempTdEl.innerText = person[key];
            tempTrEl.appendChild(tempTdEl);
        }
    }
    button.disabled = false;
}


// конвертер
const indianRupee = 319;
const morrocanDihram = 328;
const uruguayanPeso = 346;
const euro = 292;

let currenciesList = [indianRupee, morrocanDihram, uruguayanPeso, euro];
let currenciesList2 = [{ name: "INR" }, { name: "EUR" }];

// получаем валюту и добавляем опции на страницу
async function getCurrencies(codes) {
    return Promise.all(codes.map(async code => {
        const response = await fetch("http://www.nbrb.by/api/exrates/rates/" + code);
        const data = await response.json();

        const abbr = data.Cur_Abbreviation;
        const rate = (data.Cur_Scale / data.Cur_OfficialRate);

        localStorage.setItem(code, rate);

        return data;
    }));
}


async function addOptions() {
    let tempEl = document.createElement("option"); // BYN
    selector.appendChild(tempEl);
    tempEl.innerText = "BYN";
    tempEl.setAttribute("data-curr-rate", 1);

    let currencies = await getCurrencies(currenciesList);

    for (let i = 0; i < currencies.length; i++) { // Остальные валюты
        tempEl = document.createElement("option");
        selector.appendChild(tempEl);
        tempEl.innerText = currencies[i].Cur_Abbreviation;

        let rate = (currencies[i].Cur_Scale / currencies[i].Cur_OfficialRate);

        tempEl.setAttribute("data-curr-rate", rate);
    }
}

addOptions();

let textEl = document.createElement("p");
let left = document.getElementsByClassName("left")[0];
left.appendChild(textEl);