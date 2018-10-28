import {Widget} from '@phosphor/widgets';
import * as React from 'react';


import AngularContentWidget from './module/content-widget';


import {observable, action} from 'mobx'
import {observer} from 'mobx-react'


let defaultStyle = observable({color: 'green'})

let changeColor = action((input: string) => {
      return defaultStyle.color = input
  }
)


@observer
class NgSimple extends React.Component<any, any> {

    private _containerRef : HTMLDivElement;
    private _onContainerRef = (ref : HTMLDivElement) => {
        this._containerRef = ref;
    }

    componentDidMount() {
        if(this._containerRef) {
          return this._main();
        }
    }
    componentWillUnmount() {
        
    }

    private _main() {
        let ng = new AngularContentWidget(defaultStyle);
        let ng2 = new AngularContentWidget({message: 'overriding all props', color: 'yellow'});
         Widget.attach(ng, this._containerRef);
         Widget.attach(ng2, this._containerRef);
    }

    render() {
        return (
            <div>
            <div style={{minHeight: '100vh'}} ref={this._onContainerRef}></div>
            <button
                style={{position: 'absolute', bottom: 0, height: '300px', width: '300px', background: 'purple'}}
                onClick={() => changeColor('red')}
            >
                {'click me'}
            </button>
            </div>
        );
    }
}

export { NgSimple as default, NgSimple }