class DB {

    DB = null;

    constructor() {
        // Singleton Pattern
        if (typeof DB.instance === "object") {
            return DB.instance;
        }

        DB.instance = this;
    }

    // Crear la base de datos IndexedDB
    createDB() {
        this.DB = window.indexedDB.open('crm', 1);
        this.DB.onerror = function () {
            console.log('Hubo un error');
        };

        this.DB.onupgradeneeded = function (e) {
            const db = e.target.result;
            const objectStore = db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('id', 'id', { unique: true });
                objectStore.createIndex('name', 'name', { unique: false });
                objectStore.createIndex('email', 'email', { unique: true });
                objectStore.createIndex('phone', 'phone', { unique: false });
                objectStore.createIndex('company', 'company', { unique: false });

            console.log('Base de datos lista');
        };
    }

    connectDB() {
        // ABRIR CONEXIÓN EN LA BD:
        let abrirConexion = window.indexedDB.open('crm', 1);

        // si hay un error, lanzarlo
        abrirConexion.onerror = function() {
            console.log('Hubo un error');
        };
    
        // si todo esta bien, asignar a database el resultado
        abrirConexion.onsuccess = function() {
            // guardamos el resultado
            this.DB = abrirConexion.result;
        };
    }

    getDB() {
        return this.DB.result;
    }

    closeDB() {
        this.DB.close();
    }
}

export default DB;