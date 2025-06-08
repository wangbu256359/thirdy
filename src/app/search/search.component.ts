import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,          // Mark the component as standalone
  imports: [CommonModule],   // Import CommonModule for directives like *ngIf, etc.
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'] // Corrected property name to "styleUrls"
})
export class SearchComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {}

  doSearch(value: string): void {
    console.log(`value=${value}`);
    this.router.navigateByUrl(`search/${value}`);
  }
}
