
// UserList.jsx: Displays a list of all users for the admin panel. */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

// --- Styled components for the list and user cards ---
const SectionTitle = styled.h2`
  font-size: 2rem; font-weight: 500; margin-bottom: 20px;
  color: #fff; border-left: 4px solid ${theme.colors.primary};
  padding-left: 15px;
`;
const List = styled.ul`
    list-style: none; padding: 0; display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
`;
// User card. Border color changes if the user is an admin.
const ListItem = styled.li`
    background: #1f1f1f; padding: 20px; border-radius: 12px;
    border-left: 5px solid ${props => props.$isAdmin ? '#ffc107' : props.theme.colors.primary};
    transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    &:hover { transform: translateY(-5px); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); }
`;
const UserHeader = styled.div`
    display: flex; justify-content: space-between;
    align-items: flex-start; margin-bottom: 15px;
`;
const UserInfo = styled.div`
    .username { font-weight: 600; font-size: 1.3rem; color: white; }
    .email { color: #a0a0a0; font-size: 0.9rem; word-break: break-all; }
`;
const UserDetails = styled.div`
    display: flex; flex-direction: column; gap: 8px;
    margin-top: 15px; font-size: 0.9rem; color: #ccc;
    div { display: flex; justify-content: space-between; }
    span { color: #a0a0a0; font-weight: 400; }
`;
const UserRoles = styled.div`
    margin-top: 15px; padding-top: 15px; border-top: 1px solid #333;
    display: flex; flex-wrap: wrap; gap: 8px;
    span {
        background: #333; padding: 5px 12px; border-radius: 15px;
        font-size: 0.8rem; font-weight: 500; color: #e5e5e5;
        text-transform: capitalize;
    }
`;


/** Displays a grid of all registered users. */
const UserList = () => {
    // State for the user list and loading status.
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // On mount, fetches users from the API.
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setUsers((await api.getAllUsers()).data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Helper function to format dates.
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading) return <p>Cargando usuarios...</p>;

    return (
        <div>
            <SectionTitle>Usuarios Registrados</SectionTitle>
            <List>
                {users.map(user => (
                    <ListItem 
                        key={user.id_user} 
                        theme={theme}
                        // The `$isAdmin` prop changes the border color for administrators.
                        $isAdmin={user.roles.some(r => r.name === 'administrador')}
                    >
                        <UserHeader>
                            <UserInfo>
                                <div className="username">{user.username}</div>
                                <div className="email">{user.email}</div>
                            </UserInfo>
                        </UserHeader>
                        
                        <UserDetails>
                            {user.age && <div><span>Edad:</span> {user.age}</div>}
                            <div><span>Registo:</span> {formatDate(user.registration_date)}</div>
                        </UserDetails>
                        
                        <UserRoles>
                            {user.roles?.map(role => (<span key={role.name}>{role.name}</span>))}
                        </UserRoles>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default UserList;