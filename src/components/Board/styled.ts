import styled from "styled-components";

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

export const MultiSelectButton = styled.button<{ $isActive: boolean }>`
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 12px 20px;
  background-color: ${(props) => (props.$isActive ? "#1890ff" : "#ffffff")};
  color: ${(props) => (props.$isActive ? "#ffffff" : "#1890ff")};
  border: 2px solid #1890ff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#40a9ff" : "#f0f8ff")};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const CardsWrapper = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;

  @media screen and (max-width: 1240px) {
    flex-direction: column;
    width: 100%;
  
  }
`;
