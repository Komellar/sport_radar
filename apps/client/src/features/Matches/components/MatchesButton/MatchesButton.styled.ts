import styled from "styled-components";

export const Button = styled.button`
  padding: 6px 35px;
  margin-bottom: 20px;
  font-weight: 600;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ddd;
  }
`;
