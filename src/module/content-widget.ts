import '../styles/index.css';

import { AngularWidget } from '../ng-widget/ng-widget';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

import * as _ from 'lodash'

class AngularContentWidget extends AngularWidget<AppComponent, AppModule> {
  static createNode(): HTMLElement {
    let node = document.createElement('div');
    let content = document.createElement('div');
    let input = document.createElement('input');
    input.placeholder = 'Placeholder...';
    content.appendChild(input);
    node.appendChild(content);
    return node;
  }

  constructor(ngProps?: any) {
    super(AppComponent, AppModule);
    
    //ngProps = ngProps || {}

    this.componentReady.promise.then(() => {
      
      //console.log(ngProps)
      
      this.ngZone.run(() => {
        this.addClass('content');
        //console.log(`'ORIGINAL NG PROPS' ${JSON.stringify(this.componentInstance)}`)
        
      //this works, now map all of them automatically
       //this.componentInstance.colour = ngProps.color
      
     let p = { ...this.componentInstance, ...ngProps}
      
      this.componentInstance = Object.assign(this.componentInstance, p)
      console.log(p)
      this.addClass(ngProps.color.toLowerCase())
        //console.log(ngProps.color)

      });
    });
  }

  get inputNode(): HTMLInputElement {
    return this.node.getElementsByTagName('input')[0] as HTMLInputElement;
  }
}

// ahh gotta fix this <-> bc right now its like 1 direction, u can go either way with how u code but its clumsy to do 2 way



export { AngularContentWidget}
export default AngularContentWidget

      // Any change to the component needs to be run within ngZone in order
      // to activate Angular's change detection

// function main(): void {
//   let r1 = new AngularContentWidget('Red');
//   let b1 = new AngularContentWidget('Blue');
//   let g1 = new AngularContentWidget('Green');
//   let y1 = new AngularContentWidget('Yellow');

//   let r2 = new AngularContentWidget('Red');
//   let b2 = new AngularContentWidget('Blue');

//   let dock = new DockPanel();
//   dock.addWidget(r1);
//   dock.addWidget(b1, { mode: 'split-right', ref: r1 });
//   dock.addWidget(y1, { mode: 'split-bottom', ref: b1 });
//   dock.addWidget(g1, { mode: 'split-left', ref: y1 });
//   dock.addWidget(r2, { ref: b1 });
//   dock.addWidget(b2, { mode: 'split-right', ref: y1 });
//   dock.id = 'dock';

//   window.onresize = () => { dock.update(); };
//   Widget.attach(dock, document.body);
// }


// window.onload = main;
