const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1"]);

const app = express();
const port = process.env.PORT || 3001;

const uri = "mongodb+srv://alejandro08:contra1234@examen2.m5nddrb.mongodb.net/?appName=Examen2";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Configuración CORS mejorada
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp); // 👈 Inicializar UNA SOLA VEZ

// CRUD USUARIOS (Firebase + MongoDB Atlas)
app.post('/createUser', async (req, res) => {
    try {
        const { email, password, nombre, apellido, username } = req.body;
        
        console.log('📝 Registrando usuario:', email); // Debug

        // Validación básica
        if (!email || !password || !nombre || !apellido || !username) {
            return res.status(400).send({
                msj: 'Faltan campos requeridos',
                error: 'Todos los campos son obligatorios'
            });
        }

        // Crear el usuario en Firebase
        const firebaseResponse = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUID = firebaseResponse.user.uid;
        
        console.log('✅ Usuario creado en Firebase:', firebaseUID); // Debug

        // Guardar los datos de perfil en MongoDB
        const perfilUsuario = {
            _id: firebaseUID,
            nombre: nombre,
            apellido: apellido,
            username: username,
            email: email,
            fechaRegistro: new Date()
        };

        await client.db("Base").collection('usuarios').insertOne(perfilUsuario);
        
        console.log('✅ Usuario guardado en MongoDB'); // Debug

        res.status(201).send({
            msj: "Usuario creado exitosamente en Firebase y MongoDB",
            idUsuarioMongo: perfilUsuario._id,
            idUsuarioFirebase: firebaseUID
        });

    } catch (e) {
        console.error('❌ Error en createUser:', e); // Debug
        
        // Manejar errores específicos de Firebase
        if (e.code === 'auth/email-already-in-use') {
            return res.status(400).send({
                msj: 'El correo ya está registrado',
                error: e.message
            });
        }
        if (e.code === 'auth/weak-password') {
            return res.status(400).send({
                msj: 'La contraseña es muy débil',
                error: e.message
            });
        }
        
        res.status(500).send({
            msj: 'Hubo un error en el registro',
            error: e.message
        });
    }
});

app.post('/logIn', async (req, res) => {
    try {
        console.log('📥 Intentando login con:', req.body.email); // Debug
        
        const userCredential = await signInWithEmailAndPassword(auth, req.body.email, req.body.password);
        const firebaseUID = userCredential.user.uid;
        
        console.log('✅ Firebase UID obtenido:', firebaseUID); // Debug

        const usuario = await client.db("Base").collection('usuarios').findOne({ _id: firebaseUID });

        if (!usuario) {
            console.log('❌ Usuario no encontrado en MongoDB'); // Debug
            return res.status(404).send({
                msj: 'Usuario no encontrado en la base de datos'
            });
        }

        console.log('✅ Usuario encontrado en MongoDB:', usuario.email); // Debug

        const posts = await client.db("Base").collection('posts')
            .find({ authorId: firebaseUID })
            .toArray();

        // 👇 Asegurarse de que la respuesta tenga el uid
        const response = {
            uid: firebaseUID,  // ✅ Campo requerido
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            posts: posts
        };

        console.log('📤 Enviando respuesta:', response); // Debug

        res.status(200).send(response);

    } catch (e) {
        console.error('❌ Error en login:', e); // Debug
        res.status(500).send({
            msj: 'No lograste entrar sorry :(',
            error: e.message
        });
    }
});

app.post('/logOut', async (req, res) => {
    try {
        await auth.signOut();
        res.status(200).send({
            msj: "Que tengas un lindo dia, hasta luego"
        });
    } catch (e) {
        console.error('❌ Error en logout:', e); // Debug
        res.status(500).send({
            msj: 'No se pudo salir sorry :( ',
            error: e.message
        });
    }
});

// ==========================================
// CRUD POSTS (MongoDB Atlas)
// ==========================================

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
        console.error('❌ Error en createPost:', e); // Debug
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
        console.error('❌ Error en listPost:', e); // Debug
        res.status(500).send({
            msj: 'Error al procesar a la soli',
            posts: e.message
        });
    }
});

app.put('/editPost/:id', async (req, res) => {
    try {
        const filtro = { _id: new ObjectId(req.params.id) };
        const nuevaInfo = {
            $set: {
                "titulo": req.body.titulo,
                "content": req.body.content,
                "authorId": req.body.authorId
            }
        };
        await client.db("Base").collection('posts').updateOne(filtro, nuevaInfo);
        res.status(200).send({
            msj: 'Post actualizado exitosamente'
        });
    } catch (e) {
        console.error('❌ Error en editPost:', e); // Debug
        res.status(500).send({
            msj: 'Error al procesar a la soli',
            posts: e.message
        });
    }
});

app.delete('/deletePost/:id', async (req, res) => {
    try {
        const filtro = { _id: new ObjectId(req.params.id) };
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
        console.error('❌ Error en deletePost:', e); // Debug
        res.status(500).send({
            msj: 'Error al procesar a la soli',
            posts: e.message
        });
    }
});

app.listen(port, async () => {
    console.log('🚀 Servidor activo en el puerto', port);
    try {
        await client.connect();
        await client.db("Base").command({ ping: 1 });
        console.log('✅ Conectado a MongoDB Atlas');
        console.log('✅ Firebase inicializado');
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
    }
});