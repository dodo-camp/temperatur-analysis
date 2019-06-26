import React, {Component, Suspense} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import io from 'socket.io-client';
import SocketContext from './socket-context'
import {routes} from '../routes/index';

const socket = io("http://localhost:3080");

class Index extends Component {
    render() {
        return (
            <Router>
                <div style={{height: '100vh'}}>
                    <SocketContext.Provider value={socket}>
                        <Suspense fallback={<div>warming up...</div>}>
                            <Switch>
                                {routes.map((route, i) => <Route key={i} path={route.name}
                                                                 render={(props) => route.component}/>)}
                                <Route exact path="**" render={() => (
                                    <Redirect to="/browseFile"/>
                                )}/>
                            </Switch>
                        </Suspense>
                    </SocketContext.Provider>
                </div>
            </Router>
        );
    }
}

export default Index;