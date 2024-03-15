import DB from './class/class-db.js';
import Validate_Form from './class/class-form.js';
import Client from './class/class-client.js';

// Create DB
const dbInstance = new DB();
dbInstance.createDB();
dbInstance.connectDB();

// Index Page
if (document.querySelector('#listado-clientes')) {
    // Get Clients
    const clients = new Client()
    clients.getClients();

    // Delete Client
    setTimeout(() =>{
        const deleteClient = document.querySelectorAll('.btn-delete');
        deleteClient.forEach(btn => {
            btn.addEventListener('click', (e) => {
                clients.deleteClient(e.target.getAttribute('data-id'), e.target);
            });
        });
    }, 500);
}

// New Client Page
if (document.getElementById('formulario')) {
    const formInstance = new Validate_Form();
    formInstance.init();
}

// Edit Client Page
if (document.getElementById('form-editar')) {
    // get param from url
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const editClient = new Client();
    editClient.getClientById(id);
}