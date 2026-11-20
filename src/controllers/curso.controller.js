// =====================================================================
// CAPA DE PRESENTACIÓN (controlador)
// Traduce HTTP <-> servicio: lee la petición (params, query, body),
// llama al servicio y arma la respuesta (código de estado + JSON).
// =====================================================================
const cursoService = require('../services/curso.service');
const HttpError = require('../utils/http-error');

function leerId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'El id debe ser un entero positivo');
  return id;
}

// GET /cursos   ·   GET /cursos?semestre=2026-2   ·   GET /cursos?ids=1,3
async function listar(req, res) {
  const filtros = { semestre: req.query.semestre };
  if (req.query.ids) {
    const ids = String(req.query.ids).split(',').map(Number);
    if (ids.some((id) => !Number.isInteger(id) || id <= 0)) {
      throw new HttpError(400, 'El parámetro ids debe ser una lista de enteros separados por comas');
    }
    filtros.ids = ids;
  }
  const cursos = await cursoService.listar(filtros);
  return res.status(200).json(cursos);
}

// GET /cursos/:id
async function obtener(req, res) {
  const curso = await cursoService.obtener(leerId(req));
  return res.status(200).json(curso);
}

// POST /cursos
async function crear(req, res) {
  const nuevo = await cursoService.crear(req.body);
  return res.status(201).location(`${req.baseUrl}/${nuevo.id}`).json(nuevo);
}

// PUT /cursos/:id
async function actualizar(req, res) {
  const actualizado = await cursoService.actualizar(leerId(req), req.body);
  return res.status(200).json(actualizado);
}

// DELETE /cursos/:id
async function eliminar(req, res) {
  await cursoService.eliminar(leerId(req));
  return res.status(204).end();
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
