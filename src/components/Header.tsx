import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #282c34;
  padding: 20px;
  color: white;
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <h1>Code Animator</h1>
    </HeaderContainer>
  );
};

export default Header;
