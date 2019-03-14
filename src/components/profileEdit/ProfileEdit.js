import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import User from "../shared/models/User";
import {Redirect, withRouter} from "react-router-dom";
import { Button } from "../../views/design/Button";

const FormContainer = styled.div`
  margin-top: 3em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 550px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;


const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  height: 35px;
  padding-left: 15px;
  padding-top: 6px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const DisplayField = styled.div`
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  height: 35px;
  padding-left: 15px;
  padding-top: 6px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class ProfileEdit extends React.Component {
    /**
     * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
     * The constructor for a React component is called before it is mounted (rendered).
     * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: password and username
     * These fields are then handled in the onChange() methods in the resp. InputFields
     */
    constructor() {
        super();
        this.state = {
            username: localStorage.getItem("username"),
            name: localStorage.getItem("name"),
            birthday: localStorage.getItem("birthday"),
            creationDate: localStorage.getItem("creationDate"),
            status: localStorage.getItem('token') === localStorage.getItem('token_other') ? 'online':'offline',
            userId: localStorage.getItem('id'),
            //  state value for change
            usernameChange :false,
            nameChange: false,
            birthdayChange: false
        };
    }


     /**
     * HTTP POST request is sent to the backend.
     * If the request is successful, a new user is returned to the front-end and its token is stored in the localStorage.
     */
    edit() {
        // console.log(this.state.nameChange)
        // test if there're some changes in the fields
         if (this.state.usernameChange || this.state.birthdayChange || this.state.nameChange) {
             const id = this.state.userId
             console.log(this.state.nameChange)
             fetch(`${getDomain()}/users/${id}`, {
                 method: "PUT",
                 headers: {
                     "Content-Type": "application/json",
                     // "requestType": "update"
                 },
                 body: JSON.stringify({
                     username: this.state.username, //() =>  (this.state.usernameChange? this.state.username : "false"),
                     name: this.state.name,//()=> this.state.nameChange ? this.state.name : "false",
                     birthday: this.state.birthday //() => this.state.birthdayChange ? this.state.birthday : "false",
                     // id: parseInt(localStorage.getItem("id"))

                 })
             })
                 .then(response => {

                         if (response.status === 409) {
                             throw new Error("Username is taken!");
                         }
                         return response;
                     }
                 )
                 .then(returnedUser => {

                         this.props.history.push(`/game/dashboard/profileView`);
                     }
                 )
                 .catch(err => {
                     if (err.message.match(/Failed to fetch/)) {
                         alert("The server cannot be reached. Did you start it?");
                     } else {
                         alert(`${err.message}`);
                     }
                 });
         }else{
             // if there're no changes, redirect to the profile page
             this.props.history.push(`/game/dashboard/profileView`);
         }
     }

    /**
     *  Every time the user enters something in the input field, the state gets updated.
     * @param key (the key of the state for identifying the field that needs to be updated)
     * @param value (the value that gets assigned to the identified state key)
     */
    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    /**
     * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
     * Initialization that requires DOM nodes should go here.
     * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
     * You may call setState() immediately in componentDidMount().
     * It will trigger an extra rendering, but it will happen before the browser updates the screen.
     */
    //  to fetch the data from the server, and display it on the screen


    render() {
        return (

            <BaseContainer>
                <FormContainer>
                    <Form>
                        <Label>username</Label>
                        <InputField
                            placeholder={this.state.username}
                            onChange={e => {
                                this.handleInputChange("username", e.target.value);
                                localStorage.setItem("username",e.target.value);
                                this.handleInputChange('usernameChange', true)
                            }}
                        />

                        <Label>status</Label>
                        <DisplayField
                        >{this.state.status}</DisplayField>

                        <Label>name</Label>
                        <InputField
                            placeholder={this.state.name}
                            onChange={e => {
                                this.handleInputChange("name", e.target.value);
                                localStorage.setItem("name",e.target.value);
                                this.handleInputChange('nameChange', true)
                            }}
                        />
                        <Label>birthday</Label>
                        <InputField
                            type = "date"
                            placeholder={this.state.birthday}
                            onChange={e => {
                                this.handleInputChange("birthday", e.target.value);
                                localStorage.setItem("birthday",e.target.value);
                                this.handleInputChange('birthdayChange', true)
                            }}
                        />

                        <Label>creation date</Label>
                        <DisplayField
                            type = "date"
                        >{this.state.creationDate}</DisplayField>

                        <ButtonContainer>
                            <Button
                                disabled={!this.state.username || !this.state.name}
                                width="50%"
                                onClick={() => {
                                    this.edit()
                                }}
                            >
                                Finished
                            </Button>
                            <Button
                                // disabled={this.state.username || this.state.password}
                                width="50%"
                                onClick={() => {
                                    this.props.history.push('/game')
                                }}
                            >
                                to game page
                            </Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(ProfileEdit);
