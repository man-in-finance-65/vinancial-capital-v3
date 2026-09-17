// Single source of truth for the inquiry form's field list and allowed values.
// The backend (Apps Script) must be kept in sync with FIELDS — see README.

export const FIELDS = [
  'tipo_financiamiento',
  'servicio_financiero',
  'situacion',
  'monto_solicitado',
  'urgencia',
  'empresa',
  'provincia_estado',
  'industria',
  'sitio_web',
  'tipo_negocio',
  'tiempo_operando',
  'ingresos_anuales',
  'vivienda',
  'codeudor',
  'puntaje_credito',
  'historial_legal',
  'nombre',
  'apellido',
  'correo',
  'telefono',
  'consentimiento',
] as const;

export type FieldName = (typeof FIELDS)[number];

export type TipoFinanciamiento = 'equipo' | 'capital_trabajo';

export const SERVICIO_FINANCIERO_VALUES = [
  'prestamo_equipo',
  'venta_retroarriendo',
  'financiamiento_reparaciones',
  'factoraje',
  'capital_negocio',
  'financiamiento_activos',
  'comercio_internacional',
  'no_seguro',
] as const;
export type ServicioFinanciero = (typeof SERVICIO_FINANCIERO_VALUES)[number];

export const URGENCIA_VALUES = ['esta_semana', '2_4_semanas', '1_3_meses', 'explorando'] as const;
export type Urgencia = (typeof URGENCIA_VALUES)[number];

export const TIPO_NEGOCIO_VALUES = ['propietario_unico', 'sociedad', 'corporacion', 'llc'] as const;
export type TipoNegocio = (typeof TIPO_NEGOCIO_VALUES)[number];

export const VIVIENDA_VALUES = ['propietario', 'rentando', 'comprando'] as const;
export type Vivienda = (typeof VIVIENDA_VALUES)[number];

export const CODEUDOR_VALUES = ['si', 'no', 'tal_vez'] as const;
export type Codeudor = (typeof CODEUDOR_VALUES)[number];

export const PUNTAJE_CREDITO_VALUES = ['700_mas', '650_700', '600_650', '550_600', 'menos_550', 'no_seguro'] as const;
export type PuntajeCredito = (typeof PUNTAJE_CREDITO_VALUES)[number];

export const HISTORIAL_LEGAL_VALUES = ['no', 'si_descargada', 'si_activa'] as const;
export type HistorialLegal = (typeof HISTORIAL_LEGAL_VALUES)[number];

// tipo_financiamiento is required by the backend but never asked directly — it's derived from servicio_financiero.
const EQUIPO_SERVICES: ServicioFinanciero[] = [
  'prestamo_equipo',
  'venta_retroarriendo',
  'financiamiento_reparaciones',
  'financiamiento_activos',
  'no_seguro',
];
const CAPITAL_TRABAJO_SERVICES: ServicioFinanciero[] = ['factoraje', 'capital_negocio', 'comercio_internacional'];

export function deriveTipoFinanciamiento(servicio: ServicioFinanciero | ''): TipoFinanciamiento | '' {
  if (!servicio) return '';
  if (EQUIPO_SERVICES.includes(servicio)) return 'equipo';
  if (CAPITAL_TRABAJO_SERVICES.includes(servicio)) return 'capital_trabajo';
  return '';
}

export const MAX_LENGTHS: Partial<Record<FieldName, number>> = {
  situacion: 2000,
  monto_solicitado: 60,
  empresa: 200,
  provincia_estado: 100,
  industria: 100,
  sitio_web: 200,
  tiempo_operando: 100,
  ingresos_anuales: 60,
  nombre: 100,
  apellido: 100,
  correo: 200,
  telefono: 40,
};

export const PAGINA_MAX_LENGTH = 300;

export type ApplicationData = {
  [K in FieldName]: string;
};

export function emptyApplicationData(): ApplicationData {
  return FIELDS.reduce((acc, field) => {
    acc[field] = '';
    return acc;
  }, {} as ApplicationData);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidationErrors = Partial<Record<FieldName, string>>;

// Mirrors the backend's required-field and allowed-value validation so users see errors before submitting.
export function validateApplication(data: ApplicationData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.nombre.trim()) errors.nombre = 'required';
  if (!data.apellido.trim()) errors.apellido = 'required';
  if (!data.correo.trim() || !EMAIL_RE.test(data.correo.trim())) errors.correo = 'invalid_email';
  if (!data.servicio_financiero) errors.servicio_financiero = 'required';
  if (data.servicio_financiero && !SERVICIO_FINANCIERO_VALUES.includes(data.servicio_financiero as ServicioFinanciero)) {
    errors.servicio_financiero = 'invalid_value';
  }
  if (data.consentimiento !== 'si') errors.consentimiento = 'required';

  if (data.urgencia && !URGENCIA_VALUES.includes(data.urgencia as Urgencia)) errors.urgencia = 'invalid_value';
  if (data.tipo_negocio && !TIPO_NEGOCIO_VALUES.includes(data.tipo_negocio as TipoNegocio)) errors.tipo_negocio = 'invalid_value';
  if (data.vivienda && !VIVIENDA_VALUES.includes(data.vivienda as Vivienda)) errors.vivienda = 'invalid_value';
  if (data.codeudor && !CODEUDOR_VALUES.includes(data.codeudor as Codeudor)) errors.codeudor = 'invalid_value';
  if (data.puntaje_credito && !PUNTAJE_CREDITO_VALUES.includes(data.puntaje_credito as PuntajeCredito)) {
    errors.puntaje_credito = 'invalid_value';
  }
  if (data.historial_legal && !HISTORIAL_LEGAL_VALUES.includes(data.historial_legal as HistorialLegal)) {
    errors.historial_legal = 'invalid_value';
  }

  for (const [field, max] of Object.entries(MAX_LENGTHS) as [FieldName, number][]) {
    if (data[field] && data[field].length > max) {
      errors[field] = 'too_long';
    }
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export const STEP_FIELDS: FieldName[][] = [
  [],
  ['servicio_financiero'],
  ['situacion', 'monto_solicitado', 'urgencia'],
  ['empresa', 'provincia_estado', 'industria', 'sitio_web', 'tipo_negocio', 'tiempo_operando', 'ingresos_anuales'],
  ['vivienda', 'codeudor', 'puntaje_credito', 'historial_legal'],
  ['nombre', 'apellido', 'correo', 'telefono', 'consentimiento'],
];

export function stepForField(field: FieldName): number {
  return STEP_FIELDS.findIndex((fields) => fields.includes(field));
}
