import {Widget} from './widgets';
import * as React from 'react';

import {AngularContentWidget} from './module/content-widget';

import {observable, action, computed} from 'mobx'
import {observer} from 'mobx-react'



@observer
class NgSimple extends React.Component<any, any> {
containerRef = React.createRef<HTMLDivElement>()

widgetColor = observable({color: 'green'})

changeColor = action((input: string) => this.widgetColor.color = input)

nextColor = observable({color: 'red'})


    componentDidMount() {
        if(this.containerRef.current) {
          return this._main();
        }
    }
    componentWillUnmount() {}



    _main() {
        let ng = new AngularContentWidget(this.widgetColor)
        let ng2 = new AngularContentWidget({message: 'overriding all props', color: 'yellow'});
        Widget.attach(ng, this.containerRef.current);
        Widget.attach(ng2, this.containerRef.current);
    }

   createWidget() {
        Widget.attach(new AngularContentWidget(this.widgetColor), this.containerRef.current);
    }

    render() {
        return (
            <div style={{overflowY: 'scroll'}}>
            <div style={{minHeight: '100vh'}} ref={this.containerRef}>
            </div>
            <button
                style={{position: 'absolute', bottom: 0, height: '300px', width: '300px', background: 'purple'}}
                onClick={() => {
                    this.changeColor(this.nextColor.color),
                    this.createWidget()
                    }
                }
            >
                {`click me to attach a ${this.nextColor.color} widget`}
                
            </button>
            </div>
        );
    }
}

export { NgSimple as default, NgSimple }