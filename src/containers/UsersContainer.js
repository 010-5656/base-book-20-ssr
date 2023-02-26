import React from "react";
import Users from "../components/Users";
import { connect } from "react-redux";
import { getUsers } from "../modules/users";
import { Preloader } from "../lib/PreloadContext";

const {useEffect} = React;

const UsersContainer = ({users,getUsers}) => {
    // 콤포넌트가 마운트 되고 나서 호출(Class의 생명주기)
   
    useEffect(() => {
        if(users) return;
        getUsers();

    }, [getUsers,users]);
    return( 
        <>
             <Users users={users} />
             <Preloader resolve={getUsers} />
        </>
    );
};

export default connect(
    state => ({
        users: state.users.users
    }),
    {
        getUsers
    }

)(UsersContainer);