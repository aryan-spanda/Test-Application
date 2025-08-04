import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUser, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import api from '../services/api';
import { toast } from 'react-toastify';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #343a40;
  margin: 0;
`;

const AddButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  
  &:hover {
    background-color: #218838;
  }
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const UserCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  background-color: #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  margin: 0 0 0.25rem 0;
  color: #343a40;
`;

const UserEmail = styled.p`
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
`;

const UserActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.edit {
    background-color: #ffc107;
    color: #212529;
    
    &:hover {
      background-color: #e0a800;
    }
  }
  
  &.delete {
    background-color: #dc3545;
    color: white;
    
    &:hover {
      background-color: #c82333;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #6c757d;
`;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (userId) => {
    // In a real app, this would open a modal or navigate to edit page
    toast.info(`Edit functionality for user ${userId} would go here`);
  };

  const handleAdd = () => {
    // In a real app, this would open a modal or navigate to add page
    toast.info('Add user functionality would go here');
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Loading users...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Users Management</Title>
        <AddButton onClick={handleAdd}>
          <FaPlus /> Add User
        </AddButton>
      </Header>
      
      <UserGrid>
        {users.map(user => (
          <UserCard key={user.id}>
            <UserInfo>
              <Avatar>
                <FaUser />
              </Avatar>
              <UserDetails>
                <UserName>{user.name}</UserName>
                <UserEmail>{user.email}</UserEmail>
              </UserDetails>
            </UserInfo>
            <UserActions>
              <ActionButton 
                className="edit" 
                onClick={() => handleEdit(user.id)}
                title="Edit User"
              >
                <FaEdit />
              </ActionButton>
              <ActionButton 
                className="delete" 
                onClick={() => handleDelete(user.id)}
                title="Delete User"
              >
                <FaTrash />
              </ActionButton>
            </UserActions>
          </UserCard>
        ))}
      </UserGrid>
      
      {users.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#6c757d' }}>
          No users found. Click "Add User" to create one.
        </div>
      )}
    </Container>
  );
};

export default Users;
