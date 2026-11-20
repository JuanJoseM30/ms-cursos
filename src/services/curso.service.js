// =====================================================================
// CAPA DE SERVICIO (lógica de negocio)
// Aplica las validaciones y las reglas del negocio.
// No sabe nada de HTTP (req/res) ni de cómo se guardan los datos.
// =====================================================================
const repo = require('../repositories/curso.repository');
const { validarCurso, construirCurso } = require('../models/curso');
const HttpError = require('../utils/http-error');

async function listar(filtros) {
  return repo.findAll(filtros);
}

async function obtener(id) {
  const curso = await repo.findById(id);
  if (!curso) throw new HttpError(404, `No existe el curso con id ${id}`);
  return curso;
}

async function crear(datos) {
  const errores = validarCurso(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);

  const curso = construirCurso(datos);

  // Regla de negocio (409): no puede haber dos cursos con el mismo codigo
  if (await repo.findByCodigo(curso.codigo)) {
    throw new HttpError(409, `Ya existe un curso con el codigo ${curso.codigo}`);
  }

  return repo.create(curso);
}

async function actualizar(id, datos) {
  const errores = validarCurso(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);

  const curso = construirCurso(datos);

  // 404 primero: si el curso no existe, no tiene sentido revisar el codigo
  if (!(await repo.findById(id))) throw new HttpError(404, `No existe el curso con id ${id}`);

  // Regla de negocio (409): el codigo no puede pertenecer a OTRO curso
  const otro = await repo.findByCodigo(curso.codigo);
  if (otro && otro.id !== id) {
    throw new HttpError(409, `Ya existe otro curso con el codigo ${curso.codigo}`);
  }

  return repo.update(id, curso);
}

async function eliminar(id) {
  const eliminado = await repo.remove(id);
  if (!eliminado) throw new HttpError(404, `No existe el curso con id ${id}`);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
