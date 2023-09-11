import { Injectable } from '@angular/core';
import { Dia, Dies, Setmana } from '../data/dies';

@Injectable({
  providedIn: 'root'
})
export class DiesService {

  private data: Dies;

  constructor() {
    this.data = this.getData();
    this.storeData();
  }

  public saveNouDia(formData: any) {
    console.log("Saving form data...", formData);
    let avui = this.avui();
    this.data.dies = this.data.dies.filter(a => a.dia != avui);
    let puntuacio = this.calculaScore(formData);
    this.data.dies.push({ dia: avui, data: formData, score: puntuacio });
    this.storeData();
  }

  public quantsDies(): number {
    return this.data.dies.length;
  }

  public minDia(): string {
    return this.data.dies.reduce((min, el) => min > el.dia ? el.dia : min, "9999-99-99");
  }

  public maxDia(): string {
    return this.data.dies.reduce((max, el) => max < el.dia ? el.dia : max, "0000-00-00");
  }

  public existeixAvui(): boolean {
    let avui = this.avui();
    let dia = this.data.dies.find(a => a.dia == avui);
    return !!dia;
  }

  public getDia(dia: string): Dia | undefined {
    return this.data.dies.find(a => a.dia == dia);
  }

  public getSeguentDia(dia: string): string | undefined {
    return this.data.dies.reduce((next: string | undefined,ac: Dia): string | undefined => ac.dia>dia? (!next? ac.dia : ac.dia<next? ac.dia : next): next, undefined);
  }

  public getAnteriorDia(dia: string): string | undefined {
    return this.data.dies.reduce((prev: string | undefined,ac: Dia): string | undefined => ac.dia<dia? (!prev? ac.dia : ac.dia>prev? ac.dia: prev): prev, undefined);
  }

  public avgScore(): number {
    if (this.data.dies.length == 0) return 0;
    let sum = this.data.dies.reduce((ac, el) => ac + el.score, 0);
    return sum / this.data.dies.length;
  }

  public getSetmana(quina: number = 0): Setmana {
    let ret: any = {};
    let dia: Date = new Date();
    dia.setTime(new Date().getTime() + quina * 7 * 24 * 60 * 60 * 1000);
    let weekDay = dia.getDay(); // Sunday: 0 Monday: 1 ... Saturday: 6
    weekDay = weekDay == 0 ? 7 : weekDay;
    let dl = new Date(dia.getTime() - (weekDay - 1) * 24 * 60 * 60 * 1000);
    let dies = ['dl', 'dm', 'dc', 'dj', 'dv', 'ds', 'dg'];
    for (let i = 0; i < 7; i++) {
      let it = new Date(dl.getTime() + i * 24 * 60 * 60 * 1000);
      let ds = it.toJSON().slice(0, 10);
      let el = this.data.dies.find(d => d.dia == ds);
      ret[dies[i]] = el ? el : { dia: ds, score: 0 };
    }
    return ret as Setmana;
  }

  private indexos(formData: any): any {
    let ret:any = {};
    for(const property in formData) {
      ret[property.slice(0,2)] = property;
    }
    return ret;
  }

  public calculaScore(formData: any): number {
    const indexos: any = this.indexos(formData)
    let ret = formData[indexos['01']];
    ret += formData[indexos['02']];
    ret += formData[indexos['03']];
    ret += formData[indexos['04']];
    ret += formData[indexos['05']];
    const valors6 = formData[indexos['06']];
    for(const el in valors6) {
      ret += !!valors6[el]?5:1;
    } 
    return ret;
  }

  public maxScore: number = 45;
  public minScore:number = 9;
  
  public calculaImatge(val: number): string {
    if (val<9) return 'assets/face-'.concat(val.toString()).concat('.png');
    const divisor = (this.maxScore - this.minScore +1) / 5;
    let val1_5 = Math.trunc((val -this.minScore)/divisor)+1;
    return 'assets/face-'.concat(val1_5.toString()).concat('.png')
  }

  public calculaPerc(val: number) {
    return (val-this.minScore)*100/(this.maxScore-this.minScore);
  }

  public avui(): string {
    return new Date().toJSON().slice(0, 10);
  }

  private getData(): Dies {
    let object = localStorage.getItem("dies");
    if (object) return JSON.parse(object) as Dies;
    return { dies: [] };
  }

  private storeData() {
    console.log("storing dies...", this.data);
    localStorage.setItem("dies", JSON.stringify(this.data));
  }

  public getInputsIValors(): any {
    return this.getFormulari().components
      .reduce((l: any[], e: any) => l.concat(e.components), [])
      .reduce((c: any, e: any) => {
        c[e.key] = {
          "label": e.label,
          "values": (e.values ? e.values.reduce((obj: any, el: any) => {
            obj[el.value] = el.label;
            return obj;
          }, {}) : undefined)
        };
        return c;
      }, {});
  }

  public getFormulari(): any {
    return {
      "display": "wizard",
      "components": [
        {
          "title": "p1",
          "breadcrumbClickable": true,
          "buttonSettings": {
            "previous": true,
            "cancel": false,
            "next": true
          },
          "navigateOnEnter": false,
          "saveOnEnter": false,
          "scrollToTop": false,
          "collapsible": false,
          "key": "P1",
          "type": "panel",
          "label": "Page 2",
          "components": [
            {
              "label": "Com de satisfet estàs amb el teu son?",
              "optionsLabelPosition": "right",
              "inline": false,
              "tableView": false,
              "values": [
                {
                  "label": "Molt satisfet",
                  "value": "1",
                  "shortcut": ""
                },
                {
                  "label": "Satisfet",
                  "value": "2",
                  "shortcut": ""
                },
                {
                  "label": "Mig",
                  "value": "3",
                  "shortcut": ""
                },
                {
                  "label": "Insatisfet",
                  "value": "4",
                  "shortcut": ""
                },
                {
                  "label": "Molt insatisfet",
                  "value": "5",
                  "shortcut": ""
                }
              ],
              "validate": {
                "required": true
              },
              "key": "01-comDeSatisfetEstas",
              "type": "radio",
              "input": true,
              "defaultValue": 1
            }
          ],
          "input": false,
          "tableView": false
        },
        {
          "title": "p2",
          "breadcrumbClickable": true,
          "buttonSettings": {
            "previous": true,
            "cancel": false,
            "next": true
          },
          "navigateOnEnter": false,
          "saveOnEnter": false,
          "scrollToTop": false,
          "collapsible": false,
          "key": "page7",
          "type": "panel",
          "label": "Page 7",
          "components": [
            {
              "label": "Quan de temps has trigat a adormir-te?",
              "optionsLabelPosition": "right",
              "inline": false,
              "tableView": false,
              "values": [
                {
                  "label": "0-15 minuts",
                  "value": "1",
                  "shortcut": ""
                },
                {
                  "label": "16-30 minuts",
                  "value": "2",
                  "shortcut": ""
                },
                {
                  "label": "31-45 minuts",
                  "value": "3",
                  "shortcut": ""
                },
                {
                  "label": "46-60 minuts",
                  "value": "4",
                  "shortcut": ""
                },
                {
                  "label": "mes de 60 minuts",
                  "value": "5",
                  "shortcut": ""
                }
              ],
              "validate": {
                "required": true
              },
              "key": "02-quanDeTempsHasTrigatAAdormirTe",
              "type": "radio",
              "input": true,
              "defaultValue": 1
            }
          ],
          "input": false,
          "tableView": false
        },
        {
          "title": "p3",
          "breadcrumbClickable": true,
          "buttonSettings": {
            "previous": true,
            "cancel": false,
            "next": true
          },
          "navigateOnEnter": false,
          "saveOnEnter": false,
          "scrollToTop": false,
          "collapsible": false,
          "key": "page4",
          "type": "panel",
          "label": "Page 4",
          "components": [
            {
              "label": "Quantes vegades t&apos;has despertat durant la nit?",
              "optionsLabelPosition": "right",
              "inline": false,
              "tableView": false,
              "values": [
                {
                  "label": "Cap",
                  "value": "1",
                  "shortcut": ""
                },
                {
                  "label": "1 vegada",
                  "value": "2",
                  "shortcut": ""
                },
                {
                  "label": "2 vegades",
                  "value": "3",
                  "shortcut": ""
                },
                {
                  "label": "3 vegades",
                  "value": "4",
                  "shortcut": ""
                },
                {
                  "label": "mes de 3 vegades",
                  "value": "5",
                  "shortcut": ""
                }
              ],
              "validate": {
                "required": true
              },
              "key": "03-pregunta",
              "type": "radio",
              "input": true,
              "defaultValue": 1
            }
          ],
          "input": false,
          "tableView": false
        },
        {
          "title": "P4",
          "breadcrumbClickable": true,
          "buttonSettings": {
            "previous": true,
            "cancel": false,
            "next": true
          },
          "navigateOnEnter": false,
          "saveOnEnter": false,
          "scrollToTop": false,
          "collapsible": false,
          "key": "page8",
          "type": "panel",
          "label": "Page 8",
          "components": [
            {
              "label": "T&apos;has despertat abans de l&apos;habitual?",
              "optionsLabelPosition": "right",
              "inline": false,
              "tableView": false,
              "defaultValue": 1,
              "values": [
                {
                  "label": "No",
                  "value": "1",
                  "shortcut": ""
                },
                {
                  "label": "30 minuts abans",
                  "value": "2",
                  "shortcut": ""
                },
                {
                  "label": "1 hora abans",
                  "value": "3",
                  "shortcut": ""
                },
                {
                  "label": "1-2 hores abans",
                  "value": "4",
                  "shortcut": ""
                },
                {
                  "label": "mes de 2 hores abans",
                  "value": "5",
                  "shortcut": ""
                }
              ],
              "validate": {
                "required": true
              },
              "key": "04-thasDespertatAbansDeLhabitual",
              "type": "radio",
              "input": true
            }
          ],
          "input": false,
          "tableView": false
        },
        {
          "title": "p5",
          "breadcrumbClickable": true,
          "buttonSettings": {
            "previous": true,
            "cancel": false,
            "next": true
          },
          "navigateOnEnter": false,
          "saveOnEnter": false,
          "scrollToTop": false,
          "collapsible": false,
          "key": "page9",
          "type": "panel",
          "label": "Page 9",
          "components": [
            {
              "label": "Quin percentatge del temps que estàs al llit te&apos;l passes dormint ",
              "optionsLabelPosition": "right",
              "inline": false,
              "tableView": false,
              "values": [
                {
                  "label": "100-91%",
                  "value": "1",
                  "shortcut": ""
                },
                {
                  "label": "90-81%",
                  "value": "2",
                  "shortcut": ""
                },
                {
                  "label": "80-71%",
                  "value": "3",
                  "shortcut": ""
                },
                {
                  "label": "70-61%",
                  "value": "4",
                  "shortcut": ""
                },
                {
                  "label": "60% o menys",
                  "value": "5",
                  "shortcut": ""
                }
              ],
              "validate": {
                "required": true
              },
              "key": "05-quinPercentatgeDelTempsQueEstasAlLlitTelPassesDormint",
              "type": "radio",
              "input": true,
              "defaultValue": 1
            }
          ],
          "input": false,
          "tableView": false
        },
        {
          "title": "p6",
          "breadcrumbClickable": true,
          "buttonSettings": {
            "previous": true,
            "cancel": false,
            "next": true
          },
          "navigateOnEnter": false,
          "saveOnEnter": false,
          "scrollToTop": false,
          "collapsible": false,
          "key": "page1",
          "type": "panel",
          "label": "Page 1",
          "components": [
            {
              "label": "Selecciona en cas afirmatiu:",
              "optionsLabelPosition": "right",
              "tableView": false,
              "defaultValue": {
                "opcio1": false,
                "opcio2": false,
                "opcio3": false,
                "opcio4": false,
                "heTingutDificultatsPerConciliarElSon": false,
                "heTingutDificultatsPerMantenirMeAdormit": false,
                "heTingutDificultatsPerAcconceguirUnSomniReparador": false,
                "heNotatFatigaOUnaDisminucioDelMeuRendimentSociolaboral": false
              },
              "values": [
                {
                  "label": "He tingut dificultats per conciliar el son",
                  "value": "heTingutDificultatsPerConciliarElSon",
                  "shortcut": ""
                },
                {
                  "label": "He tingut dificultats per mantenir-me adormit",
                  "value": "heTingutDificultatsPerMantenirMeAdormit",
                  "shortcut": ""
                },
                {
                  "label": "He tingut dificultats per aconseguir un somni reparador",
                  "value": "heTingutDificultatsPerAcconceguirUnSomniReparador",
                  "shortcut": ""
                },
                {
                  "label": "He notat fatiga o una disminució del meu rendiment sociolaboral",
                  "value": "heNotatFatigaOUnaDisminucioDelMeuRendimentSociolaboral",
                  "shortcut": ""
                }
              ],
              "key": "06-comHeDormit",
              "type": "selectboxes",
              "input": true,
              "inputType": "checkbox"
            }
          ],
          "input": false,
          "tableView": false
        },
        {
          "title": "p7",
          "breadcrumbClickable": true,
          "buttonSettings": {
            "previous": true,
            "cancel": false,
            "next": true
          },
          "navigateOnEnter": false,
          "saveOnEnter": false,
          "scrollToTop": false,
          "collapsible": false,
          "key": "page5",
          "type": "panel",
          "label": "Page 5",
          "components": [
            {
              "label": "Introdueix l&apos;hora que t&apos;has aixecat",
              "inputMask": "99:99",
              "displayMask": "99:99",
              "applyMaskOn": "change",
              "tableView": true,
              "key": "07-introdueixLhoraQueThasAixecat",
              "type": "textfield",
              "input": true
            },
            {
              "label": "Introdueix l&apos;hora que has anat a dormir",
              "inputMask": "99:99",
              "displayMask": "99:99",
              "applyMaskOn": "change",
              "tableView": true,
              "key": "08-introdueixLHoraQueTHasAixecat",
              "type": "textfield",
              "input": true
            }
          ],
          "input": false,
          "tableView": false
        },
        {
          "title": "p9",
          "breadcrumbClickable": true,
          "buttonSettings": {
            "previous": true,
            "cancel": false,
            "next": true
          },
          "navigateOnEnter": false,
          "saveOnEnter": false,
          "scrollToTop": false,
          "collapsible": false,
          "key": "page10",
          "type": "panel",
          "label": "Page 10",
          "input": false,
          "tableView": false,
          "components": [
            {
              "label": "Quins grups d&apos;aliments has consumit per sopar?",
              "optionsLabelPosition": "right",
              "tableView": false,
              "defaultValue": {
                "llegums": false,
                "lactics": false,
                "fruita": false,
                "verdura": false,
                "carn": false,
                "peix": false,
                "productesEnsucrats": false,
                "cereals": false,
                "res": false
              },
              "values": [
                {
                  "label": "Llegums",
                  "value": "llegums",
                  "shortcut": ""
                },
                {
                  "label": "Làctics",
                  "value": "lactics",
                  "shortcut": ""
                },
                {
                  "label": "Fruita",
                  "value": "fruita",
                  "shortcut": ""
                },
                {
                  "label": "Verdura",
                  "value": "verdura",
                  "shortcut": ""
                },
                {
                  "label": "Carn",
                  "value": "carn",
                  "shortcut": ""
                },
                {
                  "label": "Peix",
                  "value": "peix",
                  "shortcut": ""
                },
                {
                  "label": "Productes ensucrats",
                  "value": "productesEnsucrats",
                  "shortcut": ""
                },
                {
                  "label": "Cereals",
                  "value": "cereals",
                  "shortcut": ""
                },
                {
                  "label": "No he sopat",
                  "value": "res",
                  "shortcut": ""
                }
              ],
              "key": "09-quinsGrupsDalimentsHasConsumitPerSopar",
              "type": "selectboxes",
              "input": true,
              "inputType": "checkbox"
            }
          ]
        },
        {
          "title": "p10",
          "breadcrumbClickable": true,
          "buttonSettings": {
            "previous": true,
            "cancel": false,
            "next": true
          },
          "navigateOnEnter": false,
          "saveOnEnter": false,
          "scrollToTop": false,
          "collapsible": false,
          "key": "page11",
          "type": "panel",
          "label": "Page 11",
          "input": false,
          "tableView": false,
          "components": [
            {
              "label": "Quan temps has tardat en anar a dormir després de sopar?",
              "optionsLabelPosition": "right",
              "inline": false,
              "tableView": false,
              "values": [
                {
                  "label": "menys de 15 minuts",
                  "value": "menysDe15Minuts",
                  "shortcut": ""
                },
                {
                  "label": "15-30 minuts",
                  "value": "1530Minuts",
                  "shortcut": ""
                },
                {
                  "label": "30 minuts a 1 hora",
                  "value": "30MinutsA1Hora",
                  "shortcut": ""
                },
                {
                  "label": "1 a 2 hores",
                  "value": "1A2Hores",
                  "shortcut": ""
                },
                {
                  "label": "mes de 2 hores",
                  "value": "mesDe2Hores",
                  "shortcut": ""
                },
                {
                  "label": "No he sopat",
                  "value": "noHeSopat",
                  "shortcut": ""
                }
              ],
              "key": "10-quanTempsHasTardatEnAnarADormirDespresDeSopar",
              "type": "radio",
              "input": true,
              "defaultValue": "menysDe15Minuts"
            }
          ]
        },
        {
          "title": "p11",
          "breadcrumbClickable": true,
          "buttonSettings": {
            "previous": true,
            "cancel": false,
            "next": true
          },
          "navigateOnEnter": false,
          "saveOnEnter": false,
          "scrollToTop": false,
          "collapsible": false,
          "key": "page12",
          "type": "panel",
          "label": "Page 12",
          "input": false,
          "tableView": false,
          "components": [
            {
              "label": "Has fet esport durant el dia?",
              "optionsLabelPosition": "right",
              "inline": false,
              "tableView": false,
              "values": [
                {
                  "label": "No",
                  "value": "no",
                  "shortcut": ""
                },
                {
                  "label": "Sí, de baixa intensitat",
                  "value": "siDeBaixaIntensitat",
                  "shortcut": ""
                },
                {
                  "label": "Sí, d&apos;intensitat moderada",
                  "value": "siDintensitatModerada",
                  "shortcut": ""
                },
                {
                  "label": "Sí, d&apos;alta intensitat",
                  "value": "siDaltaIntensitat",
                  "shortcut": ""
                }
              ],
              "key": "11-hasFetEsportDurantElDia",
              "type": "radio",
              "input": true,
              "defaultValue": "no"
            }
          ]
        },
        {
          "title": "p12",
          "breadcrumbClickable": true,
          "buttonSettings": {
            "previous": true,
            "cancel": false,
            "next": true
          },
          "navigateOnEnter": false,
          "saveOnEnter": false,
          "scrollToTop": false,
          "collapsible": false,
          "key": "page13",
          "type": "panel",
          "label": "Page 13",
          "components": [
            {
              "label": "Selecciona la durada de l&apos;activitat física?",
              "optionsLabelPosition": "right",
              "inline": false,
              "tableView": false,
              "values": [
                {
                  "label": "menys de 15 minuts",
                  "value": "menysDe15Minuts",
                  "shortcut": ""
                },
                {
                  "label": "15-30 minuts",
                  "value": "1530Minuts",
                  "shortcut": ""
                },
                {
                  "label": "30 minuts a 1 hora",
                  "value": "30MinutsA1Hora",
                  "shortcut": ""
                },
                {
                  "label": "1-2 hores",
                  "value": "12Hores",
                  "shortcut": ""
                },
                {
                  "label": "més de 2 hores",
                  "value": "mesDe2Hores",
                  "shortcut": ""
                },
                {
                  "label": "No he fet esport",
                  "value": "noHeFetEsport",
                  "shortcut": ""
                }
              ],
              "key": "12-seleccionaLaDuradaDeLactivitatFisica",
              "type": "radio",
              "input": true,
              "defaultValue": "menysDe15Minuts"
            }
          ],
          "input": false,
          "tableView": false
        },
        {
          "title": "Page 13",
          "buttonSettings": {
            "previous": true,
            "cancel": false,
            "next": true
          },
          "label": "Page 13",
          "type": "panel",
          "key": "page14",
          "components": [
            {
              "label": "Has près alguna medicació durant el dia?",
              "optionsLabelPosition": "right",
              "tableView": false,
              "values": [
                {
                  "label": "No",
                  "value": "no",
                  "shortcut": ""
                },
                {
                  "label": "Analgessics",
                  "value": "analgessics",
                  "shortcut": ""
                },
                {
                  "label": "Antiácids i/o antiulcerosos",
                  "value": "antiacidsIOAntiulcerosos",
                  "shortcut": ""
                },
                {
                  "label": "Antialérgics",
                  "value": "antialergics",
                  "shortcut": ""
                },
                {
                  "label": "Antidiarreics i/o laxants",
                  "value": "antidiarreicsIOLaxants",
                  "shortcut": ""
                },
                {
                  "label": "Antiinfecciosos",
                  "value": "antiinfecciosos",
                  "shortcut": ""
                },
                {
                  "label": "Antiinflamatoris",
                  "value": "antiinflamatoris",
                  "shortcut": ""
                },
                {
                  "label": "Antipirètics",
                  "value": "antipiretics",
                  "shortcut": ""
                },
                {
                  "label": "Antitussius i/o mucolítics",
                  "value": "antitussiusIOMucolitics",
                  "shortcut": ""
                },
                {
                  "label": "Altres",
                  "value": "altres",
                  "shortcut": ""
                }
              ],
              "key": "13-hasPresAlgunaMedicacioDurantElDia",
              "type": "selectboxes",
              "input": true,
              "inputType": "checkbox",
              "defaultValue": {
                "no": false,
                "analgessics": false,
                "antiacidsIOAntiulcerosos": false,
                "antialergics": false,
                "antidiarreicsIOLaxants": false,
                "antiinfecciosos": false,
                "antiinflamatoris": false,
                "antipiretics": false,
                "antitussiusIOMucolitics": false,
                "altres": false
              }
            }
          ],
          "input": false,
          "tableView": false
        },
        {
          "title": "Page 14",
          "buttonSettings": {
            "previous": true,
            "cancel": false,
            "next": true
          },
          "label": "Page 14",
          "type": "panel",
          "key": "page15",
          "components": [
            {
              "label": "Has près alguna substancia estimulant abans d&apos;anar a dormir?",
              "optionsLabelPosition": "right",
              "tableView": false,
              "values": [
                {
                  "label": "No",
                  "value": "d",
                  "shortcut": ""
                },
                {
                  "label": "Cafeina",
                  "value": "cafeina",
                  "shortcut": ""
                },
                {
                  "label": "Tabac",
                  "value": "tabac",
                  "shortcut": ""
                },
                {
                  "label": "Alcohol",
                  "value": "alcohol",
                  "shortcut": ""
                },
                {
                  "label": "Cànnabis",
                  "value": "cannabis",
                  "shortcut": ""
                },
                {
                  "label": "Cocaïna",
                  "value": "cocaina",
                  "shortcut": ""
                },
                {
                  "label": "Amfetamines",
                  "value": "amfetamines",
                  "shortcut": ""
                },
                {
                  "label": "Èxtasi (MDMA)",
                  "value": "extasiMdma",
                  "shortcut": ""
                },
                {
                  "label": "LSD",
                  "value": "lsd",
                  "shortcut": ""
                },
                {
                  "label": "Opiacis",
                  "value": "opiacis",
                  "shortcut": ""
                },
                {
                  "label": "Psicofàrmacs",
                  "value": "psicofarmacs",
                  "shortcut": ""
                },
                {
                  "label": "Esteroides",
                  "value": "esteroides",
                  "shortcut": ""
                },
                {
                  "label": "Altres",
                  "value": "altres",
                  "shortcut": ""
                }
              ],
              "key": "14-hasPresAlgunaSubstanciaEstimulantAbansDanarADormir",
              "type": "selectboxes",
              "input": true,
              "inputType": "checkbox",
              "defaultValue": {
                "d": false,
                "cafeina": false,
                "tabac": false,
                "alcohol": false,
                "cannabis": false,
                "cocaina": false,
                "amfetamines": false,
                "extasiMdma": false,
                "lsd": false,
                "opiacis": false,
                "psicofarmacs": false,
                "esteroides": false,
                "altres": false
              }
            }
          ],
          "input": false,
          "tableView": false
        },
        {
          "title": "Page 15",
          "buttonSettings": {
            "previous": true,
            "cancel": false,
            "next": true
          },
          "label": "Page 15",
          "type": "panel",
          "key": "page16",
          "components": [
            {
              "label": "Quin ha sigut el teu estat d&apos;ànim durant el dia?",
              "optionsLabelPosition": "right",
              "tableView": false,
              "values": [
                {
                  "label": "Feliç",
                  "value": "felic",
                  "shortcut": ""
                },
                {
                  "label": "Trist",
                  "value": "trist",
                  "shortcut": ""
                },
                {
                  "label": "Enfadat",
                  "value": "enfedat",
                  "shortcut": ""
                },
                {
                  "label": "Estressat",
                  "value": "estressat",
                  "shortcut": ""
                },
                {
                  "label": "Ansios",
                  "value": "ansios",
                  "shortcut": ""
                },
                {
                  "label": "Apàtic",
                  "value": "apatic",
                  "shortcut": ""
                }
              ],
              "key": "15-quinHaSigutElTeuEstatDanimDurantElDia",
              "type": "selectboxes",
              "input": true,
              "inputType": "checkbox",
              "defaultValue": {
                "felic": false,
                "trist": false,
                "enfedat": false,
                "estressat": false,
                "ansios": false,
                "apatic": false
              }
            }
          ],
          "input": false,
          "tableView": false
        },
        {
          "title": "Page 16",
          "buttonSettings": {
            "previous": true,
            "cancel": false,
            "next": true
          },
          "label": "Page 16",
          "type": "panel",
          "key": "page17",
          "components": [
            {
              "label": "Què has fet 30 minuts abans d&apos;anar a dormir?",
              "optionsLabelPosition": "right",
              "tableView": false,
              "values": [
                {
                  "label": "Menjar",
                  "value": "menjar",
                  "shortcut": ""
                },
                {
                  "label": "Esport",
                  "value": "esport",
                  "shortcut": ""
                },
                {
                  "label": "Mirar el mòbil",
                  "value": "mirarElMobil",
                  "shortcut": ""
                },
                {
                  "label": "Mirar la televisió",
                  "value": "mirarLaTelevisio",
                  "shortcut": ""
                },
                {
                  "label": "Jugar a videojocs",
                  "value": "jugarAVideojocs",
                  "shortcut": ""
                },
                {
                  "label": "Sobre taula",
                  "value": "sobreTaula",
                  "shortcut": ""
                },
                {
                  "label": "Activitats d&apos;higiena",
                  "value": "activitatsDhigiena",
                  "shortcut": ""
                },
                {
                  "label": "Relacions sexuals",
                  "value": "altres",
                  "shortcut": ""
                },
                {
                  "label": "Altres",
                  "value": "altres",
                  "shortcut": ""
                }
              ],
              "key": "16-queHasFet30MinutsAbansDanarADormir",
              "type": "selectboxes",
              "input": true,
              "inputType": "checkbox",
              "defaultValue": {
                "menjar": false,
                "esport": false,
                "mirarElMobil": false,
                "mirarLaTelevisio": false,
                "jugarAVideojocs": false,
                "sobreTaula": false,
                "activitatsDhigiena": false,
                "altres": false
              }
            }
          ],
          "input": false,
          "tableView": false
        }
      ]
    };
  }
}
