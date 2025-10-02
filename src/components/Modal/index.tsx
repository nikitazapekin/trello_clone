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
  TabContainer,
  TabButton,
  TabContent,
  ListContainer,
  ListItem,
  ListInput,
  AddButton,
  DeleteButton,
  ImageUploadArea,
  ImagePreview,
  ImageContainer,
  LabelContainer,
  LabelItem,
  ColorInput,
  ChecklistContainer,
  ChecklistItem,
  ChecklistHeader,
  HistoryContainer,
  HistoryItem,
  HistoryTime,
  HistoryAction,
  CardPreview,
  PreviewSection,
  PreviewTitle,
  PreviewContent,
  PreviewLabels,
  PreviewLabel,
  PreviewImages,
  PreviewImage,
  PreviewList,
  PreviewListItem,
  PreviewChecklist,
  PreviewChecklistItem,
  EmptyState,
  ImageModal,
  ImageModalContent,
  ImageModalImg,
  ImageModalClose
} from './styled';
import { Card, CardHistory, CardList, CardImage, CardLabel, CardChecklist, ChecklistItem as ChecklistItemType } from '../../types';

interface CardModalProps {
  card: Card | null;
  isOpen: boolean;
  onSave: (card: Omit<Card, 'id' | 'columnId'>) => void;
  onClose: () => void;
  onDelete?: () => void;
  mode: 'create' | 'edit';
  columnTitle?: string;
  cardHistory?: CardHistory[];
}

export const CardModal: React.FC<CardModalProps> = ({
  card,
  isOpen,
  onSave,
  onClose,
  onDelete,
  mode,
  columnTitle,
  cardHistory = []
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'main' | 'preview' | 'lists' | 'images' | 'labels' | 'checklists' | 'history'>('main');
  const [lists, setLists] = useState<CardList[]>([]);
  const [images, setImages] = useState<CardImage[]>([]);
  const [labels, setLabels] = useState<CardLabel[]>([]);
  const [checklists, setChecklists] = useState<CardChecklist[]>([]);
  const [newListItem, setNewListItem] = useState<{ [listId: string]: string }>({});
  const [newChecklistItem, setNewChecklistItem] = useState<{ [checklistId: string]: string }>({});
  const [selectedImage, setSelectedImage] = useState<CardImage | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Сбрасываем состояние при открытии/закрытии модального окна
  useEffect(() => {
    if (isOpen) {
      if (card) {
        // Режим редактирования
        setTitle(card.title || '');
        setDescription(card.description || '');
        setLists(card.lists || []);
        setImages(card.images || []);
        setLabels(card.labels || []);
        setChecklists(card.checklists || []);
      } else {
        // Режим создания
        setTitle('');
        setDescription('');
        setLists([]);
        setImages([]);
        setLabels([]);
        setChecklists([]);
      }
      setActiveTab('main');
    }
  }, [isOpen, card]);

  const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Lists functionality
  const addList = () => {
    const newList: CardList = {
      id: generateId(),
      title: 'Новый список',
      items: []
    };
    setLists(prev => [...prev, newList]);
  };

  const updateListTitle = (listId: string, title: string) => {
    setLists(prev => prev.map(list => 
      list.id === listId ? { ...list, title } : list
    ));
  };

  const deleteList = (listId: string) => {
    setLists(prev => prev.filter(list => list.id !== listId));
  };

  const addListItem = (listId: string) => {
    const text = newListItem[listId]?.trim();
    if (!text) return;

    setLists(prev => prev.map(list => 
      list.id === listId 
        ? { ...list, items: [...list.items, { id: generateId(), text, completed: false }] }
        : list
    ));
    setNewListItem(prev => ({ ...prev, [listId]: '' }));
  };

  const toggleListItem = (listId: string, itemId: string) => {
    setLists(prev => prev.map(list => 
      list.id === listId 
        ? { 
            ...list, 
            items: list.items.map(item => 
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          }
        : list
    ));
  };

  const deleteListItem = (listId: string, itemId: string) => {
    setLists(prev => prev.map(list => 
      list.id === listId 
        ? { ...list, items: list.items.filter(item => item.id !== itemId) }
        : list
    ));
  };

  // Images functionality
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: CardImage = {
          id: generateId(),
          url: e.target?.result as string,
          name: file.name
        };
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const deleteImage = (imageId: string) => {
    setImages(prev => prev.filter(image => image.id !== imageId));
  };

  const openImageModal = (image: CardImage) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Labels functionality
  const addLabel = () => {
    const newLabel: CardLabel = {
      id: generateId(),
      text: 'Новая метка',
      color: '#ff6b6b'
    };
    setLabels(prev => [...prev, newLabel]);
  };

  const updateLabel = (labelId: string, field: 'text' | 'color', value: string) => {
    setLabels(prev => prev.map(label => 
      label.id === labelId ? { ...label, [field]: value } : label
    ));
  };

  const deleteLabel = (labelId: string) => {
    setLabels(prev => prev.filter(label => label.id !== labelId));
  };

  // Checklists functionality
  const addChecklist = () => {
    const newChecklist: CardChecklist = {
      id: generateId(),
      title: 'Новый чеклист',
      items: []
    };
    setChecklists(prev => [...prev, newChecklist]);
  };

  const updateChecklistTitle = (checklistId: string, title: string) => {
    setChecklists(prev => prev.map(checklist => 
      checklist.id === checklistId ? { ...checklist, title } : checklist
    ));
  };

  const deleteChecklist = (checklistId: string) => {
    setChecklists(prev => prev.filter(checklist => checklist.id !== checklistId));
  };

  const addChecklistItem = (checklistId: string) => {
    const text = newChecklistItem[checklistId]?.trim();
    if (!text) return;

    setChecklists(prev => prev.map(checklist => 
      checklist.id === checklistId 
        ? { 
            ...checklist, 
            items: [...checklist.items, { id: generateId(), text, completed: false }] 
          }
        : checklist
    ));
    setNewChecklistItem(prev => ({ ...prev, [checklistId]: '' }));
  };

  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(prev => prev.map(checklist => 
      checklist.id === checklistId 
        ? { 
            ...checklist, 
            items: checklist.items.map(item => 
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          }
        : checklist
    ));
  };

  const deleteChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(prev => prev.map(checklist => 
      checklist.id === checklistId 
        ? { ...checklist, items: checklist.items.filter(item => item.id !== itemId) }
        : checklist
    ));
  };

  const handleSave = () => {
    if (title.trim()) {
      const cardData: Omit<Card, 'id' | 'columnId'> = {
        title: title.trim(),
        description: description.trim(),
        lists,
        images,
        labels,
        checklists
      };
      
      console.log('Saving card data:', cardData);
      onSave(cardData);
    } else {
      alert('Пожалуйста, введите название карточки');
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      onDelete();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (selectedImage) {
        closeImageModal();
      } else {
        onClose();
      }
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  const formatHistoryTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ru-RU');
  };

  const getHistoryActionText = (history: CardHistory) => {
    switch (history.action) {
      case 'CARD_CREATED':
        return `Создана карточка "${history.newValue}"`;
      case 'CARD_DELETED':
        return `Удалена карточка "${history.oldValue}"`;
      case 'TITLE_CHANGED':
        return `Название изменено с "${history.oldValue}" на "${history.newValue}"`;
      case 'DESCRIPTION_CHANGED':
        return `Описание изменено`;
      case 'CARD_MOVED':
        return `Перемещена из "${history.oldValue}" в "${history.newValue}"`;
      case 'LISTS_CHANGED':
        const listAction = history.details?.action === 'LIST_ADDED' ? 'добавлен' : 'удален';
        return `Список ${listAction}. Элементов: ${history.oldValue} → ${history.newValue}`;
      case 'IMAGES_CHANGED':
        const imageAction = history.details?.action === 'IMAGE_ADDED' ? 'добавлено' : 'удалено';
        return `Изображений ${imageAction}: ${history.oldValue} → ${history.newValue}`;
      case 'LABELS_CHANGED':
        const labelAction = history.details?.action === 'LABEL_ADDED' ? 'добавлена' : 'удалена';
        return `Метка ${labelAction}. Всего: ${history.oldValue} → ${history.newValue}`;
      case 'CHECKLISTS_CHANGED':
        const checklistAction = history.details?.action === 'CHECKLIST_ADDED' ? 'добавлен' : 'удален';
        return `Чеклист ${checklistAction}. Всего: ${history.oldValue} → ${history.newValue}`;
      default:
        return history.action;
    }
  };

  const hasContent = 
    description.trim() || 
    (labels && labels.length > 0) || 
    (images && images.length > 0) || 
    (lists && lists.length > 0) || 
    (checklists && checklists.length > 0);

  if (!isOpen) return null;

  return (
    <>
      <ModalOverlay onClick={handleOverlayClick} onKeyDown={handleKeyDown}>
        <ModalContent style={{ maxWidth: '800px', width: '90%' }}>
          <ModalHeader>
            <ModalTitle>
              {mode === 'create' ? 'Создать карточку' : 'Редактировать карточку'}
              {columnTitle && ` в "${columnTitle}"`}
            </ModalTitle>
            <CloseButton onClick={onClose}>×</CloseButton>
          </ModalHeader>

          <TabContainer>
            <TabButton 
              $active={activeTab === 'main'} 
              onClick={() => setActiveTab('main')}
            >
              Основное
            </TabButton>
            <TabButton 
              $active={activeTab === 'preview'} 
              onClick={() => setActiveTab('preview')}
            >
              Просмотр
            </TabButton>
            <TabButton 
              $active={activeTab === 'lists'} 
              onClick={() => setActiveTab('lists')}
            >
              Списки ({lists.length})
            </TabButton>
            <TabButton 
              $active={activeTab === 'images'} 
              onClick={() => setActiveTab('images')}
            >
              Изображения ({images.length})
            </TabButton>
            <TabButton 
              $active={activeTab === 'labels'} 
              onClick={() => setActiveTab('labels')}
            >
              Метки ({labels.length})
            </TabButton>
            <TabButton 
              $active={activeTab === 'checklists'} 
              onClick={() => setActiveTab('checklists')}
            >
              Чеклисты ({checklists.length})
            </TabButton>
            {mode === 'edit' && (
              <TabButton 
                $active={activeTab === 'history'} 
                onClick={() => setActiveTab('history')}
              >
                История
              </TabButton>
            )}
          </TabContainer>

          <TabContent>
            {activeTab === 'main' && (
              <>
                <FormGroup>
                  <Label htmlFor="card-title">Название карточки *</Label>
                  <Input
                    id="card-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Введите название карточки"
                    autoFocus
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="card-description">Описание задачи</Label>
                  <TextArea
                    id="card-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Опишите детали задачи..."
                    rows={6}
                  />
                </FormGroup>
              </>
            )}

            {activeTab === 'preview' && (
              <CardPreview>
                <PreviewSection>
                  <PreviewTitle>Название задачи</PreviewTitle>
                  <PreviewContent>{title || 'Нет названия'}</PreviewContent>
                </PreviewSection>

                {description && (
                  <PreviewSection>
                    <PreviewTitle>Описание</PreviewTitle>
                    <PreviewContent style={{ whiteSpace: 'pre-wrap' }}>{description}</PreviewContent>
                  </PreviewSection>
                )}

                {labels && labels.length > 0 && (
                  <PreviewSection>
                    <PreviewTitle>Метки</PreviewTitle>
                    <PreviewLabels>
                      {labels.map(label => (
                        <PreviewLabel key={label.id} $color={label.color}>
                          {label.text}
                        </PreviewLabel>
                      ))}
                    </PreviewLabels>
                  </PreviewSection>
                )}

                {images && images.length > 0 && (
                  <PreviewSection>
                    <PreviewTitle>Изображения ({images.length})</PreviewTitle>
                    <PreviewImages>
                      {images.map(image => (
                        <PreviewImage key={image.id} onClick={() => openImageModal(image)}>
                          <img src={image.url} alt={image.name} />
                          <div className="image-name">{image.name}</div>
                        </PreviewImage>
                      ))}
                    </PreviewImages>
                  </PreviewSection>
                )}

                {lists && lists.length > 0 && (
                  <PreviewSection>
                    <PreviewTitle>Списки</PreviewTitle>
                    {lists.map(list => (
                      <div key={list.id} style={{ marginBottom: '16px' }}>
                        <PreviewContent style={{ fontWeight: '600', marginBottom: '8px' }}>
                          {list.title}
                        </PreviewContent>
                        <PreviewList>
                          {list.items.map(item => (
                            <PreviewListItem key={item.id} $completed={item.completed}>
                              {item.text}
                            </PreviewListItem>
                          ))}
                        </PreviewList>
                      </div>
                    ))}
                  </PreviewSection>
                )}

                {checklists && checklists.length > 0 && (
                  <PreviewSection>
                    <PreviewTitle>Чеклисты</PreviewTitle>
                    {checklists.map(checklist => {
                      const total = checklist.items.length;
                      const completed = checklist.items.filter(item => item.completed).length;
                      const progress = total > 0 ? (completed / total) * 100 : 0;
                      
                      return (
                        <PreviewChecklist key={checklist.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <PreviewContent style={{ fontWeight: '600' }}>
                              {checklist.title}
                            </PreviewContent>
                            <span style={{ fontSize: '12px', color: '#666' }}>
                              {completed}/{total}
                            </span>
                          </div>
                          <div style={{ 
                            background: '#f0f0f0', 
                            borderRadius: '4px', 
                            height: '6px', 
                            marginBottom: '8px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              background: '#1890ff', 
                              height: '100%', 
                              width: `${progress}%`,
                              transition: 'width 0.3s ease'
                            }} />
                          </div>
                          <div>
                            {checklist.items.map(item => (
                              <PreviewChecklistItem key={item.id} $completed={item.completed}>
                                {item.text}
                              </PreviewChecklistItem>
                            ))}
                          </div>
                        </PreviewChecklist>
                      );
                    })}
                  </PreviewSection>
                )}

                {!hasContent && (
                  <EmptyState>
                    Карточка пока пуста. Добавьте описание, метки, изображения или списки.
                  </EmptyState>
                )}
              </CardPreview>
            )}

            {activeTab === 'lists' && (
              <div>
                <AddButton onClick={addList}>+ Добавить список</AddButton>
                {lists.map(list => (
                  <ListContainer key={list.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Input
                        value={list.title}
                        onChange={(e) => updateListTitle(list.id, e.target.value)}
                        placeholder="Название списка"
                      />
                      <DeleteButton onClick={() => deleteList(list.id)}>×</DeleteButton>
                    </div>
                    
                    {list.items.map(item => (
                      <ListItem key={item.id}>
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleListItem(list.id, item.id)}
                        />
                        <span style={{ 
                          textDecoration: item.completed ? 'line-through' : 'none',
                          flex: 1 
                        }}>
                          {item.text}
                        </span>
                        <DeleteButton 
                          onClick={() => deleteListItem(list.id, item.id)}
                          style={{ fontSize: '12px', padding: '2px 6px' }}
                        >
                          ×
                        </DeleteButton>
                      </ListItem>
                    ))}
                    
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <ListInput
                        value={newListItem[list.id] || ''}
                        onChange={(e) => setNewListItem(prev => ({ ...prev, [list.id]: e.target.value }))}
                        placeholder="Новый элемент списка"
                        onKeyPress={(e) => e.key === 'Enter' && addListItem(list.id)}
                      />
                      <Button onClick={() => addListItem(list.id)}>Добавить</Button>
                    </div>
                  </ListContainer>
                ))}
              </div>
            )}

            {activeTab === 'images' && (
              <div>
                <ImageUploadArea 
                  onClick={() => fileInputRef.current?.click()}
                >
                  Нажмите для загрузки изображений
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </ImageUploadArea>
                
                <ImageContainer>
                  {images.map(image => (
                    <ImagePreview key={image.id}>
                      <img 
                        src={image.url} 
                        alt={image.name} 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '200px',
                          cursor: 'pointer'
                        }}
                        onClick={() => openImageModal(image)}
                      />
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>{image.name}</div>
                      <DeleteButton 
                        onClick={() => deleteImage(image.id)}
                        style={{ position: 'absolute', top: '4px', right: '4px' }}
                      >
                        ×
                      </DeleteButton>
                    </ImagePreview>
                  ))}
                </ImageContainer>
              </div>
            )}

            {activeTab === 'labels' && (
              <div>
                <AddButton onClick={addLabel}>+ Добавить метку</AddButton>
                <LabelContainer>
                  {labels.map(label => (
                    <LabelItem key={label.id} $color={label.color}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <ColorInput
                          type="color"
                          value={label.color}
                          onChange={(e) => updateLabel(label.id, 'color', e.target.value)}
                        />
                        <Input
                          value={label.text}
                          onChange={(e) => updateLabel(label.id, 'text', e.target.value)}
                          placeholder="Текст метки"
                          style={{ flex: 1 }}
                        />
                        <DeleteButton onClick={() => deleteLabel(label.id)}>×</DeleteButton>
                      </div>
                    </LabelItem>
                  ))}
                </LabelContainer>
              </div>
            )}

            {activeTab === 'checklists' && (
              <div>
                <AddButton onClick={addChecklist}>+ Добавить чеклист</AddButton>
                {checklists.map(checklist => {
                  const totalItems = checklist.items.length;
                  const completedItems = checklist.items.filter(item => item.completed).length;
                  
                  return (
                    <ChecklistContainer key={checklist.id}>
                      <ChecklistHeader>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                          <Input
                            value={checklist.title}
                            onChange={(e) => updateChecklistTitle(checklist.id, e.target.value)}
                            placeholder="Название чеклиста"
                          />
                          <span style={{ fontSize: '12px', color: '#666' }}>
                            {completedItems}/{totalItems}
                          </span>
                        </div>
                        <DeleteButton onClick={() => deleteChecklist(checklist.id)}>×</DeleteButton>
                      </ChecklistHeader>
                      
                      {checklist.items.map(item => (
                        <ChecklistItem key={item.id}>
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleChecklistItem(checklist.id, item.id)}
                          />
                          <span style={{ 
                            textDecoration: item.completed ? 'line-through' : 'none',
                            flex: 1 
                          }}>
                            {item.text}
                          </span>
                          <DeleteButton 
                            onClick={() => deleteChecklistItem(checklist.id, item.id)}
                            style={{ fontSize: '12px', padding: '2px 6px' }}
                          >
                            ×
                          </DeleteButton>
                        </ChecklistItem>
                      ))}
                      
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <ListInput
                          value={newChecklistItem[checklist.id] || ''}
                          onChange={(e) => setNewChecklistItem(prev => ({ ...prev, [checklist.id]: e.target.value }))}
                          placeholder="Новый пункт чеклиста"
                          onKeyPress={(e) => e.key === 'Enter' && addChecklistItem(checklist.id)}
                        />
                        <Button onClick={() => addChecklistItem(checklist.id)}>Добавить</Button>
                      </div>
                    </ChecklistContainer>
                  );
                })}
              </div>
            )}

            {activeTab === 'history' && (
              <HistoryContainer>
                {cardHistory.length === 0 ? (
                  <EmptyState>
                    История изменений отсутствует
                  </EmptyState>
                ) : (
                  cardHistory.map(history => (
                    <HistoryItem key={history.id}>
                      <HistoryAction>{getHistoryActionText(history)}</HistoryAction>
                      <HistoryTime>{formatHistoryTime(history.timestamp)}</HistoryTime>
                    </HistoryItem>
                  ))
                )}
              </HistoryContainer>
            )}
          </TabContent>

          <ButtonGroup>
            {mode === 'edit' && onDelete && (
              <Button 
                onClick={handleDelete} 
                type="button"
                style={{ backgroundColor: '#ff4d4f', color: 'white', borderColor: '#ff4d4f', marginRight: 'auto' }}
              >
                Удалить задачу
              </Button>
            )}
            <Button onClick={onClose} type="button">Отмена</Button>
            <Button 
              variant="primary" 
              onClick={handleSave}
              disabled={!title.trim()}
              type="button"
            >
              {mode === 'create' ? 'Создать' : 'Сохранить'}
            </Button>
          </ButtonGroup>
        </ModalContent>
      </ModalOverlay>

      {/* Модальное окно для просмотра изображений */}
      {selectedImage && (
        <ImageModal onClick={closeImageModal}>
          <ImageModalContent onClick={(e) => e.stopPropagation()}>
            <ImageModalClose onClick={closeImageModal}>×</ImageModalClose>
            <ImageModalImg src={selectedImage.url} alt={selectedImage.name} />
            <div style={{ textAlign: 'center', marginTop: '16px', color: '#666' }}>
              {selectedImage.name}
            </div>
          </ImageModalContent>
        </ImageModal>
      )}
    </>
  );
};
