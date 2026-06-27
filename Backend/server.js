// 1. IMPORTACIÓN DE MÓDULOS
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const dns = require("node:dns/promises");

// 2. CONFIGURACIONES E INICIALIZACIÓN
dns.setServers(["1.1.1.1"]);

const app = express(); // <--- ¡ESTO FALTA EN TU CÓDIGO!
const port = process.env.PORT || 3000;

const uri = "mongodb+srv://alejandro08:contra1234@examen2.m5nddrb.mongodb.net/?appName=Examen2";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// 3. MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: true })); // Añadido { extended: true } para evitar avisos de deprecación
app.use(bodyParser.json()); // Recomendado para que tu API pueda leer JSON en req.body
app.use(cors());

// 4. RUTAS (CRUD)

app.post('/createPost', async (req, res) => {
    try {
        const document = {
            titulo: "Mi Segundo Post",
            content: "Este es contenido del post2",
            authorId: "uid-de-firebase-o-mongo"
        };
        const respuesta = await client.db("Base").collection('posts').insertOne(document);

        res.status(201).send({
            msj: "Post creado exitosamente",
            postId: respuesta.insertedId
        });
    } catch (e) {
        res.status(500).send({
            msj: 'No se pudo guardar el registro :( ',
            error: e.message
        });
    }
});

app.get('/listPost', async (req, res) => {
    try {
        const filtro = {};
        const response = await client.db("Base").collection('posts').find(filtro).toArray();
        res.status(200).send({
            msj: 'información encontrada',
            posts: response
        });
    } catch (e) {
        res.status(500).send({
            msj: 'Error al procesar a la soli',
            posts: e.message
        });
    }
});

app.put('/editPost/:id', async (req, res) => {
    try {
        const filtro = {
            _id: new ObjectId(req.params.id)
        };
        const nuevaInfo = {
            $set: {
                "title": "Post actualizado",
                "content": "Nuevo contenido",
                "authorId": "uid-de-firebase-o-mongo"
            }
        };
        const response = await client.db("Base").collection('posts').updateOne(filtro, nuevaInfo);
        res.status(200).send({
            msj: 'Post actualizado exitosamente'
        });
    } catch (e) {
        res.status(500).send({
            msj: 'Error al procesar a la soli',
            posts: e.message
        });
    }
});

app.delete('/deletePost/:id', async (req, res) => {
    try {
        const filtro = {
            _id: new ObjectId(req.params.id)
        };
        const response = await client.db("Base").collection('posts').deleteOne(filtro);

        if (response.deletedCount >= 1) {
            res.status(200).send({
                msj: "Post eliminado exitosamente",
                responseMongo: response
            });
        } else {
            res.status(200).send({
                msj: 'No se elimino el elemento, no hay campos que coincidan con la busqueda',
                responseMongo: response
            });
        }
    } catch (e) {
        res.status(500).send({
            msj: 'Error al procesar a la soli',
            posts: e.message
        });
    }
});


app.listen(port, async () => {
    console.log('Ahora si, el servidor esta activo en el puerto ', port);
    try {
        await client.connect();
        await client.db("Base").command({ ping: 1 });
        console.log('Conectados a la BD!!!!');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
});