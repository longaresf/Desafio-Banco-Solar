const { Pool } = require('pg');
const axios = require('axios');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "password",
    port: 5432,
    database: "bancosolar",
});

const insertar = async (datos) => {
    const consulta = {
        text:'INSERT INTO usuarios (nombre,balance) VALUES ($1,$2) RETURNING *;',
        values: datos,
    };

    try {
        const result = await pool.query(consulta);
        return result; 
    } catch (error) {
        console.log;
        return error;
    }
};

const consultar = async () => {
    try {
        const result = await pool.query("SELECT * FROM usuarios");
        return result;
    } catch (error) {
        console.log(error.code);
        return error;
    }
};

const editar = async (datos,id) => {
   
    const consulta = {
        text: `UPDATE usuarios SET
                nombre = $1,
                balance = $2
                WHERE id = '${id}' RETURNING *`,
        values: datos,
    };
    
    try {
        const result = await pool.query(consulta);
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
};

const eliminar = async (id) => {
    try {
        const result = await pool.query(
            `
            DELETE FROM transferencias WHERE emisor = ${id} OR receptor = ${id};
            DELETE FROM usuarios WHERE id = '${id}';
            `
        );
        return result;
    } catch (error) {
        console.log(error.code);
        return error;
    }
};   
    

const transferir = async (datos) => {
    
        try {
            // Trae la data desde la ruta usuarios
            const { data } = await axios.get("http://localhost:3000/usuarios");

            // Filtra los datos del emisor según el nombre
            const emisor = data.rows.filter((elemento) => {
                return elemento.nombre == datos[0];
            })

            // Filtra los datos del receptor según el nombre
            const receptor = data.rows.filter((elemento) => {
                return elemento.nombre == datos[1];
            })

            const result = await pool.query(
                `
                BEGIN;
                UPDATE usuarios SET balance = balance - ${datos[2]} WHERE nombre = '${datos[0]}';
                UPDATE usuarios SET balance = balance + ${datos[2]} WHERE nombre = '${datos[1]}';
                INSERT INTO transferencias (emisor,receptor,monto,fecha)
                                VALUES (${emisor[0].id},${receptor[0].id},'${datos[2]}',now());
                COMMIT;
                `
            );
            return result; 
        } catch (error) {
            console.log(error);
            return error;
        }
}

const consultarTransferencias = async () => {
    try {
        const result = await pool.query("SELECT * FROM transferencias");
        return result;
    } catch (error) {
        console.log(error.code);
        return error;
    }
}

// Exportando funciones
module.exports = { insertar,consultar,editar,eliminar,transferir,consultarTransferencias };