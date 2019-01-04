import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injector, NgModuleRef, NgZone, Type } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { PromiseDelegate } from './promise-delegate';
import { Widget } from './widget';


export class AngularLoader<M> {
  private applicationRef: ApplicationRef;
  private componentFactoryResolver: ComponentFactoryResolver;
  ngZone: NgZone;
  private injector: Injector;

  constructor( ngModuleRef: NgModuleRef<M>) {
    this.injector = ngModuleRef.injector;
    this.applicationRef = this.injector.get(ApplicationRef);
    this.ngZone = this.injector.get(NgZone);
    this.componentFactoryResolver = this.injector.get(ComponentFactoryResolver);
  }

  attachComponent<T>(ngComponent: Type<T>, dom: Element): ComponentRef<T> {
    let componentRef: ComponentRef<T>;
    this.ngZone.run(() => {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ngComponent);
      componentRef = componentFactory.create(this.injector, [], dom);
      this.applicationRef.attachView(componentRef.hostView);
    });
    return componentRef;
  }
}


export class AngularWidget<C, M> extends Widget {
  angularLoader: AngularLoader<M>;
  ngZone: NgZone;
  componentRef: ComponentRef<C>;
  componentInstance: C;
  componentReady = new PromiseDelegate<void>();

  constructor(ngComponent: Type<C>, ngModule: Type<M>, options?: any) { //Widget.IOptions
    super(options);
    platformBrowserDynamic().bootstrapModule(ngModule)
    .then(ngModuleRef => {
      this.angularLoader = new AngularLoader(ngModuleRef);
      this.ngZone = this.angularLoader.ngZone;
      this.componentRef = this.angularLoader.attachComponent(
        ngComponent, this.node);
      this.componentInstance = this.componentRef.instance;
      this.componentReady.resolve(undefined);
    });
  }

  dispose(): void {
    this.ngZone.run(() => {
      this.componentRef.destroy();
    });
    super.dispose();
  }
}




/**
 * Bootstraps a root Angular component into a div Element.
 * 
 * Key properties on the AngularWidget are `componentInstance` and 
 * `componentReady`.
 * 
 * Once the componentReady promise resolves then the Angular component is 
 * accessible under the property `componentInstance`.
 */