import DB from './class-db.js';

class Client {

    constructor(obj) {
        if (typeof obj === 'object' && obj !== null) {
            const {id, name, email, phone, company} = obj;
            this.id = id;
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.company = company;
            this.client = obj;
        }
    }

    addClient() {
        const instanceDB = new DB();
        const db = instanceDB.getDB();
        // transaction
        const transaction = db.transaction(['clients'], 'readwrite');
        // object store
        const objectStore = transaction.objectStore('clients');
        // insert data
        objectStore.add(this.client);
        // Redirect
        setTimeout(() => window.location.href = 'index.html', 2000);
    }

    getClients() {
        const instanceDB = new DB();
        setTimeout(() =>{
            const db = instanceDB.getDB();
            let objectStore = db.transaction('clients').objectStore('clients');
            objectStore.openCursor().onsuccess = function(e) {
                const cursor = e.target.result;
                if(cursor) {
                    const {id, name, email, phone, company} = cursor.value;
                    const table = document.querySelector('#listado-clientes')
                    if (table) {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <tr>
                                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                    <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${name} </p>
                                    <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                                </td>
                                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                    <p class="text-gray-700">${phone}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                    <p class="text-gray-600">${company}</p>
                                </td>
                                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                    <a href="edit-client.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                    <a href="#" data-id="${id}" class="text-red-600 hover:text-red-900 btn-delete">Eliminar</a>
                                </td>
                            </tr>
                        `;
                        table.appendChild(row);
                    }
                    cursor.continue();
                } else {
                    console.log('No hay más registros');
                }
            }
        }, 100);
    }

    getClientById(ClientId) {
        const instanceDB = new DB();
        setTimeout(() =>{
            const db = instanceDB.getDB();
            let objectStore = db.transaction('clients').objectStore('clients');
            objectStore.openCursor().onsuccess = function(e) {
                const cursor = e.target.result;
                if(cursor) {
                    if (cursor.value.id == Number(ClientId)) {
                        // Get form
                        const form = document.querySelector('#formulario');
                        if (form) {
                            // Get inputs
                            const inputs = form.querySelectorAll('input:not([type=submit]), textarea');
                            // Set values
                            inputs.forEach(input => input.value = cursor.value[input.id]);
                        }
                    }
                    cursor.continue();
                }
            }
        }, 100);
    }

    updateClient() {
        const instanceDB = new DB();
        const db = instanceDB.getDB();
        // transaction
        const transaction = db.transaction(['clients'], 'readwrite');
        // object store
        const objectStore = transaction.objectStore('clients');
        // insert data
        objectStore.put(this.client);
        // Redirect
        setTimeout(() => window.location.href = 'index.html', 2000);
    }

    deleteClient(ClientId, element) {
        const instanceDB = new DB();

        // Confirm
        const confirm = window.confirm('¿Deseas eliminar este cliente?');
        if (!confirm) return;

        const db = instanceDB.getDB();
        // transaction
        const transaction = db.transaction(['clients'], 'readwrite');
        // object store
        const objectStore = transaction.objectStore('clients');
        // insert data
        objectStore.delete(Number(ClientId));
        // error
        transaction.onerror = function() {
            console.log('Hubo un error');
        }
        // success
        transaction.oncomplete = function() {
            element.parentElement.parentElement.remove();
            // Redirect
            //setTimeout(() => window.location.href = 'index.html', 2000);
        }
    }

}

export default Client;