export interface IEnrollment extends IStudent {
  cod_matricula: number;
  cod_doc: number | null;
  tipo_doc: string | null;
  nom_estadomatricula: string;
  ide_persona: string;
  ape1_persona: string;
  ape2_persona: string | null;
  nom1_persona: string;
  nom2_persona: string | null;
  email_persona: string | null;
  cel_persona: string | null;
  siglas_colegio: string;
  cod_colegio: number;
  nom_periodo: string;
  cod_periodo: number;
  nom_nivel_educativo: string;
  cod_nivel_educativo: number;
  cod_nivel_edu: number;
  id_programa_persona?: number;
  nro_creditos: number;
}

export interface IStudent {
  cod_matricula: number | null; // 77289,
  cod_doc: number; // 1,
  tipo_doc: string; // "CC",
  nom_estadomatricula: string | null; // "ADMITIDO",
  ide_persona: string; // "1124863016",
  ape1_persona: string; // "LOZADA",
  ape2_persona: string; // "ALVAREZ",
  nom1_persona: string; // "JORGE",
  nom2_persona: string; // "EDUARDO",
  email_persona: string; // "jorgelozadalvarez@gmail.com",
  cel_persona: string; // "3228410122",
  siglas_colegio: string; // "ITP-MOCOA",
  cod_colegio: number; // "1",
  nom_periodo: string; // "2023-2",
  cod_periodo: number; // 43,
  nom_nivel_educativo: string; // "TECNOLOGIA EN OBRAS CIVILES",
  cod_nivel_educativo: number; // 30,
  cod_nivel_edu: number; // 6,
  nro_creditos: number | null; // 6,

  ide_genero: string; // "M",
  cod_municipio: string; // "86001",
  dir_persona: string; // "C6"
}

export interface IInfoInvoice {
  info_cliente: IStudent | IEnrollment;
}

export interface IPensumSubjects {
  id_programa_persona: number;
  cod_colegio_asignatura: number;
  ide_persona: string;
  cod_planestudios: number;
  cod_curso: number;
  cod_asignatura: number;
  nom_asignatura: string;
}

export interface IPensumSubjectsStudent extends IPensumSubjects {
  cod_matricula: number;
  cod_estadomateria: number;
  nom_estadomateria: string;
  estudiante_nuevo: string;
  fechaini_matord: Date;
  fechafin_matord: Date;
  mat_ordinaria: string;
}

export interface IStudentType {
  codigo: number;
  descripcion: string;
  fechaInicioMatricula: Date;
  fechaFinMatricula: Date;
  fechaInicioMatriculaExt: Date;
  fechaFinMatriculaExt: Date;
  fecIniInsNuevos:Date;
  fecFinInsNuevos:Date;
}
