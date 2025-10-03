import React, { useEffect, useRef, useState } from 'react';
import type { Card, CardHistory, Checklist, Image } from '../../types';
import ModalUtils from '../../helpers/ModalUtils';
import {
  Button,
  ButtonGroup,
  ChecklistContainer,
  ChecklistItem as ChecklistItemStyled,
  ChecklistItemText,
  CloseButton,
  DeleteButton,
  FileInput,
  FormGroup,
  HistoryItem,
  HistoryList,
  HistoryTime,
  ImageFull,
  ImageGallery,
  ImageItem,
  ImageThumbnail,
  Input,
  Label,
  LabelItem,
  LabelList,
  ModalContent,
  ModalHeader,
  ModalTitle,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  ModalOverlay,
  TextArea
} from './styled';

interface CardModalProps {
  card: Card | null;
  isOpen: boolean;
  onSave: (card: Omit<Card, 'id' | 'columnId' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (cardId: string, updates: Partial<Card>) => void;  
  onClose: () => void;
  onDelete: (cardId: string) => void;
  mode: 'create' | 'edit' | 'view';
  columnTitle?: string;
  history?: CardHistory[];
  onEdit: () => void;
}

export const CardModal: React.FC<CardModalProps> = ({
  card,
  isOpen,
  onSave,
  onUpdate,  
  onClose,
  onDelete,
  mode,
  columnTitle,
  history = [],
  onEdit
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [images, setImages] = useState<Image[]>([]);
  const [activeTab, setActiveTab] = useState('main');
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
 
  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description);
      setLabels(card.labels || []);
      setChecklists(card.checklists || []);
      setImages(card.images || []);
    } else {
      setTitle('');
      setDescription('');
      setLabels([]);
      setChecklists([]);
      setImages([]);
    }

    setActiveTab('main');
    setSelectedImage(null);
  }, [card, isOpen]);
const handleSave = () => {
  if (mode === 'create') {
 
    onSave({
      title: title.trim(),
      description: description.trim(),
      labels: labels || [],
      checklists: checklists || [],
      images: images || [],
      history: []  
    });
  } else if (mode === 'edit' && card) {
   
    const updatedCard = {
      title: title.trim(),
      description: description.trim(),
      labels: labels || [],
      checklists: checklists || [],
      images: images || [],
      history: card.history || [], 
    };
    onUpdate(card.id, updatedCard);
  }
  onClose();
};
  const handleAddLabel = () => {
    ModalUtils.handleAddLabel(newLabel, labels, setLabels, setNewLabel);
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    ModalUtils.handleRemoveLabel(labelToRemove, setLabels);
  };

  const handleAddChecklist = () => {
    ModalUtils.handleAddChecklist(newChecklistTitle, checklists, setChecklists, setNewChecklistTitle);
  };

  const handleDeleteChecklist = (checklistId: string) => {
    ModalUtils.handleDeleteChecklist(checklistId, setChecklists);
  };
 
  const handleToggleChecklistItem = (checklistId: string, itemId: string) => {
    ModalUtils.handleToggleChecklistItem(checklistId, itemId, setChecklists);
  };

  const handleDeleteChecklistItem = (checklistId: string, itemId: string) => {
    ModalUtils.handleDeleteChecklistItem(checklistId, itemId, setChecklists);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    ModalUtils.handleImageUpload(e, setImages, fileInputRef);
  };

  const handleDeleteImage = (imageId: string) => {
    ModalUtils.handleDeleteImage(imageId, images, setImages, selectedImage, setSelectedImage);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    ModalUtils.handleOverlayClick(e, onClose);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    ModalUtils.handleKeyDown(e, onClose, mode, handleSave);
  };

  const handleChecklistItemKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, checklistId: string) => {
    ModalUtils.handleChecklistItemKeyPress(e, checklistId, setChecklists);
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';

  return (
    <ModalOverlay onClick={handleOverlayClick} onKeyDown={handleKeyDown}>
      <ModalContent $wide={selectedImage !== null}>
        {selectedImage ? (
          <ImageFull>
            <button onClick={() => setSelectedImage(null)}>×</button>
            <img src={selectedImage.url} alt={selectedImage.name} />
            <p>{selectedImage.name}</p>
          </ImageFull>
        ) : (
          <>
            <ModalHeader>
              <ModalTitle>
                {mode === 'create' ? 'Создать карточку' : 
                 mode === 'edit' ? 'Редактировать карточку' : card?.title}
                {columnTitle && ` в "${columnTitle}"`}
              </ModalTitle>
              <CloseButton onClick={onClose}>×</CloseButton>
            </ModalHeader>

            <Tabs>
              <TabList>
                <Tab 
                  $isActive={activeTab === 'main'} 
                  onClick={() => setActiveTab('main')}
                >
                  Основное
                </Tab>
                <Tab 
                  $isActive={activeTab === 'images'} 
                  onClick={() => setActiveTab('images')}
                >
                  Изображения ({images.length})
                </Tab>
                <Tab 
                  $isActive={activeTab === 'checklists'} 
                  onClick={() => setActiveTab('checklists')}
                >
                  Чек-листы {checklists.length > 0 ? `(${checklists.length})` : ''}
                </Tab>
                <Tab 
                  $isActive={activeTab === 'history'} 
                  onClick={() => setActiveTab('history')}
                >
                  История ({history.length})
                </Tab>
              </TabList>

              <TabPanel $isActive={activeTab === 'main'}>
                <FormGroup>
                  <Label htmlFor="card-title">Название *</Label>
                  <Input
                    id="card-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Введите название карточки"
                    autoFocus={mode !== 'view'}
                    disabled={isViewMode}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="card-description">Описание</Label>
                  <TextArea
                    id="card-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Введите описание карточки"
                    rows={4}
                    disabled={isViewMode}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Метки</Label>
                  <LabelList>
                    {labels.map((label, index) => (
                      <LabelItem key={index}>
                        {label}
                        {!isViewMode && (
                          <button 
                            type="button"
                            onClick={() => handleRemoveLabel(label)}
                          >
                            ×
                          </button>
                        )}
                      </LabelItem>
                    ))}
                  </LabelList>
                  {!isViewMode && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <Input
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="Добавить метку"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddLabel()}
                      />
                      <Button 
                        type="button"
                        onClick={handleAddLabel}
                      >
                        Добавить
                      </Button>
                    </div>
                  )}
                </FormGroup>

                {!isViewMode && (
                  <ButtonGroup>
                    <Button 
                      type="button"
                      onClick={onClose}
                    >
                      Отмена
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleSave}
                      disabled={!title.trim()}
                      type="button"
                    >
                      {mode === 'create' ? 'Создать' : 'Сохранить'}
                    </Button>
                  </ButtonGroup>
                )}

                {isViewMode && card && (
                  <ButtonGroup>
                    <Button 
                      type="button"
                      onClick={onEdit}
                    >
                      Редактировать
                    </Button>
                    <DeleteButton 
                      onClick={() => {
                        if (window.confirm('Вы уверены, что хотите удалить эту карточку?')) {
                          onDelete(card.id);
                        }
                      }}
                      type="button"
                    >
                      Удалить карточку
                    </DeleteButton>
                  </ButtonGroup>
                )}
              </TabPanel>

              <TabPanel $isActive={activeTab === 'images'}>
                {!isViewMode && (
                  <FormGroup>
                    <FileInput>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        multiple
                      />
                      Загрузить изображения
                    </FileInput>
                  </FormGroup>
                )}
                
                <ImageGallery>
                  {images.map(image => (
                    <ImageItem key={image.id}>
                      <ImageThumbnail 
                        src={image.url} 
                        alt={image.name}
                        onClick={() => setSelectedImage(image)}
                      />
                      <p>{image.name}</p>
                      {!isViewMode && (
                        <button 
                          type="button"
                          onClick={() => handleDeleteImage(image.id)}
                        >
                          ×
                        </button>
                      )}
                    </ImageItem>
                  ))}
                  {images.length === 0 && (
                    <p>Нет загруженных изображений</p>
                  )}
                </ImageGallery>
              </TabPanel>

              <TabPanel $isActive={activeTab === 'checklists'}>
                {checklists.map(checklist => (
                  <ChecklistContainer key={checklist.id}>
                    <h4>{checklist.title}</h4>
                    {!isViewMode && (
                      <button 
                        type="button"
                        onClick={() => handleDeleteChecklist(checklist.id)}
                      >
                        Удалить
                      </button>
                    )}
                    
                    {(checklist.items || []).map(item => (
                      <ChecklistItemStyled key={item.id}>
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleToggleChecklistItem(checklist.id, item.id)}
                          disabled={isViewMode}
                        />
                        <ChecklistItemText $completed={item.completed}>
                          {item.text}
                        </ChecklistItemText>
                        {!isViewMode && (
                          <button 
                            type="button"
                            onClick={() => handleDeleteChecklistItem(checklist.id, item.id)}
                          >
                            ×
                          </button>
                        )}
                      </ChecklistItemStyled>
                    ))}
                    
                    {!isViewMode && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <Input
                          placeholder="Добавить пункт"
                          onKeyPress={(e) => handleChecklistItemKeyPress(e, checklist.id)}
                        />
                      </div>
                    )}
                  </ChecklistContainer>
                ))}
                
                {!isViewMode && (
                  <FormGroup>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Input
                        value={newChecklistTitle}
                        onChange={(e) => setNewChecklistTitle(e.target.value)}
                        placeholder="Название чек-листа"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddChecklist()}
                      />
                      <Button 
                        type="button"
                        onClick={handleAddChecklist}
                      >
                        Добавить чек-лист
                      </Button>
                    </div>
                  </FormGroup>
                )}
              </TabPanel>

            <TabPanel $isActive={activeTab === 'history'}>
  <HistoryList>
    {history.map(record => (
      <HistoryItem key={record.id}>
        <div>
          <strong>{record.action}</strong>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
            {record.details}
          </div>
        </div>
        <HistoryTime>
          {new Date(record.timestamp).toLocaleString()}
        </HistoryTime>
      </HistoryItem>
    ))}
    {history.length === 0 && <p>История изменений отсутствует</p>}
  </HistoryList>
</TabPanel>
            </Tabs>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};
