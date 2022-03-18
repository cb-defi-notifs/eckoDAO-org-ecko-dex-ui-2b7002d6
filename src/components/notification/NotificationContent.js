import React from 'react';
import styled from 'styled-components/macro';
import Label from '../shared/Label';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const capitalizeFirstLetter = (string) => {
  return typeof string === 'string' ? string.charAt(0).toUpperCase() + string.slice(1) : null;
};

const NotificationContent = ({ icon, type, message, title, titleStyle }) => {
  return (
    <Container>
      {icon}
      <TextContainer className={type}>
        <Label fontFamily="syncopate" style={titleStyle}>
          {capitalizeFirstLetter(title) || capitalizeFirstLetter(type)}
        </Label>
        <Label>{capitalizeFirstLetter(message)}</Label>
      </TextContainer>
    </Container>
  );
};

export default NotificationContent;
