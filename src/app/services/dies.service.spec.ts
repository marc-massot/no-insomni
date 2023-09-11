import { TestBed } from '@angular/core/testing';

import { DiesService } from './dies.service';

describe('DiesService', () => {
  let service: DiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Percentatge màxim', () => {
    expect(service.calculaPerc(45)).toBe(100);
  });

  it('Percentatge mínim', () => {
    expect(service.calculaPerc(9)).toBe(0);
  });

  it('Percentatge 50%', () => {
    expect(service.calculaPerc(9+18)).toBe(50);
  });

  it('Imatge màxim', () => {
    expect(service.calculaImatge(45)).toBe('assets/face-5.png');
  });

  it('Imatge mínim', () => {
    expect(service.calculaImatge(9)).toBe('assets/face-1.png');
  });

  it('Imatge 50%', () => {
    expect(service.calculaImatge(9+18)).toBe('assets/face-3.png');
  });

  it('From data score mínim', () => {
    let formData =   {
      "01-unicaResposta": 1,
      "02-quanDeTempsHasTrigatAAdormirTe": 1,
      "03-pregunta": 1,
      "04-thasDespertatAbansDeLhabitual": 1,
      "05-quinPercentatgeDelTempsQueEstasAlLlitTelPassesDormint": 1,
      "06-mutiplesRespostes": {
          "heTingutDificultatsPerConciliarElSon": false,
          "heTingutDificultatsPerMantenirMeAdormit": false,
          "heTingutDificultatsPerAcconceguirUnSomniReparador": false,
          "heNotatFatigaOUnaDisminucioDelMeuRendimentSociolaboral": false
      }
    };
    expect(service.calculaScore(formData)).toBe(9);
  });

  it('From data score màxim', () => {
    let formData =   {
      "01-unicaResposta": 5,
      "02-quanDeTempsHasTrigatAAdormirTe": 5,
      "03-pregunta": 5,
      "04-thasDespertatAbansDeLhabitual": 5,
      "05-quinPercentatgeDelTempsQueEstasAlLlitTelPassesDormint": 5,
      "06-mutiplesRespostes": {
          "heTingutDificultatsPerConciliarElSon": true,
          "heTingutDificultatsPerMantenirMeAdormit": true,
          "heTingutDificultatsPerAcconceguirUnSomniReparador": true,
          "heNotatFatigaOUnaDisminucioDelMeuRendimentSociolaboral": true
      }
    };
    expect(service.calculaScore(formData)).toBe(45);
  });
});
