import Client from './class-client.js';

class Validate_Form {

    form = null;
    inputs = null;
    send = null;
    instance = null;
    dbInstance = null;
    
    constructor() {
        // Singleton Pattern
        if (typeof Validate_Form.instance === "object") {
            return Validate_Form.instance;
        }

        Validate_Form.instance = this;
    }
    
    init() {
        this.form = document.getElementById('formulario');
        this.inputs = this.form.querySelectorAll('input, textarea'); //input:not([type=submit])
        this.send = this.form.querySelector('input[type="submit"]');
        // Listeners
        this.eventsListener();
    }

    eventsListener() {
        // Loop on inputs to add event listener
        this.inputs.forEach(input => input.addEventListener('blur', this.validate.bind(this)) );
        // Add event listener
        this.send.addEventListener('click', this.sendForm.bind(this));
    }

    validate(e) {
        // Check complete form
        if(!this.checkCompleteForm()) {
            // Disable send button
            this.send.setAttribute('disabled', true);
            this.send.classList.add('opacity-50');
        }

        // Remove error
        this.removeError(e.target);

        // Validate required
        if(e.target.value.trim() === '') {
            // Add error input
            e.target.classList.remove('bg-green-300');
            e.target.classList.add('border-red-600');
            // Show error
            this.showAlert(`The ${e.target.name} field is required`, e.target);
            return;
        }

        // Validate email
        if(e.target.type === 'email' && !this.validateEmail(e.target)) {
            // Add error input
            e.target.classList.remove('bg-green-300');
            e.target.classList.add('border-red-600');
            // Show error
            this.showAlert('The email is not valid', e.target);
            return;
        }

        // Check complete form
        if(this.checkCompleteForm()) {
            // Enable send button
            this.send.removeAttribute('disabled');
            this.send.classList.remove('opacity-50');
        }
    }

    validateEmail(elem) {
        const regex =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ 
        if(!regex.test(elem.value)) return false;
        return true;
    }

    showAlert(message, elem, status = 'error') {
        // Check if there is already an error
        const parent = elem.parentElement;
        if (parent.querySelectorAll('.error-message').length > 0) return;
        // Create notification
        const notif = document.createElement('p');
        notif.textContent = message;
        if (status === 'success') {
            notif.classList.add('text-green-600', 'text-center');
        } else {
            notif.classList.add('error-message','text-red-600','text-right');
        }
        // Insert error before send button in form
        parent.appendChild(notif);
    }

    removeError(elem) {    
        elem.classList.remove('border-red-600');
        elem.classList.add('bg-green-300');
        const parent = elem.parentElement;
        const error = parent.querySelector('.error-message');
        if(error) parent.removeChild(error);
    }

    checkCompleteForm() {
        const errors = this.form.querySelectorAll('.error-message');
        const inputs = this.form.querySelectorAll('input, textarea');
        
        // Check if there are errors
        if(errors.length > 0) return false;

        // Check if there are empty inputs
        const emptyInputs = [...inputs].filter(input => input.value.trim() === '');
        if(emptyInputs.length > 0) return false;

        return true;
    }

    resetForm() {
        // Reset form fields
        this.inputs.forEach(input => input.value = '');
        // Disable send button
        this.send.setAttribute('disabled', true);
        this.send.classList.add('opacity-50');
    }

    sendForm(e) {
        e.preventDefault();
        // Validate form
        if(!this.checkCompleteForm()) return;
        // create object
        const client = {};
        this.inputs.forEach(input => client[input.name] = input.value);
        // Add new client
        if (client.action === 'Add') {
            client.id = Date.now();
            const newClient = new Client(client);
            newClient.addClient();
        } 
        // Update client
        if (client.action === 'Edit') {
            client.id = Number(client.id);
            console.log(client);
            const editClient = new Client(client);
            editClient.updateClient();
        }
        // Hide after 3 seconds
        setTimeout(() => {
            // Show success message
            this.showAlert('The form has been sent successfully', this.form, 'success');
            this.resetForm();
        }, 1000);
    }
}

export default Validate_Form;