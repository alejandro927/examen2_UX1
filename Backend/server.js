const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//configuracion del dns para el cliente de mongo, para que no se quede buscando el dns de la base de datos
const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1"]);

const app = express();
const port = process.env.PORT || 3001;
// Configuración de la conexión a MongoDB Atlas
const uri = "mongodb+srv://alejandro08:contra1234@examen2.m5nddrb.mongodb.net/?appName=Examen2";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// Configuración de Firebase
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const firebaseConfig = {
    apiKey: "AIzaSyApsFA2ApfmX2eMFThm192OqlrOAmw0lig",
    authDomain: "examen2ux2026.firebaseapp.com",
    projectId: "examen2ux2026",
    storageBucket: "examen2ux2026.firebasestorage.app",
    messagingSenderId: "284615123707",
    appId: "1:284615123707:web:2ec66e459bbf3c9702c65e",
    measurementId: "G-HWXZTN6MPF"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// CRUD Firebase
app.post('/createUser', async (req, res) => {
    try {
        const { email, password, nombre, apellido, username } = req.body;

        // Crear el usuario en Firebase (Solo email y password)
        const auth = getAuth(firebaseApp);
        const firebaseResponse = await createUserWithEmailAndPassword(auth, email, password);

        // Extraemos el UID único que Firebase le asignó
        const firebaseUID = firebaseResponse.user.uid;

        // Guardar los datos de perfil en MongoDB vinculados a ese UID de firebase
        const perfilUsuario = {
            _id: firebaseUID,
            nombre: nombre,
            apellido: apellido,
            username: username,
            email: email,
            fechaRegistro: new Date()
        };

        await client.db("Base").collection('usuarios').insertOne(perfilUsuario);

        res.status(201).send({
            msj: "Usuario creado exitosamente en Firebase y MongoDB",
            idUsuarioMongo: perfilUsuario._id,
            idUsuarioFirebase: firebaseUID
        });

    } catch (e) {
        res.status(500).send({
            msj: 'Hubo un error en el registro',
            error: e.message
        });
    }
});


app.post('/logIn', async (req, res) => {
    try {
        const auth = getAuth(firebaseApp);
        const userCredential = await signInWithEmailAndPassword(auth, req.body.email, req.body.password);
        const firebaseUID = userCredential.user.uid;

        // Buscar usuario en MongoDB usando el UID
        const usuario = await client.db("Base").collection('usuarios').findOne({ _id: firebaseUID });
        
        if (!usuario) {
            return res.status(404).send({
                msj: 'Usuario no encontrado en la base de datos'
            });
        }

        // Buscar posts del usuario
        const posts = await client.db("Base").collection('posts')
            .find({ authorId: firebaseUID })
            .toArray();

        // Response en el formato requerido
        res.status(200).send({
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            posts: posts
        });

    } catch (e) {
        res.status(500).send({
            msj: 'No lograste entrar sorry :(',
            error: e.message
        });
    }
});

app.post('/logOut', async (req, res) => {
    try {
        const auth = getAuth(firebaseApp);
        await auth.signOut();
        res.status(200).send({
            msj: "Que tengas un lindo dia, hasta luego"
        });
    } catch (e) {
        res.status(500).send({
            msj: 'No se pudo salir sorry :( ',
            error: e
        });
    }
});

// CRUD POST
app.post('/createPost', async (req, res) => {
    try {
        const document = {
            titulo: req.body.titulo,
            content: req.body.content,
            authorId: req.body.authorId
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
                "titulo": req.body.titulo,
                "content": req.body.content,
                "authorId": req.body.authorId
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