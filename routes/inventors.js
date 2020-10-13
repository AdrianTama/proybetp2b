const jwt = require('jsonwebtoken')
let express = require('express');
let router = express.Router();
const dataInventor = require('./../data/Inventor');
const { token } = require('morgan');

/* GET listado de inventores */
router.get('/', async function(req, res, next) {
  res.json(await dataInventor.getAllInventors());
});

// GET de un inventor
// /inventors/56
router.get('/:id', async (req,res)=>{
    res.json(await dataInventor.getInventor(req.params.id));
});

// POST alta de un inventor
router.post('/',async  (req,res)=> {
    const inventor = req.body;
    await dataInventor.pushInventor(inventor);
    const inventorPersistido = await dataInventor.getInventor(inventor._id);
    res.json(inventorPersistido);
});

// PUT modificacion de un inventor
router.put('/:id', async (req,res)=>{
    const inventor = req.body;
    inventor._id = req.params.id;
    await dataInventor.updateInventor(inventor);

    res.json(await dataInventor.getInventor(req.params.id));
});

router.delete('/:id', async (req,res)=> {
    await dataInventor.deleteInventor(req.params.id);
    res.send('Inventor eliminado');
});


router.post('/login', (req, res) => {
    const user = {
        id: 1,
        nombre: "Adrian",
        email: "adriantama7@email.com"
    }

    jwt.sign({user: user}, 'secretkey', {expiresIn: '32s'}, (err, token) => {
        res.json({
            token: token
        })
    })

});


router.post("/posts", verifyToken, (req, res) => {

    jwt.verify(req.token, 'secretkey', (error, authData) => {
        if(error){
            res.sendStatus(403);
        } else{
            res.json({
                mensaje: "Post fue creado",
                authData
            });
        }
    });
});

function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization']

    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    } else{
        res.sendStatus(403);
    }
}

module.exports = router;