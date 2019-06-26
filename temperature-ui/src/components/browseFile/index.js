import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {withStyles} from '@material-ui/core/styles';
import {compose} from "recompose";
import SocketContext from '../socket-context';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardAction from '@material-ui/core/CardActions';
import {CardContent} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {Progress} from 'reactstrap';
import {uploadFileToServer} from '../../services/index';
import {browseFile} from '../../styles/index';

class BrowseFile extends Component {
    state = {
        selectedFile: null,
        loaded: 0,
        upload: false,
        totalSaved: 0,
        disabled: false
    };

    componentDidMount() {
        let {socket} = this.props;
        socket.removeAllListeners();
        socket.on(`dataSaved`, (res) => {
            this.showSavePercent(res, socket);
        });
    }

    showSavePercent = (res, socket) => {
        if (res !== "done") {
            this.setState({totalSaved: res, disabled: true}, () => {
                console.log(this.state.totalSaved);
            });
        } else {
            this.setState({disabled: false}, ()=> {
                socket.removeAllListeners();
                this.props.history.push("/analytics");
            });
        }
    };

    checkMimeType = (event) => {
        let files = event.target.files;
        let err = '';
        const type = 'application/json';
        for (let x = 0; x < files.length; x++) {
            if (files[x].type !== type) {
                err += files[x].type + ' is not a supported format\n';
            }
        }
        if (err !== '') {
            event.target.value = null; // discard selected file
            alert(err);
            return false;
        }
        return true;

    };

    checkFileSize = (event) => {
        let files = event.target.files;
        let size = 160070808;
        let err = "";
        for (let x = 0; x < files.length; x++) {
            if (files[x].size > size) {
                err += files[x].type + 'is too large, please pick a smaller file\n';
            }
        }
        if (err !== '') {
            event.target.value = null;
            alert(err);
            return false
        }

        return true;

    };

    onChangeHandler = (event) => {
        if (this.checkMimeType(event) && this.checkFileSize(event)) {
            this.setState({
                selectedFile: event.target.files[0],
                upload: true,
                loaded: 0
            });
        }
    };

    onClickHandler = () => {
        let {upload} = this.state;
        if (upload) {
            this.setState({totalSaved: 0, disabled: true}, () => {
                const data = new FormData();
                data.append('file', this.state.selectedFile);
                uploadFileToServer(data, (ProgressEvent) => {
                    this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
                    });
                }).then(res => {
                    if (res.statusCode === 200)
                        this.setState({disabled: false});
                }).catch(e => {
                    alert(e.message);
                });
            });
        }
    };

    render() {
        let {classes} = this.props;
        let {loaded, disabled, totalSaved} = this.state;
        return (
            <Card className={classes.root}>
                <CardHeader component="div" title="Browse your file"
                            subheader={totalSaved ? totalSaved + " data saved" : null}/>
                <CardContent>
                    <TextField type="file" onChange={this.onChangeHandler}/>
                </CardContent>
                <CardAction>
                    <Button disabled={disabled} onClick={this.onClickHandler} size="small" variant="contained"
                            color="primary">
                        send
                    </Button>
                    {loaded ? <div className="form-group">
                        <Progress max="100" color="success"
                                  value={loaded}>{Math.round(loaded)}%</Progress>

                    </div> : null}
                </CardAction>
            </Card>);
    }
}

const ComponentWithSocket = props => (
    <SocketContext.Consumer>
        {socket => <BrowseFile {...props} socket={socket}/>}
    </SocketContext.Consumer>
);

export default withRouter(compose(withStyles(browseFile))(ComponentWithSocket));