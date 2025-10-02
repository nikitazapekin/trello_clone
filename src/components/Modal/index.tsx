import React, { useState, useEffect, useRef } from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  FormGroup,
  Label,
  Input,
  TextArea,
  ButtonGroup,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  ImageGallery,
  ImageItem,
  ImageThumbnail,
  ImageFull,
  ChecklistContainer,
  ChecklistItem as ChecklistItemStyled,
  ChecklistItemText,
  HistoryList,
  HistoryItem,
  HistoryTime,
  LabelList,
  LabelItem,
  FileInput,
  DeleteButton
} from './styled';
import { Card, CardHistory, Checklist, ChecklistItem, Image } from '../../types';

interface CardModalProps {
  card: Card | null;
  isOpen: boolean;
  onSave: (card: Omit<Card, 'id' | 'columnId' | 'createdAt' | 'updatedAt'>) => void;
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

  const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        title: title.trim(),
        description: description.trim(),
        labels: labels || [],
        checklists: checklists || [],
        images: images || []
      });
    }
  };

  const handleAddLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels(prev => [...prev, newLabel.trim()]);
      setNewLabel('');
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setLabels(prev => prev.filter(label => label !== labelToRemove));
  };

  const handleAddChecklist = () => {
    if (newChecklistTitle.trim()) {
      const newChecklist: Checklist = {
        id: generateId(),
        title: newChecklistTitle.trim(),
        items: []
      };
      setChecklists(prev => [...prev, newChecklist]);
      setNewChecklistTitle('');
    }
  };

  const handleDeleteChecklist = (checklistId: string) => {
    setChecklists(prev => prev.filter(checklist => checklist.id !== checklistId));
  };

  const handleAddChecklistItem = (checklistId: string, text: string) => {
    if (text.trim()) {
      const newItem: ChecklistItem = {
        id: generateId(),
        text: text.trim(),
        completed: false
      };
      
      setChecklists(prev => prev.map(checklist => 
        checklist.id === checklistId 
          ? {
              ...checklist,
              items: [...(checklist.items || []), newItem]
            }
          : checklist
      ));
    }
  };

  const handleToggleChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(prev => prev.map(checklist => 
      checklist.id === checklistId 
        ? {
            ...checklist,
            items: (checklist.items || []).map(item =>
              item.id === itemId 
                ? { ...item, completed: !item.completed }
                : item
            )
          }
        : checklist
    ));
  };

  const handleDeleteChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(prev => prev.map(checklist => 
      checklist.id === checklistId 
        ? {
            ...checklist,
            items: (checklist.items || []).filter(item => item.id !== itemId)
          }
        : checklist
    ));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: Image = {
          id: generateId(),
          url: e.target?.result as string,
          name: file.name,
          uploadedAt: new Date().toISOString()
        };
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = (imageId: string) => {
    setImages(prev => prev.filter(image => image.id !== imageId));
    if (selectedImage?.id === imageId) {
      setSelectedImage(null);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && e.ctrlKey && mode !== 'view') {
      handleSave();
    }
  };

  const handleChecklistItemKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, checklistId: string) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      handleAddChecklistItem(checklistId, target.value);
      target.value = '';
    }
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
                        {record.changes.map((change, index) => (
                          <div key={index} style={{ fontSize: '12px', color: '#666' }}>
                            {change.field}: {String(change.oldValue)} → {String(change.newValue)}
                          </div>
                        ))}
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
