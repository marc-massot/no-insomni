import { Component, EventEmitter, OnInit } from '@angular/core';
import { DiesService } from '../services/dies.service';
import { Router } from '@angular/router';
import { FormioBaseComponent, FormioEvent } from '@formio/angular';

@Component({
  selector: 'app-nou-dia',
  templateUrl: './nou-dia.component.html',
  styleUrls: ['./nou-dia.component.scss']
})
export class NouDiaComponent implements OnInit {
  formulari: any;

  constructor(private diesService: DiesService, private router: Router) {}

  ngOnInit() {
    this.language.next("ca");
    this.formulari = this.diesService.getFormulari();
  }

  onSubmit(submission: any) {
    console.log(submission); // This will print out the full submission from Form.io API.
    this.diesService.saveNouDia(submission.data);
    this.router.navigate(['/inici']);
  }

  diaDuplicat(): boolean {
    return this.diesService.existeixAvui();
  }

  language: EventEmitter<string> = new EventEmitter();

  onReady(f: FormioBaseComponent) {
    f.language?.next("ca");
  }

}
