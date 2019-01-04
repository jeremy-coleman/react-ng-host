import { AngularWidget } from '../widgets';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

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
        
      //this works, now need to map all of them automatically[done with spread merge]
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

// u can skip react all together and just use this as function main() and then window.onload = main;
