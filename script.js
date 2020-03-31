"use strict;"

let selectedLiItems = [];

// кнопка
let button = document.getElementById("button");
button.addEventListener("click", clearTable);

function clearTable() {
    bodyEl.remove();
    bodyEl = document.createElement("tbody");
    tableEl.appendChild(bodyEl);
    button.disabled = true;
}

// создаём таблицу
let tableEl = document.createElement("table");
container.appendChild(tableEl);

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

// Шаг 2: создаём массив работников
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
        id: 7,
        name: "KoliaLead",
        dept_unit_id: 4,
        tel: "123-123-3",
        salary: 2000
    },
    {
        id: 6,
        name: "OliaLead3",
        dept_unit_id: 4,
        tel: "123-123-3",
        salary: 2200
    },
    {
        id: 9,
        name: "SienaTest",
        dept_unit_id: 5,
        tel: "123-123-3",
        salary: 1000
    },
    {
        id: 8,
        name: "LenaTest",
        dept_unit_id: 5,
        tel: "123-123-3",
        salary: 1200
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



// создаём дерево работников
let firstTree = [devDeptHead, devLead, developer, qaDeptHead, qaLead, qaTester];

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


let secondTree = [devDeptHead, qaDeptHead];

// добавляем дерево на страницу
let ulTree = document.getElementById("ul_tree");

// const family = [
//     { id: 0, name: 'GrandFather', parent_id: null },
//     { id: 1, name: 'Father 1', parent_id: 0 },
//     { id: 3, name: 'Father 2', parent_id: 0 },
//     { id: 2, name: 'Son', parent_id: 1 },
//     { id: 4, name: 'Daughter', parent_id: 1 },
// ];

// const itemsTree = getTree(family);

// function getTree(items) {
//     items.forEach(function (child) {
//         // проверяем есть ли у элемента родительский
//         if (child.parent_id !== null) {

//             // если есть, то ищем его в массиве
//             items.forEach(function (parent) {

//                 // когда находим, то...
//                 if (parent.id === child.parent_id) {

//                     // ... проверяем есть ли у него уже массив детей
//                     if (!parent.children) {
//                         // если нет, то создаём
//                         parent.children = [];
//                     }

//                     // ... и потом добавляем ребёнка в этот массив
//                     parent.children.push(child);
//                 }
//             });
//         }
//     });

//     // фильтруем массив так, чтобы у нас остались только корневые элементы
//     return items.filter(item => item.parent_id === null);
// }


traverseTree(secondTree, ulTree);

function traverseTree(elements, parentEl) {
    if (!elements) {
        return;
    }

    elements.forEach(function (el) {
        let liEl = document.createElement('li');
        liEl.innerText = el.name;

        parentEl.appendChild(liEl);

        liEl.setAttribute("data-id", el.id);


        // если у элемента есть дети
        if (el.children) {
            // добавить каретку
            let str = "<span class=" + "caret" + "></span>";
            liEl.innerHTML = str;
            liEl.innerHTML += el.name;

            liEl.classList.add("dept_class");

            let ulEl = document.createElement('ul');

            liEl.appendChild(ulEl);
            ulEl.classList.add("nested");
            traverseTree(el.children, ulEl);
        }
    });
}




// заполнение таблицы
function fillTable(arr) {
    for (let i = 0; i < arr.length; i++) {
        let tempTrEl = document.createElement("tr");
        bodyEl.appendChild(tempTrEl);

        let person = {}; // деструктуризируем
        [person.id, person.name, person.telephone, person.salary] = [arr[i]["id"], arr[i]["name"], arr[i]["tel"], arr[i]["salary"]];

        for (const key in person) {
            let tempTdEl = document.createElement("td");
            tempTdEl.innerText = person[key];
            tempTrEl.appendChild(tempTdEl);
        }
    }

    button.disabled = false;
}

document.addEventListener("click", showItems);

let temp;

function showItems() {
    temp = event.target;
    console.log(temp);

    if (event.target.tagName === "LI") {
        clearTable();
        if (!event.target.classList.contains("dept_class")) {
            let id = +event.target.dataset.id;

            let person = employees.filter(item => item.id === id);

            fillTable(person);
        } else {
            let id = +event.target.dataset.id;

            let persons = employees.filter(item => item.dept_unit_id === id);

            fillTable(persons);
        }
    }

    if (event.target.tagName === "SPAN") {
        event.target.parentElement.childNodes[2].classList.toggle("nested");
        event.target.classList.toggle("caret-down");
    }
}


// управление каретками
// let toggler = document.getElementsByClassName("caret");

// for (let i = 0; i < toggler.length; i++) {
//     toggler[i].addEventListener("click", function () {
//         // this.parentElement.querySelector(".dept_class").classList.toggle("active");
//         this.parentElement.childNodes[2].classList.toggle("nested");
//         this.classList.toggle("caret-down");
//     });
// }