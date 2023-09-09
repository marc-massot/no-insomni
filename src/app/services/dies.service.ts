import { Injectable } from '@angular/core';
import { Dies, Setmana } from '../data/dies';

@Injectable({
  providedIn: 'root'
})
export class DiesService {

  private data: Dies;

  constructor() { 
    this.data = this.getData();
    console.log(this.data);
    this.storeData();
  }

  public saveNouDia(formData: any) {
    console.log("Saving form data...",formData);
    let avui = this.avui();
    this.data.dies = this.data.dies.filter(a=>a.dia!=avui);
    let puntuacio = this.calculaScore(formData);
    this.data.dies.push({dia: avui, data: formData, score: puntuacio});
    this.storeData();
  }

  public quantsDies(): number {
    return this.data.dies.length;
  }

  public minDia(): string {
    return this.data.dies.reduce((min,el)=>min>el.dia?el.dia:min,"9999-99-99");
  }

  public maxDia(): string {
    return this.data.dies.reduce((max,el)=>max<el.dia?el.dia:max,"0000-00-00");
  }

  public existeixAvui(): boolean {
    let avui = this.avui();
    let dia = this.data.dies.find(a=>a.dia==avui);
    console.log(dia);
    console.log(!!dia); 
    return !!dia;
  }

  public avgScore(): number {
    if (this.data.dies.length==0) return 0;
    let sum = this.data.dies.reduce((ac,el)=>ac+el.score,0);
    return sum/this.data.dies.length;
  }

  public getSetmana(quina: number = 0): Setmana {
    let ret: any = {};
    let dia: Date = new Date();
    dia.setTime(new Date().getTime() + quina*7 * 24 * 60 * 60 * 1000);
    let weekDay = dia.getDay(); // Sunday: 0 Monday: 1 ... Saturday: 6
    weekDay = weekDay==0?7:weekDay;
    let dl = new Date(dia.getTime() - (weekDay-1) * 24 * 60 * 60 * 1000);
    let dies = ['dl','dm','dc','dj','dv','ds','dg'];
    for(let i=0;i<7;i++) {
      let it = new Date(dl.getTime() + i * 24 * 60 * 60 * 1000);
      let ds = it.toJSON().slice(0,10);
      let el = this.data.dies.find(d=>d.dia==ds);
      ret[dies[i]] = el?el:{dia:ds,score:0};
    }
    return ret as Setmana;
  }

  private calculaScore(formData: any): number {
    return Math.floor(Math.random() * (5 - 1 + 1) + 1);
  }

  public avui(): string {
    return new Date().toJSON().slice(0, 10);
  }

  private getData(): Dies {
    let object = localStorage.getItem("dies");
    if (object) return JSON.parse(object) as Dies;
    return {dies:[]};
  }

  private storeData() {
    console.log("storing dies...",this.data);
    localStorage.setItem("dies",JSON.stringify(this.data));
  }
}
