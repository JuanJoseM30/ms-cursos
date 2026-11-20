// =====================================================================
// CAPA DE PRESENTACIÓN (rutas)
// Asocia cada método HTTP + URI con una función del controlador
// y decide qué rutas exigen token y qué roles pueden usarlas.
// =====================================================================
const { Router } = require('express');
const cursoController = require('../controllers/curso.controller');
const { verificarToken, requiereRol } = require('../middlewares/auth');

const router = Router();

// Todas las rutas exigen un token válido (401 si falta, es inválido o venció)
router.use(verificarToken);

// Consultar: cualquier rol autenticado
router.get('/', cursoController.listar);       // listar / ?semestre= / ?ids=
router.get('/:id', cursoController.obtener);   // obtener un curso por id

// Crear, actualizar y eliminar: solo administrador (403 a los demás)
router.post('/', requiereRol('administrador'), cursoController.crear);
router.put('/:id', requiereRol('administrador'), cursoController.actualizar);
router.delete('/:id', requiereRol('administrador'), cursoController.eliminar);

module.exports = router;
