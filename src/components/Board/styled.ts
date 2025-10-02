import styled from 'styled-components';

export const BoardContainer = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px;
  min-height: 100vh;
  background-color: #f0f2f5;
  overflow-x: auto;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

export const AddColumnButton = styled.button`
  min-width: 250px;
  height: 40px;
  background-color: #ffffff;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;

  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
`;
