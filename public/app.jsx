var Result = React.createClass({
    render: function () {

        return (
            <div>
                <h3>Your Score</h3>
                <h5>Percentage:{" " + (this.props.correctCount / this.props.quesCount) * 100}%</h5>
                <h5>Total Correct {" : " + this.props.correctCount} out of {" " + this.props.quesCount}</h5>
            </div>
        );
    },


});

var Question = React.createClass({

    _handelSubmit: function (e) {
        e.preventDefault();

        var inputs = this.refs.inputs.childNodes;
        var ans = '';

        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].checked) {

                ans = inputs[i].value;
                inputs[i].checked = false;

            }
        }

        var count = this.props.count;
        count += 1;
        this.props.handleChange(count, ans);
    },


    render: function () {
        return (
            <form onSubmit={this._handelSubmit}>
                <h5>{'Question ' + (this.props.count + 1)+' '}{this.props.question[0]}</h5>
                <div ref="inputs">
                    1.<input type="radio" name="ans" value={this.props.question[1]}/>{this.props.question[1]}<br/>
                    2.<input type="radio" name="ans" value={this.props.question[2]}/>{this.props.question[2]}<br/>
                    3.<input type="radio" name="ans" value={this.props.question[3]}/>{this.props.question[3]}
                </div>
                <button onClick={this._handelSubmit}>Next</button>
            </form>

        );
    }
});

var StartQuiz = React.createClass({

    getInitialState: function () {
        return ({
            done: false,
            count: 0,
            questions: this.props.quizObject.quetionAns[0],
            ans: "",
            correctCount: 0,
            start: false,
        });
    },

    /*   getDefaultProps: function () {
     return ({
     question: this.props.quizObject,
     });
     },*/
    updateAns: function (count, ans) {

        if (this.state.count < this.props.quizObject.quetionAns.length - 1) {
            if (ans == this.props.quizObject.quetionAns[this.state.count][4]) {
                this.setState({
                    count: count,
                    correctCount: this.state.correctCount + 1,
                    questions: this.props.quizObject.quetionAns[count]
                });
            }
            else {
                this.setState({
                    count: count,
                    questions: this.props.quizObject.quetionAns[count]
                });
            }
        }
        else if (this.state.count === this.props.quizObject.quetionAns.length - 1) {
            if (ans == this.props.quizObject.quetionAns[this.state.count][4]) {
                this.setState({
                    count: count,
                    correctCount: this.state.correctCount + 1,
                    done: true,
                });
            }
            else {
                this.setState({
                    count: count,
                    done: true,
                });
            }
        }

    },


    render: function () {
        if (this.state.done == false) {
            return (
                <Question count={this.state.count} correctCount={this.state.correctCount}
                          question={this.state.questions}
                          handleChange={this.updateAns}></Question>);
        }
        else if (this.state.done == true)
            return (<Result correctCount={this.state.correctCount} quesCount={this.state.count}></Result>);
    }
});

var Quiz = React.createClass({

    handleQuestion: function (e) {
        e.preventDefault();
    },
    render: function () {
        var quizObj = this.props.quiz;
        return (
            <div>
                <h2>{quizObj.questionName+" "}Test</h2>
                <br/>
                <StartQuiz quizObject={this.props.quiz}></StartQuiz>
            </div>
        );
    },
});

var CreateQuiz = React.createClass({

        getInitialState: function () {
            return ({
                questions: [],
                mode: this.props.mode,
            });
        },
        addQuestions: function (e) {
            e.preventDefault();
            var questionEnt = []
            questionEnt.push(this.refs.Question.value);
            questionEnt.push(this.refs.Option1.value);
            questionEnt.push(this.refs.Option2.value);
            questionEnt.push(this.refs.Option3.value);
            questionEnt.push(this.refs.correctAns.value);
            var stateArray = this.state.questions;
            stateArray.push(questionEnt);
            this.setState({
                questions: stateArray,
            });
            this.refs.Question.value = "";
            this.refs.Option1.value = "";
            this.refs.Option2.value = "";
            this.refs.Option3.value = "";
            this.refs.correctAns.value = "";
        },
        doneTest: function (e) {
            e.preventDefault();
            var questionObj = {
                questionName: this.refs.quizName.value,
                questionDesc: this.refs.quizDesc.value,
                timeAllowed: this.refs.quizTime.value,
                quetionAns: this.state.questions,

            };
            this.setState({
                mode: "",
            });


            localStorage.setItem("Quiz" + this.refs.quizName.value + "_" + this.props.username, JSON.stringify(questionObj));

        },
        render: function () {
            if (this.state.mode != "") {
                return (
                    <div>
                        <h1>CreateQuiz</h1>
                        <form onSubmit={this._addQuestions}>
                            <input type="text" ref="quizName" placeholder="Quiz Name"/>
                            <input type="text" ref="quizDesc" placeholder="Quiz Description"/>
                            <input type="number" ref="quizTime" placeholder="Quiz Time Allowed(mins)"/>

                            <h3>Question</h3>
                            <input type="text" ref="Question" placeholder="Question"/>
                            <input type="text" ref="Option1" placeholder="Option1"/>
                            <input type="text" ref="Option2" placeholder="Option2"/>
                            <input type="text" ref="Option3" placeholder="Option3"/>
                            <input type="text" ref="correctAns" placeholder="Correct Option"/>
                            <button onClick={this.addQuestions}>Add Question</button>
                            <button onClick={this.doneTest}>Create Test</button>
                        </form>
                        <ul>
                            {
                                this.state.questions.map(function (row, idx) {
                                    return (
                                        row.map(function (cell, cellidx) {
                                            if (cellidx == row.length - 1) {
                                                return (<li>Correct Answer:{cell}</li>);
                                            }
                                            if (cellidx != 0)
                                                return (<li key={cellidx}>{cellidx + '. '} {cell} </li>);
                                            return (<h3 key={cellidx}>Question{' ' + (rowidx + 1)}:{' ' + cell} </h3>);
                                        })
                                    );

                                })
                            }
                        </ul>

                    </div>
                );
            }
            else
                return (<LogedIn></LogedIn>);
        },
    }
);

var AttemptQuiz = React.createClass({

        getInitialState(){
            return ({
                start: false,
            });
        },
        quizStart: function (quizObject) {
            this.setState({
                start: true,
                quizObject: quizObject,
            });
        },
        render: function () {
            var quesKey = []
            for (var key in localStorage) {
                if (key.includes("Quiz")) {
                    quesKey.push(key);
                }
            }
            if (this.state.start == false) {
                return ( <div>
                        <h2>Quizes</h2>
                        {

                            quesKey.map(function (row, id) {
                                return (<div>
                                    <button key={id}
                                            onClick={this.quizStart.bind(this, JSON.parse(localStorage.getItem(row)))}>
                                        {JSON.parse(localStorage.getItem(row)).questionName}
                                    </button>
                                    <br/>
                                </div>);
                            }.bind(this))
                        }
                    </div>
                );
            }
            else {
                return (<Quiz quiz={this.state.quizObject}></Quiz>);
            }
        },
    }
);

var LogedIn = React.createClass({

        getInitialState: function () {
            return ({
                mode: '',
            });
        },
        createQuiz: function (e) {
            e.preventDefault();
            this.setState({
                mode: 'create'
            });
        },
        attemptQuiz: function (e) {
            e.preventDefault();
            this.setState({
                mode: 'attempt'
            });
        },
        render: function () {

            if (this.state.mode == 'create') {
                return (
                    <CreateQuiz username={this.props.username} mode={this.state.mode}></CreateQuiz>
                );
            }
            else if (this.state.mode == 'attempt') {
                return (
                    <AttemptQuiz mode={this.state.mode}></AttemptQuiz>
                );
            }
            else {
                return (
                    <div>
                        <h1>Hello User</h1>
                        <button onClick={this.createQuiz}>Create Quiz</button>
                        <button onClick={this.attemptQuiz}>Attempt Quiz</button>

                    </div>
                );
            }
        },
    }
);

var SignUpLogIn = React.createClass({

        store: function (e) {
            e.preventDefault();
            var regUserName = this.refs.usernameReg.value;
            var regPassword = this.refs.passwordReg.value;
            var regConfirmPassword = this.refs.confirmPassword.value;
            var user = {};
            if (regUserName != "" && regPassword != "" && regConfirmPassword != "") {
                if (regConfirmPassword === regPassword) {
                    localStorage.setItem(this.refs.usernameReg.value, this.refs.usernameReg.value);
                    localStorage.setItem(this.refs.passwordReg.value, this.refs.passwordReg.value);
                }
                else
                    alert("Password/Confirm Password Donot match");
            }
            else
                alert('Please Enter UserName/Password');
        },

        check: function (e) {
            e.preventDefault();
            var storedName = localStorage.getItem(this.refs.usernameLogin.value);
            var storedPw = localStorage.getItem(this.refs.passwordLogin.value);

            if (this.refs.usernameLogin.value != "" && this.refs.passwordLogin != "") {
                // check if stored data from register-form is equal to data from login form
                if (this.refs.usernameLogin.value == storedName && this.refs.passwordLogin.value == storedPw) {
                    alert('You are loged in.');
                    this.setState({
                        login: true,
                        username: this.refs.usernameLogin.value,
                    });
                }
                else {
                    alert("UserName or Password Invalid");
                }
            } else {
                alert('Please Enter UserName/Password');
            }

        },

        getInitialState: function () {
            return ({
                login: false,
                username: ''
            });
        },
        render: function () {

            if (this.state.login) {
                return (<LogedIn username={this.state.username}></LogedIn>);
            }
            else {
                return (
                    <div>
                        <h2>Signup</h2>
                        <form id="register-form" onSubmit={this.store}>
                            <input id="uname" ref="usernameReg" type="text" placeholder="Name" required/>
                            <input id="pw" ref="passwordReg" type="password" placeholder="Password" required/>
                            <input id="pw" ref="confirmPassword" type="password" placeholder="Confirm Password" required/>
                            <input id="rgstr_btn" type="submit" value="get Account" onClick={this.store}/>
                        </form>
                        <br/>
                        <p>or</p>
                        <br/>
                        <h2>Login</h2>
                        <form id="login-form">
                            <input id="userName" ref="usernameLogin" type="text" placeholder="Enter Username"
                                   required/>
                            <input id="userPw" ref="passwordLogin" type="password" placeholder="Enter Password"
                                   required/>
                            <input id="login_btn" type="submit" value="Login" onClick={this.check}/>
                        </form>
                    </div>

                );
            }
        },
    }
);
ReactDOM.render(
    <SignUpLogIn></SignUpLogIn>
    , document.getElementById('app'));