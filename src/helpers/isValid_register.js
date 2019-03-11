import React from "react";
import {getDomain} from "./getDomain";



function isValid_register(username) {

    let is_valid = 0;
    //  iterate all the usernames in the database, if found return false, else true
    // asynchrouns.
    fetch(`${getDomain()}/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then( users => {
              users.map(user => { if (user.username === username) is_valid += 1;})
                return !is_valid;
                }
            )

        .catch(err => {
                    console.log(err);
                    alert("Something went wrong fetching the users: " + err);
                });
}

export default isValid_register;