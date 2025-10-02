import styled from 'styled-components';

export const ColumnContainer = styled.div<{ $isActive?: boolean; $isOver?: boolean }>`
  background: #f0f0f0;
  border-radius: 8px;
  padding: 12px;
  min-width: 280px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  
`;

export const EmptyColumnDropZone = styled.div<{ $isOver?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  border: 2px dashed #ccc;
  border-radius: 4px;
  color: #666;
  font-size: 14px;
  text-align: center;
  padding: 0 12px;

  
`;

// Остальные стили остаются без изменений... 
export const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

export const ColumnTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
`;

export const ColumnTitleInput = styled.input`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 16px;
  flex: 1;
`;

export const DeleteColumnButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #cc0000;
  }
`;

export const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-height: 80px;
`;

export const AddCardButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #0056b3;
  }
`;
