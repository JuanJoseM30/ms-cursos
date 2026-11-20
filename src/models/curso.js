// =====================================================================
// CAPA DE MODELO (entidad)
// Define qué campos tiene un Curso y qué reglas debe cumplir cada uno.
// =====================================================================

// semestre: 4 dígitos del año, guion, y 1 o 2  →  2026-1, 2026-2
const SEMESTRE_VALIDO = /^\d{4}-[12]$/;

function esTexto(valor) {
  return typeof valor === 'string' && valor.trim() !== '';
}

function validarCurso(datos) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    return ['Se esperaba un objeto JSON con los datos del curso'];
  }
  const errores = [];

  // codigo: texto obligatorio
  if (!esTexto(datos.codigo)) errores.push('codigo es obligatorio y debe ser texto');

  // nombre: texto obligatorio
  if (!esTexto(datos.nombre)) errores.push('nombre es obligatorio y debe ser texto');

  // creditos: entero entre 1 y 6
  if (!Number.isInteger(datos.creditos) || datos.creditos < 1 || datos.creditos > 6) {
    errores.push('creditos es obligatorio y debe ser un entero entre 1 y 6');
  }

  // cupo: entero mayor que 0
  if (!Number.isInteger(datos.cupo) || datos.cupo <= 0) {
    errores.push('cupo es obligatorio y debe ser un entero mayor que 0');
  }

  // semestre: texto con formato AAAA-1 o AAAA-2
  if (typeof datos.semestre !== 'string' || !SEMESTRE_VALIDO.test(datos.semestre.trim())) {
    errores.push('semestre es obligatorio y debe tener el formato AAAA-1 o AAAA-2');
  }

  return errores;
}

// Arma el objeto limpio que se guarda (solo los campos de la entidad)
function construirCurso(datos) {
  return {
    codigo: datos.codigo.trim(),
    nombre: datos.nombre.trim(),
    creditos: datos.creditos,
    cupo: datos.cupo,
    semestre: datos.semestre.trim(),
  };
}

module.exports = { validarCurso, construirCurso };
