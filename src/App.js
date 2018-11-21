import React, { Component } from 'react';
import './App.css';

class App extends Component {

    constructor() {
        super();
        this.state = {
            dataUsuario: [],
            horaactual: null,
            logueado: true,
            codigoUsuario: "72928871",
            numAsistencias: 10,
            numTardanzas: 2,
            numFaltas: 1,
            alerta: ""
        }
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.cambiarcodigo = this.cambiarcodigo.bind(this);
        this.fetchUsuario = this.fetchUsuario.bind(this);
        this.marcarAsistencia = this.marcarAsistencia.bind(this);
        this.cerrarAlerta = this.cerrarAlerta.bind(this);
    }

    login() {
        this.setState({logueado: true});
    }

    logout() {
        this.setState({logueado: false});
    }

    cambiarcodigo(event) {
        this.setState({codigoUsuario: event.target.value});
    }

    cerrarAlerta() {
        this.setState({alerta: ""});
    }

    marcarAsistencia() {
        const data = {
            dni: this.state.dataUsuario.UsuarioTrabajador.dni
        };
        fetch("http://127.0.0.1:5000/usuariotrabajador/" + this.state.codigoUsuario, {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(data)
        })
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                console.log(result);
                if (result.UsuarioTrabajador.dni === null) {
                    console.log("datos nulo");
                    this.setState({alerta: "Código invalido, Intente nuevamente."});
                } else {
                    this.setState({
                        dataUsuario: result,
                        logueado: true
                    });
                }
            })
    }

    fetchUsuario() {
        this.setState({
            logueado: false
        });
        fetch("http://127.0.0.1:5000/usuariotrabajador/" + this.state.codigoUsuario)
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                console.log(result);
                if (result.UsuarioTrabajador.dni === null) {
                    console.log("datos nulo");
                    this.setState({alerta: "Código invalido, Intente nuevamente."});
                } else {
                    this.setState({
                        dataUsuario: result,
                        logueado: true
                    });
                }
            })
    }

    tick() {
        this.setState(prevState => ({
            seconds: prevState.seconds + 1
        }));
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);
        this.setState({
            horaactual: new Date().toLocaleTimeString()
        });
    }

    componentDidUpdate() {
        var horanueva = new Date().toLocaleTimeString();
        if (this.state.horaactual !== horanueva) {
            this.setState({
                horaactual: horanueva
            });
        }
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    {this.state.logueado === true ?
                        (
                            <div className="MiCaja">
                                <div className="Caja">
                                    <div className="image"></div>
                                    <h1>{this.state.horaactual}</h1>
                                </div>
                                <div className="Caja">
                                    <h2>¡Buenos días {this.state.dataUsuario.UsuarioTrabajador.nombre}!</h2>

                                    <div>
                                        <button className="mybtn" onClick={this.marcarAsistencia}>MARCAR ASISTENCIA
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="login">
                                <div class="col-sm-6 col-sm-offset-3 myform-cont">
                                    <div class="myform-top">
                                        <div class="col-sm-12 my-sesion">
                                            <h1> Inicio de sesion </h1>
                                        </div>
                                        <div class="myform-top-left">
                                            <p>Ingresa tu codigo o DNI </p>
                                        </div>
                                    </div>
                                    <div class="myform-bottom">
                                        <form role="form" action="" method="post" class="">
                                            <div class="form-group">
                                                <input className="form-control" id="campodni" type="text"
                                                       value={this.state.codigoUsuario} onChange={this.cambiarcodigo}
                                                       maxLength={8}/>
                                            </div>
                                            <button className="mybtn" onClick={this.fetchUsuario}>ENTRAR</button>
                                        </form>
                                    </div>
                                </div>
                                {this.state.alerta !== "" ?
                                    (<div className="row">
                                        <div className="col-12">
                                            <div className="alert alert-primary alert-dismissible fade show"
                                                 role="alert">
                                                {this.state.alerta}
                                                <button onClick={this.cerrarAlerta} type="button" className="close"
                                                        data-dismiss="alert" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>) : (null)
                                }
                            </div>
                        )
                    }
                </header>
            </div>
        );
    }

}

    export default App;