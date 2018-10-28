import { Component } from '@angular/core';

@Component({
  selector: 'main',
  template: `
<div>
  <input [(ngModel)]="message">
  <p>Hello World!</p>
  <p>{{message}}</p>
  <p *ngIf="color">I am {{color}}!</p>
  <p *ngIf="colour">I am {{colour}}!</p>
</div>`
})
class AppComponent {
  message = 'Hello Angular! (edit me)'
  color: string = 'red';
}

export {AppComponent as default, AppComponent}