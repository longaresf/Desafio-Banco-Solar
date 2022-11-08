const http = require('http');
const url = require('url');
const fs = require('fs');
const { insertar,consultar,editar,eliminar,transferir,consultarTransferencias } = require('./consultas');

// Crear servidor
http
    .createServer( async (req,res) => {

        // Ruta raíz
        if( req.url == '/' && req.method == 'GET') {
            res.setHeader('content-type','text/html');
            const html = fs.readFileSync('index.html','utf8');
            res.end(html);
        }

        // Ruta POST de url = '/usuario'
        if ( req.url == '/usuario' && req.method == 'POST') {
            let body= '';
            
            req.on('data',(chunk) => {
                body += chunk;
            })

            req.on('end', async () => {
                const datos = Object.values(JSON.parse(body));
                const respuesta = await insertar(datos);
                res.end(JSON.stringify(respuesta,null,1));
            })
        }

        // Ruta GET de url = '/usuarios'
        if (req.url == "/usuarios" && req.method === "GET") {
            const registros = await consultar();
            res.end(JSON.stringify(registros,null,1));
        }

        // Ruta PUT de url = '/usuario'
        if (req.url.startsWith('/usuario?') && req.method == "PUT") {

            const { id } = url.parse(req.url,true).query;
            let body = "";
            
            req.on("data", (chunk) => {
                body += chunk;
            });

            req.on("end", async () => {
                const datos = Object.values(JSON.parse(body));
                const respuesta = await editar(datos,id);
                res.end(JSON.stringify(respuesta));
            });
        }

        // Ruta DELETE de url = '/usuario'
        if (req.url.startsWith("/usuario?") && req.method == "DELETE") {
            const { id } = url.parse(req.url, true).query;
            const respuesta = await eliminar(id);
            res.end(JSON.stringify(respuesta));
        }
            
        // Ruta POST de url = '/transferencia'
        if (req.url == '/transferencia' && req.method == 'POST') {
            let body= '';
            
            req.on('data',(chunk) => {
                body += chunk;
            })

            req.on('end', async () => {
                const datos = Object.values(JSON.parse(body));
                const respuesta = await transferir(datos);
                res.end(JSON.stringify(respuesta,null,1));
            })    
        }

        // Ruta GET de url = '/tranferencias'
        if (req.url == "/transferencias" && req.method == "GET") {
            const registros = await consultarTransferencias();
            res.end(JSON.stringify(registros,null,1));
        }
            
    })
    .listen(3000,()=>console.log(`Server running on port 3000 and PID: ${process.pid}`));