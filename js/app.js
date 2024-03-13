import DB from './class/class-db.js';
import Validate_Form from './class/class-form.js';

document.addEventListener('DOMContentLoaded', function () {
    const dbInstance = new DB();
    dbInstance.createDB();
    dbInstance.connectDB();

    // Form
    if (document.getElementById('formulario')) {
        const formInstance = new Validate_Form();
        formInstance.init();
    }
});