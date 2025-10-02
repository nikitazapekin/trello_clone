import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.25rem;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #333;
    background-color: #f5f5f5;
    border-radius: 4px;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #1890ff;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #1890ff;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 24px;
`;

export const Button = styled.button<{ variant?: 'primary' | 'default' }>`
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: ${props => props.variant === 'primary' ? '#1890ff' : '#fff'};
  color: ${props => props.variant === 'primary' ? '#fff' : '#333'};
  border-color: ${props => props.variant === 'primary' ? '#1890ff' : '#ddd'};

  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.$active ? '#1890ff' : 'transparent'};
  color: ${props => props.$active ? '#1890ff' : '#666'};
  font-weight: ${props => props.$active ? '500' : 'normal'};

  &:hover {
    color: #1890ff;
    background-color: #f5f5f5;
  }
`;

export const TabContent = styled.div`
  min-height: 200px;
`;

export const ListContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;
`;

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
`;

export const ListInput = styled.input`
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

export const AddButton = styled.button`
  background: none;
  border: 1px dashed #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  color: #666;
  margin-bottom: 12px;
  width: 100%;

  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
`;

export const DeleteButton = styled.button`
  background: #ff4d4f;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;

  &:hover {
    background: #ff7875;
  }
`;

export const ImageUploadArea = styled.div`
  border: 2px dashed #ddd;
  border-radius: 4px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  color: #666;
  margin-bottom: 16px;

  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
`;

export const ImageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
`;

export const ImagePreview = styled.div`
  position: relative;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  text-align: center;
`;

export const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const LabelItem = styled.div<{ $color: string }>`
  border-left: 4px solid ${props => props.$color};
  padding: 8px 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
`;

export const ColorInput = styled.input`
  width: 40px;
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
`;

export const ChecklistContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;
`;

export const ChecklistHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
`;

export const HistoryContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

export const HistoryItem = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

export const HistoryAction = styled.div`
  font-weight: 500;
  margin-bottom: 2px;
`;

export const HistoryTime = styled.div`
  font-size: 12px;
  color: #666;
`;
