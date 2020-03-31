"use strict;"


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
            let str = "<span class=" + "caret" + "></span>";
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


//обработка кликов
document.addEventListener("click", showItems);

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

        person.salary = await getCalculation(arr[i]["salary"]);

        for (const key in person) {
            let tempTdEl = document.createElement("td");
            tempTdEl.innerText = person[key];
            tempTrEl.appendChild(tempTdEl);
        }
    }
    button.disabled = false;
}


// конвертер
let curreniesCodes = [319, 328, 346, 292];

const selector = document.getElementById('selector');
selector.addEventListener("change", getCalculation);


//добавляем опции на страницу
async function addOptions() {
    for (let i = 0; i < curreniesCodes.length; i++) {
        const response = await fetch("http://www.nbrb.by/api/exrates/rates/" + curreniesCodes[i])
        const data = await response.json();

        let tempEl = document.createElement("option");
        selector.appendChild(tempEl);
        tempEl.innerText = data.Cur_Abbreviation;
        tempEl.setAttribute("data-curr-id", curreniesCodes[i]);
    }
}

addOptions();


// вычисляет значение по курсу
async function getCalculation(amount) {
    if (selector.selectedIndex) { // если выбрано не BYN
        const selectedCur = selector.options[selector.selectedIndex].dataset.currId;
        const response = await fetch("http://www.nbrb.by/api/exrates/rates/" + selectedCur)
        const data = await response.json();

        let calculated = (amount * data.Cur_Scale / data.Cur_OfficialRate).toFixed(2);
        return calculated;

    } else {
        return amount;
    }
}