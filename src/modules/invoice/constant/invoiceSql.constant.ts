export const COD_TERCERO_SQL = `SELECT cod_ter = MAX(REPLACE(STR(cod_ter+1, 5), SPACE(1), '0')) FROM TERCERO`;

export const COD_FACTURA_SQL = `SELECT cod_factura = COALESCE(MAX(REPLACE(STR(ide_fact_concepto_enc+1, 5), SPACE(1), '0')),1) FROM vup_fact_concepto_escolar_encabezado`;
export const COD_DET_FACTURA_SQL = `SELECT cod_det_factura = COALESCE(MAX(REPLACE(STR(ide_fact_concepto_det, 5), SPACE(1), '0')),0) FROM vup_fact_concepto_escolar_detalle`;

export const INFO_MATRICULA_SQL = `	SELECT
tec_programa_persona.id_programa_persona
,col_matricula.cod_matricula
, col_tipodoc.cod_aux AS cod_doc
, col_tipodoc.siglas AS tipo_doc
, tec_estadomatricula.nom_estadomatricula
, col_persona.ide_persona
, col_persona.ape1_persona
, col_persona.ape2_persona
, col_persona.nom1_persona
, col_persona.nom2_persona
,col_persona.email_persona
,col_persona.cel_persona
, col_colegio.siglas_colegio
, col_colegio.cod_colegio
, col_periodo.nom_periodo
, col_periodo.cod_periodo
, col_nivel_educacion.nom_nivel_educativo
, col_nivel_educacion.cod_nivel_educativo
, col_nivel_educacion.cod_nivel_edu
,SUM(IF(
    col_colegio_asignatura_matricula.cod_estadomateria IN (1, 2, 3, 5)
    AND col_colegio_asignatura_matricula.cod_formaacademica = 1,
    col_colegio_asignatura.nro_creditos,
    0
  )) AS nro_creditos  
  FROM
  col_matricula
  LEFT JOIN col_colegio_asignatura_matricula  
      ON (col_colegio_asignatura_matricula.cod_matricula = col_matricula.cod_matricula)
  INNER JOIN tec_estadomatricula 
      ON (col_matricula.cod_estadomatricula = tec_estadomatricula.cod_estadomatricula)
  INNER JOIN col_persona 
      ON (col_matricula.ide_estudiante = col_persona.ide_persona)
  INNER JOIN tec_programa_persona 
      ON (tec_programa_persona.id_programa_persona = col_matricula.id_programa_persona)
  INNER JOIN col_colegio_periodo 
      ON (col_matricula.cod_colegio_periodo = col_colegio_periodo.cod_colegio_periodo)
  LEFT JOIN col_colegio_asignatura 
      ON (col_colegio_asignatura_matricula.cod_colegio_asignatura = col_colegio_asignatura.cod_colegio_asignatura)
  INNER JOIN col_tipodoc 
      ON (col_persona.tipo_doc = col_tipodoc.tipo_doc)
  INNER JOIN tec_institucion_programa 
      ON (tec_programa_persona.cod_colegio_programa = tec_institucion_programa.cod_colegio_programa)
  INNER JOIN col_nivel_educacion 
      ON (tec_institucion_programa.cod_nivel_educativo = col_nivel_educacion.cod_nivel_educativo)
  INNER JOIN col_colegio 
      ON (col_colegio_periodo.cod_colegio = col_colegio.cod_colegio)
  INNER JOIN col_periodo 
      ON (col_colegio_periodo.cod_periodo = col_periodo.cod_periodo)
            WHERE col_matricula.cod_matricula =?
    GROUP BY col_matricula.cod_matricula
`;

export const INFO_PROGRAMA_SQL = `
SELECT
tec_programa_persona.id_programa_persona,
col_matricula.cod_matricula
, col_tipodoc.cod_aux AS cod_doc
, col_tipodoc.siglas AS tipo_doc
, tec_estadomatricula.nom_estadomatricula
, col_persona.ide_persona
, col_persona.ape1_persona
, col_persona.ape2_persona
, col_persona.nom1_persona
, col_persona.nom2_persona
,col_persona.email_persona
,col_persona.cel_persona
, col_colegio.siglas_colegio
, col_colegio.cod_colegio
, col_periodo.nom_periodo
, col_periodo.cod_periodo
, col_nivel_educacion.nom_nivel_educativo
, col_nivel_educacion.cod_nivel_educativo
, col_nivel_educacion.cod_nivel_edu
, 0 AS nro_creditos  
  FROM
  col_persona 
    INNER JOIN col_tipodoc 
      ON (col_persona.tipo_doc = col_tipodoc.tipo_doc)
    INNER JOIN tec_programa_persona 
      ON (tec_programa_persona.ide_persona  = col_persona.ide_persona)
    INNER JOIN tec_institucion_programa 
      ON (tec_programa_persona.cod_colegio_programa = tec_institucion_programa.cod_colegio_programa) 
    INNER JOIN col_colegio_periodo 
      ON (tec_programa_persona.cod_colegio_periodo = col_colegio_periodo.cod_colegio_periodo)
    INNER JOIN col_nivel_educacion 
      ON (tec_institucion_programa.cod_nivel_educativo = col_nivel_educacion.cod_nivel_educativo)
    LEFT JOIN col_matricula 
      ON (col_matricula.id_programa_persona  = tec_programa_persona.id_programa_persona)
    LEFT JOIN col_colegio_asignatura_matricula  
      ON (col_colegio_asignatura_matricula.cod_matricula = col_matricula.cod_matricula)
    LEFT  JOIN tec_estadomatricula 
      ON (col_matricula.cod_estadomatricula = tec_estadomatricula.cod_estadomatricula)
    LEFT JOIN col_colegio_asignatura 
      ON (col_colegio_asignatura_matricula.cod_colegio_asignatura = col_colegio_asignatura.cod_colegio_asignatura)
    LEFT JOIN col_colegio 
      ON (col_colegio_periodo.cod_colegio = col_colegio.cod_colegio)
    LEFT JOIN col_periodo 
      ON (col_colegio_periodo.cod_periodo = col_periodo.cod_periodo)
    WHERE col_persona.ide_persona=?
    AND tec_programa_persona.id_programa_persona=?
    GROUP BY tec_institucion_programa.cod_colegio_programa`;
