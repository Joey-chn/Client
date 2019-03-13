import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import Player from "../../views/Player";
import { Spinner } from "../../views/design/Spinner";
import { Button } from "../../views/design/Button";
import {Redirect, withRouter} from "react-router-dom";
import ProfileView from "../profileView/ProfileView";
import User from "../shared/models/User";

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null
    };
  }

  logout() {
    localStorage.removeItem("token");
    this.props.history.push("/login");
  }

  componentDidMount() {
    fetch(`${getDomain()}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(async users => {
        // delays continuous execution of an async operation for 0.8 seconds.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise(resolve => setTimeout(resolve, 800));

        this.setState({ users: users });
      })
      .catch(err => {
        console.log(err);
        alert("Something went wrong fetching the users: " + err);
      });
  }


  // when the user click on the user name
   handleProfileView(user_info) {
      // console.log(user_info)
      this.props.history.push("/game/dashboard/profileView" );
      localStorage.setItem("username", user_info.username);
      localStorage.setItem("name", user_info.name);
      localStorage.setItem("birthday", user_info.birthday);
      localStorage.setItem("creationDate", user_info.creationDate);
      localStorage.setItem("id", user_info.id);

      //  use this to tell if the user is authorized to edit the profile
     localStorage.setItem("token_other", user_info.token);



      // return  <ProfileView user = {user_info}/>
  }

  render() {
    return (
      <Container>
        <h2>Happy Coding! </h2>
        <p>Get all users from secure end point:</p>
        {!this.state.users ? (
          <Spinner />
        ) : (
          <div>
            <Users>
              {this.state.users.map(user => {
                return (
                    //  when click, pass the userId to the handlechange function
                  <PlayerContainer key={user.id} onClick = {() => {const user_info = new User(user);this.handleProfileView(user_info)}}>

                    <Player  user={user}/>
                  </PlayerContainer>
                );
              })}
            </Users>
            <Button
              width="100%"
              onClick={() => {
                this.logout();
              }}
            >
              Logout
            </Button>
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(Game);
