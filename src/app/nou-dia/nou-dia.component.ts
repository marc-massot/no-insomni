import { Component, OnInit } from '@angular/core';
import { DiesService } from '../services/dies.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nou-dia',
  templateUrl: './nou-dia.component.html',
  styleUrls: ['./nou-dia.component.scss']
})
export class NouDiaComponent implements OnInit {
  constructor(private diesService: DiesService, private router: Router) {}

  ngOnInit() {
  }

  onSubmit(submission: any) {
    console.log(submission); // This will print out the full submission from Form.io API.
    this.diesService.saveNouDia(submission);
    this.router.navigate(['/inici']);
  }

  diaDuplicat(): boolean {
    return this.diesService.existeixAvui();
  }
}
