const box = document.querySelector('.box');
const btnAdd = document.querySelector('.btnAdd');
const btnClose = document.querySelector('.btnClose');
const inpSearch = document.querySelector('.searchInp');
const addModal = document.querySelector('.addModal');
const addForm = document.querySelector('.addForm');
const statusFilter = document.querySelector('#statusFilter');
const infoModal = document.querySelector('.infoModal');
const infoTitle = document.querySelector('.infoTitle');
const infoImg = document.querySelector('.infoImg');
const infoPhone = document.querySelector('.infoPhone');
const btnCloseInfo = document.querySelector('.btnCloseInfo');
const editModal = document.querySelector('.editModal');
const editForm = document.querySelector('.editForm');
const editName = editForm.querySelector('.editName');
const editPhone = editForm.querySelector('.editPhone');
const editImg = editForm.querySelector('.editImg');
const btnSaveEdit = document.querySelector('.btnSaveEdit');
const btnCloseEdit = document.querySelector('.btnCloseEdit');

const Api = 'https://66b99baffa763ff550f8d5e8.mockapi.io/apiBack/todo';
let currentTaskId = null;

document.querySelector('.btnCloseEdit').onclick = () => {
    editModal.close();
};

btnAdd.onclick = () => {
    addModal.showModal();
};

btnClose.onclick = () => {
    addModal.close();
};

btnCloseInfo.onclick = () => {
    infoModal.close();
};

btnCloseEdit.onclick = () => {
    editModal.close();
};

async function Get(searchWord = '') {
    try {
        const response = await fetch(searchWord ? `${Api}?name=${searchWord}` : Api);
        const data = await response.json();
        filterData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function filterData(data) {
    const filter = statusFilter.value;
    let filteredData = data;

    if (filter === 'active') {
        filteredData = data.filter(item => item.status === true);
    } else if (filter === 'inactive') {
        filteredData = data.filter(item => item.status === false);
    }

    getData(filteredData);
}

inpSearch.oninput = () => {
    Get(inpSearch.value);
};

statusFilter.onchange = () => {
    Get(inpSearch.value);
};

async function Post(obj) {
    try {
        const response = await fetch(Api, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        });
        if (!response.ok) throw new Error('Failed to create task');
        Get();
    } catch (error) {
        console.error('Error creating task:', error);
    }
}

const EditedTask = async (id, updatedProduct) => {
    try {
        const response = await fetch(`${Api}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
        });
        if (!response.ok) throw new Error('Failed to update task');
        Get();
    } catch (error) {
        console.error('Error updating task:', error);
    }
};

const deleteProduct = async (id) => {
    try {
        await fetch(`${Api}/${id}`, {
            method: 'DELETE',
        });
        Get();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
};

const openEditModal = async (id) => {
    try {
        const response = await fetch(`${Api}/${id}`);
        const product = await response.json();
        currentTaskId = product.id;
        editName.value = product.name;
        editPhone.value = product.phone;
        editImg.value = product.avatar;
        editModal.showModal();
    } catch (error) {
        console.error('Error opening edit modal:', error);
    }
};

btnSaveEdit.onclick = async (event) => {
    event.preventDefault();
    if (currentTaskId === null) return;
    const updatedProduct = {
        name: editName.value,
        phone: editPhone.value,
        avatar: editImg.value,
    };
    await EditedTask(currentTaskId, updatedProduct);
    editModal.close();
    currentTaskId = null;
};

addForm.onsubmit = (event) => {
    event.preventDefault();
    let obj = {
        name: addForm["addName"].value,
        phone: addForm["addPhone"].value,
        avatar: addForm["addImg"].value,
        status: false,
    };
    Post(obj);
    addModal.close();
};

function openInfoModal(element) {
    infoTitle.innerHTML = element.name;
    infoImg.src = element.avatar;
    infoPhone.innerHTML = element.phone;
    infoModal.showModal();
}

function getData(data) {
    box.innerHTML = "";
    data.forEach((element) => {
        const card = document.createElement('div');
        const Name = document.createElement('h1');
        const Phone = document.createElement('p');
        const IMG = document.createElement('img');
        const buttons = document.createElement('div');
        const btnDelete = document.createElement('button');
        const btnEdit = document.createElement('button');
        const checkbox = document.createElement('input');

        checkbox.type = 'checkbox';
        checkbox.checked = element.status;

        if (element.status) {
            Name.classList.add('strikethrough');
        } else {
            Name.classList.remove('strikethrough');
        }

        checkbox.onchange = () => {
            element.status = checkbox.checked;
            EditedTask(element.id, element);

            if (element.status) {
                Name.classList.add('strikethrough');
            } else {
                Name.classList.remove('strikethrough');
            }
        };

        card.classList.add('card');
        Name.textContent = element.name;
        Phone.textContent = element.phone;
        IMG.src = element.avatar;
        btnDelete.textContent = '🗑️';
        btnEdit.textContent = '✏️';

        buttons.classList.add('buttons');
        buttons.append(btnEdit, btnDelete, checkbox);
        card.append(IMG, Name, Phone, buttons);
        box.appendChild(card);

        card.onclick = (event) => {
            if (event.target !== checkbox && event.target !== btnDelete && event.target !== btnEdit) {
                openInfoModal(element);
            }
        };

        btnDelete.onclick = (e) => {
            e.stopPropagation();
            deleteProduct(element.id);
        };
        btnEdit.onclick = (e) => {
            e.stopPropagation();
            openEditModal(element.id);
        };
    });
}

Get();
