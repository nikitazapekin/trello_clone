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

export const ModalContent = styled.div<{ $wide?: boolean }>`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: ${props => props.$wide ? '800px' : '500px'};
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
  font-size: 18px;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;

  &:hover {
    color: #333;
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

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
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

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
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
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DeleteButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ff4d4f;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: #ff4d4f;
  color: #fff;

  &:hover {
    opacity: 0.8;
  }
`;

export const Tabs = styled.div`
  margin-top: 20px;
`;

export const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
`;

export const Tab = styled.button<{ $isActive: boolean }>`
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.$isActive ? '#1890ff' : 'transparent'};
  color: ${props => props.$isActive ? '#1890ff' : '#666'};

  &:hover {
    color: #1890ff;
  }
`;

export const TabPanel = styled.div<{ $isActive: boolean }>`
  display: ${props => props.$isActive ? 'block' : 'none'};
`;

export const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

export const ImageItem = styled.div`
  position: relative;
  text-align: center;

  button {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ff4d4f;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    font-size: 12px;
  }

  p {
    margin: 8px 0 0 0;
    font-size: 12px;
    color: #666;
    word-break: break-all;
  }
`;

export const ImageThumbnail = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export const ImageFull = styled.div`
  text-align: center;

  button {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-size: 16px;
  }

  img {
    max-width: 100%;
    max-height: 60vh;
    border-radius: 8px;
  }

  p {
    margin-top: 16px;
    color: #666;
  }
`;

export const ChecklistContainer = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;

  h4 {
    margin: 0 0 12px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      background: #ff4d4f;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
      font-size: 12px;
    }
  }
`;

export const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  button {
    background: #ff4d4f;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    font-size: 12px;
  }
`;

export const ChecklistItemText = styled.span<{ $completed: boolean }>`
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  color: ${props => props.$completed ? '#999' : '#333'};
  flex: 1;
`;

export const HistoryList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

export const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

export const HistoryTime = styled.span`
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  margin-left: 16px;
`;

export const LabelList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
`;

export const LabelItem = styled.span`
  background-color: #1890ff;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 12px;
    padding: 0;
  }
`;

export const ColorPicker = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

export const ColorOption = styled.button<{ $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: ${props => props.$color};
  border: 2px solid #ddd;
  cursor: pointer;

  &:hover {
    border-color: #1890ff;
  }
`;

export const FileInput = styled.label`
  display: inline-block;
  padding: 8px 16px;
  background-color: #1890ff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  input {
    display: none;
  }

  &:hover {
    opacity: 0.8;
  }
`;
