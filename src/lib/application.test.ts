import { describe, expect, it } from 'vitest';
import { FIELDS, deriveTipoFinanciamiento, emptyApplicationData, validateApplication } from './application';

describe('FIELDS', () => {
  it('matches the backend field list exactly', () => {
    expect(FIELDS).toEqual([
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
    ]);
  });
});

describe('deriveTipoFinanciamiento', () => {
  it('maps equipment-shaped services to "equipo"', () => {
    expect(deriveTipoFinanciamiento('prestamo_equipo')).toBe('equipo');
    expect(deriveTipoFinanciamiento('venta_retroarriendo')).toBe('equipo');
    expect(deriveTipoFinanciamiento('financiamiento_reparaciones')).toBe('equipo');
    expect(deriveTipoFinanciamiento('financiamiento_activos')).toBe('equipo');
    expect(deriveTipoFinanciamiento('no_seguro')).toBe('equipo');
  });

  it('maps working-capital-shaped services to "capital_trabajo"', () => {
    expect(deriveTipoFinanciamiento('factoraje')).toBe('capital_trabajo');
    expect(deriveTipoFinanciamiento('capital_negocio')).toBe('capital_trabajo');
    expect(deriveTipoFinanciamiento('comercio_internacional')).toBe('capital_trabajo');
  });

  it('returns empty string when nothing is picked yet', () => {
    expect(deriveTipoFinanciamiento('')).toBe('');
  });
});

describe('validateApplication', () => {
  it('flags every required field when the form is empty', () => {
    const errors = validateApplication(emptyApplicationData());
    expect(errors.nombre).toBe('required');
    expect(errors.apellido).toBe('required');
    expect(errors.correo).toBe('invalid_email');
    expect(errors.servicio_financiero).toBe('required');
    expect(errors.consentimiento).toBe('required');
  });

  it('passes with a minimal valid submission', () => {
    const data = {
      ...emptyApplicationData(),
      nombre: 'Ana',
      apellido: 'Gómez',
      correo: 'ana@example.com',
      servicio_financiero: 'prestamo_equipo',
      consentimiento: 'si',
    };
    const errors = validateApplication(data);
    expect(errors).toEqual({});
  });

  it('rejects an invalid choice value', () => {
    const data = {
      ...emptyApplicationData(),
      nombre: 'Ana',
      apellido: 'Gómez',
      correo: 'ana@example.com',
      servicio_financiero: 'prestamo_equipo',
      consentimiento: 'si',
      urgencia: 'not_a_real_option',
    };
    const errors = validateApplication(data);
    expect(errors.urgencia).toBe('invalid_value');
  });
});
