import {observable, action} from 'mobx'



export class WidgetStore {
    @observable isDisposed = false
    @observable isAttached = false
    @observable isHidden = false
    @observable isVisible = false
    @observable disallowLayout = false
    @observable disposed = false
    @observable layout = null

    @observable node: {
        id
        dataset
    }

    @observable parent = null

    @action
    setDisposed = () => this.isDisposed = true
}

export class Widget {
    
    node: HTMLElement;
    
    state: WidgetStore;

    public static attach(widget: Widget, host?: HTMLElement, ref: HTMLElement | null = null) {
    if (widget.state.parent) {throw new Error('Cannot attach a child widget.')}
    if (widget.state.isAttached || document.body.contains(widget.node)) {throw new Error('Widget is already attached.')}
    if (!document.body.contains(host)) {throw new Error('Host is not attached.')}
   

   //if (widget.lifeCycle){ emit(self/widget, LifeCycle.beforeAttach)}
    
    host.insertBefore(widget.node, ref);

    //if (widget.lifeCycle){ emit(self/widget, LifeCycle.afterAttach)}


  }

constructor(options: any = {}) {
        this.state = new WidgetStore()
        this.node = options.node || document.createElement('div');
        
    if (Object.is(options.style, undefined)) {
        this.node.style.boxSizing = 'border-box';
        this.node.style.position= 'relative';
        this.node.style.overflow= 'hidden';
        this.node.style.cursor= 'default';
    }

        //this.addClass('p-Widget');
        
    }


dispose(): void {
    // Do nothing if the widget is already disposed.
    if (this.state.isDisposed) {
      return;
    }
    this.state.setDisposed()

    // Remove or detach the widget if necessary.
    if (this.state.parent) {
      this.state.parent = null;
    } 
    else if (this.state.isAttached) {
    }

    if (this.state.layout) {
      this.state.layout = null;
    }
  }


contains(widget: Widget) {
    for (let value = widget; value; value = value.state.parent) {
            if (value === this) {
                return true;
            }
        }
        return false;
    }

    hasClass(name) {
        return this.node.classList.contains(name);
    }
    addClass(name) {
        this.node.classList.add(name);
    }
    removeClass(name) {
        this.node.classList.remove(name);
    }

    toggleClass(name, force) {
        if (force === true) {
            this.node.classList.add(name);
            return true;
        }
        if (force === false) {
            this.node.classList.remove(name);
            return false;
        }
        return this.node.classList.toggle(name);
    }

}