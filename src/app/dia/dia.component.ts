import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Dia } from '../data/dies';
import { DiesService } from '../services/dies.service';

@Component({
  selector: 'app-dia',
  templateUrl: './dia.component.html',
  styleUrls: ['./dia.component.scss']
})
export class DiaComponent implements OnInit {
  dia?: Dia;
  config: any;
  segDia?: string;
  antDia?: string;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.dia = this.diesService.getDia(params['dia']);
      this.segDia = this.diesService.getSeguentDia(params['dia']);
      this.antDia = this.diesService.getAnteriorDia(params['dia']);
      console.log('Dia',this.dia);
      console.log('antDia',this.antDia);
      console.log('segDia',this.segDia);
    });
  }

  constructor(private diesService: DiesService,  private route: ActivatedRoute, private router: Router) {
    this.config = this.diesService.getInputsIValors();
    console.log('Config:',this.config);
  }

  keepOrder = (a: any,b: any): number => {
    return a==b?0:a<b?-1:1;
  }

  getPregunta(key: any) : string {
    return this.config[key].label.replaceAll("&apos;","'");
  }

  getPreguntaTipus(key: any) : string {
    const val = this.dia? this.dia.data[key] : undefined;
    
    if (typeof val != 'object' && this.config[key].values) 
      return "opcio";
    
    if (typeof val == 'object' && this.config[key].values) 
      return "multiple";
    
    return "valor";
  }

  getRespostaOpcio(key: any) : string {
    const val = this.dia? this.dia.data[key] : undefined;
    
    return this.config[key].values[val]?this.config[key].values[val].replaceAll("&apos;","'"):"";
  }

  getRespostaValor(key: any) : string {
    const val = this.dia? this.dia.data[key] : undefined;
    
    return val;
  }

  getRespostaMultiple(key: any) : string[] {
    const val = this.dia? this.dia.data[key] : undefined;
    
    return Object.keys(val).filter(k=>val[k]).map(k=>this.config[key].values[k].replaceAll("&apos;","'"));
  }

  onAnteriorDia() {
    if (this.antDia) {
      this.router.navigate(['dia', this.antDia]);
    }
  }

  onSeguentDia() {
    if (this.segDia) {
      this.router.navigate(['dia', this.segDia]);
    }
  }

  private swipeCoord: [number, number] = [0,0];
  private swipeTime: number = 0;

  onSwipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
     const time = new Date().getTime();
    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
     }
    else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;
    if (duration < 1000
       && Math.abs(direction[0]) > 30 
       && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { 
       if (direction[0] < 0) {
        //next
        this.onSeguentDia();
       } else {
        //previous
        this.onAnteriorDia();
       }
      }
     }
    }
}
