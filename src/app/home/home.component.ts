import { Component, OnInit } from '@angular/core';
import { DiesService } from '../services/dies.service';
import { Dia, DiesSetmana, Setmana } from '../data/dies';
import { ChartData, ChartEvent, ChartOptions } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  diaSetmana: number = 0;
  numDies: number= 0;
  puntuacio: number = 0;
  quinaSetmana: number = 0;
  setmana?: Setmana;
  minDia: string = "";
  maxDia: string = "";
  avui: string = "";
  teAnterior: boolean = false;
  teSeguent: boolean = false;
  doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Dades'],
    datasets: [
      { data: [50],
        backgroundColor: ["red"] },
    ],
    
  };
  doughnutChartOptions: ChartOptions<'doughnut'> = {
    plugins: {
      legend: {
        display: false
      }
    },
    cutout: "75%",
  };

  constructor(private diesService: DiesService, private router: Router) {}

  minDies = 30;

  ngOnInit(): void {
    this.numDies = this.diesService.quantsDies();
    this.puntuacio = this.diesService.avgScore();
    this.quinaSetmana = 0;
    this.setmana = this.diesService.getSetmana(this.quinaSetmana);
    this.minDia = this.diesService.minDia();
    this.maxDia = this.diesService.maxDia();
    this.avui = this.diesService.avui();
    this.teAnterior = this.minDia < this.setmana.dl.dia;
    this.teSeguent = this.maxDia > this.setmana.dg.dia;
    if (this.numDies<this.minDies) {
      this.doughnutChartOptions = this.chartOptionsDies();
      this.doughnutChartData = this.chartDataDies();
    }
    else {
      this.doughnutChartOptions = this.chartOptionsPuntuacio();
      this.doughnutChartData = this.chartDataPuntuacio();
    }
  }

  private chartOptionsPuntuacio(): ChartOptions<'doughnut'> {
    return {
      plugins: {
        legend: {
          display: false
        }
      },
      cutout: "75%"
    };
  }

  private chartDataPuntuacio(): ChartData<'doughnut'> {
    return {
      labels: ['Dades'],
      datasets: [
        { data: [this.perc(this.puntuacio),100-this.perc(this.puntuacio)],
          backgroundColor: ["red","rgb(240,240,240)"] },
      ],
      
    };
  }

  private chartOptionsDies(): ChartOptions<'doughnut'> {
    return {
      plugins: {
        legend: {
          display: false
        }
      },
      cutout: "75%"
    };
  }

  private chartDataDies(): ChartData<'doughnut'> {
    return {
      labels: ['Dades'],
      datasets: [
        { data: [this.numDies,this.minDies-this.numDies],
          backgroundColor: ["green","rgb(240,240,240)"] },
      ],
      
    };
  }
  
  seguentSetmana() {
    if (this.teSeguent) {
      this.quinaSetmana++;
      this.setmana = this.diesService.getSetmana(this.quinaSetmana);
      this.teAnterior = this.minDia < this.setmana.dl.dia;
      this.teSeguent = this.maxDia > this.setmana.dg.dia || this.quinaSetmana < 0;
    }
  }
  anteriorSetmana() {
    if (this.teAnterior) {
      this.quinaSetmana--;
      this.setmana = this.diesService.getSetmana(this.quinaSetmana);
      this.teAnterior = this.minDia < this.setmana.dl.dia;
      this.teSeguent = this.maxDia > this.setmana.dg.dia || this.quinaSetmana < 0;
    }
  }

  private swipeCoord: [number, number] = [0,0];
  private swipeTime: number = 0;

  swipe(e: TouchEvent, when: string): void {
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
        this.seguentSetmana();
       } else {
        //previous
        this.anteriorSetmana();
       }
      }
     }
    }

    keepOrder = (a: any,b: any): number => {
      return 0;
    }

    onDailyScoreClick(dia: DiesSetmana) {
      console.log('onDailyScoreClick',dia);
      let d: Dia = (this.setmana? this.setmana[dia] : undefined) as Dia;
      if (d && d.data) {
        console.log('onDailyScoreClick dia',d.dia);
        this.router.navigate(['dia',d.dia]);
      }
    }

    onNouDia() {
      this.router.navigate(['nou-dia']);
    }

    perc(score: number): number {
      return this.diesService.calculaPerc(score);
    }

    imatge(score: number): string {
      return this.diesService.calculaImatge(score);
    }

    // events
    public chartClicked({
      event,
      active,
    }: {
      event: ChartEvent;
      active: object[];
    }): void {
      console.log(event, active);
    }
  
    public chartHovered({
      event,
      active,
    }: {
      event: ChartEvent;
      active: object[];
    }): void {
      console.log(event, active);
    }
}
