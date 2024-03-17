'use strict'
let perPage = 5;
let currentPage = 1;
let totalPage = 0;
const mainUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/';

const tbody = document.querySelector(".tbody");
let roadName;

function renderOrders(orders) { 
    tbody.innerHTML = ''; 
    for (const result of orders) {
        const tr = document.createElement("tr"); 
        tr.id = result.id; 
        roadName = document.createElement("td"); 
        roadName.textContent = result.name; 
        tr.append(roadName); 
        const description = document.createElement("td"); 
        description.textContent = result.description; 
        tr.append(description); 
        const mainObject = document.createElement("td"); 
        mainObject.textContent = result.mainObject;
        tr.append(mainObject); 
        
        const changeBtn = document.createElement('button')
        changeBtn.classList.add('changeBtn');
        changeBtn.textContent = "Выбрать";
        changeBtn.addEventListener("click", event => guidsData(tr, event));
        tr.append(changeBtn);//
        tbody.appendChild(tr);
       
    
    }
}
function searchTable() {
    const input = document.getElementById('tableSearchInput');
    const filter = input.value.toUpperCase();
    const rows = tbody.getElementsByTagName('tr');
    for (let row of rows) {
        let nameColumn = row.getElementsByTagName('td')[0];
        if (nameColumn) {
            let textValue = nameColumn.textContent || nameColumn.innerText;
            if (textValue.toUpperCase().indexOf(filter) > -1) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    }
}

function renderPagination() {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';
    const prevBtn = document.createElement("button");
    prevBtn.classList.add('nextBtn');
    prevBtn.textContent = 'Назад';
    prevBtn.style.margin = '2px';
    prevBtn.style.backgroundColor = 'none';
    prevBtn.addEventListener('click', (event) => {
        if (currentPage > 1) {
            currentPage--;
            getOrgers();
        }
    });
    pagination.append(prevBtn);
    
    for (let i = Math.max(parseInt(currentPage) - 2, 1); i <= Math.min(parseInt(currentPage) + 2, totalPage); i++) {
        const btn = document.createElement('button');
        btn.classList.add('pagBtn')
        btn.textContent = i;
        btn.addEventListener('click', (event)=>{
            const target = event.target;
            currentPage = target.textContent;
            getOrgers();
        });
        if (currentPage == i) {
            btn.style.backgroundColor = 'blue';
        } else {
            btn.style.backgroundColor = 'none';
        }
        
        pagination.append(btn);   }

    const nextBtn = document.createElement("button");
    nextBtn.classList.add('nextBtn');
    nextBtn.textContent = 'Дальше';
    nextBtn.style.margin = '2px';
    nextBtn.style.backgroundColor = 'none';
    nextBtn.addEventListener('click', (event) => {
        if (currentPage < totalPage) {
            currentPage++;
            getOrgers();
        }
    });
    pagination.append(nextBtn);
    
}

function getOrgers() {
    const url = new URL('routes', mainUrl);
    url.searchParams.set('api_key', 'd0dd2a5c-c532-437c-bec9-574507878e08');
    let xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.send();
    xhr.onload = function() {
        const data = JSON.parse(this.response);
        totalPage = Math.ceil(data.length / perPage);
        const start = currentPage * perPage - perPage;
        const end = currentPage * perPage;
        
        for (const order of data) {
            const select = document.querySelector('.form-select');
            for (const elem of splitMainObject(order.mainObject)) {
                const option = document.createElement("option");
                option.textContent = elem;
                select.append(option);
            };}
        renderOrders(data.slice(start, end));
        renderPagination();
    };
    
    xhr.send();


}

function splitMainObject(value) {
    console.log(value.match(/,/g)?.length)
    if (value.match(/,/g)?.length>=value.match(/\./g)?.length && value.match(/,/g)?.length>value.match(/-/g)?.length) {
        return value.split(',');
    }
    if (value.match(/\./g)?.length>value.match(/-/g)?.length && value.match(/\./g)?.length>=value.match(/,/g)?.length) {
        return value.split('.');
    }
        return value.split('-')
}


const tbodyguids = document.querySelector(".tbody-guids")

function guidsData(tr, event) {
    tbodyguids.innerHTML = "";
    const guidsRoad = tr.id;
    const guidesUrl = `/api/routes/${guidsRoad}/guides`;
    const xhr = new XMLHttpRequest();
    const newUrl = new URL(guidesUrl, mainUrl);
    newUrl.searchParams.set('api_key', '463b6c62-dc21-405d-9a9b-0bd1f64a7ffd');
    xhr.open("get", newUrl);
    xhr.onload = function() {
        const records = JSON.parse(xhr.response);
        console.log(guidesUrl);
        for (const record of records) {
            console.log(record);
            addDataGuids(record);
        }
    };
    xhr.send();
}





function addDataGuids(orders) {
    const tr = document.createElement('tr');
    tr.id = orders.id;
    const name = document.createElement('td');
    name.textContent = orders.name;
    tr.append(name);
    const language = document.createElement('td');
    language.textContent = orders.language;
    tr.append(language);
    const workExperience = document.createElement('td');
    workExperience.textContent = orders.workExperience;
    tr.append(workExperience);
    const pricePerHour = document.createElement('td');
    pricePerHour.textContent = `${orders.pricePerHour}₽`;
    tr.append(pricePerHour);
    const gidButton = document.createElement('button')
    gidButton.classList.add('gidButton')
    gidButton.textContent = "Выбрать";
    gidButton.addEventListener("click", event => modal(orders));
    gidButton.setAttribute("data-bs-toggle", "modal")
    gidButton.setAttribute("data-bs-target", "#exampleModal")
    tr.append(gidButton);
    tbodyguids.appendChild(tr)
}


const modalwindow = document.querySelector(".modal-dialog modal-dialog-centered")//
function modal(orders) {
    const name = document.querySelector('.guidname');
    name.textContent = `ФИО гида: ${orders.name}`
    const cost = document.querySelector('.costroad');
    cost.textContent = `Цена прогулки: ${orders.pricePerHour}₽`;
    const btn = document.getElementById('but');
}


window.addEventListener('DOMContentLoaded', getOrgers);