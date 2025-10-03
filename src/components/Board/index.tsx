import React, { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Column } from '../Column';
import { CardModal } from '@components/Modal';
import type { Card as CardType, Column as ColumnType, BoardData, CardHistory } from '../../types';
import { defaultColumns } from './constants';
import { createDragHandlers } from '../../helpers/DragUtils';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CardsWrapper } from './styled';

export const Board: React.FC = () => {
 
  const [savedBoardData, setSavedBoardData] = useLocalStorage<BoardData>('board-data', {
    columns: defaultColumns,
    cards: [],
    history: []
  });

  const [columns, setColumns] = useState<ColumnType[]>(savedBoardData.columns);
  const [cards, setCards] = useState<CardType[]>(savedBoardData.cards);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState<boolean>(false);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    card: CardType | null;
    mode: 'create' | 'edit' | 'view';
    columnId?: string;
  }>({
    isOpen: false,
    card: null,
    mode: 'view'
  });
 
  useEffect(() => {
    const hasChanges = 
      JSON.stringify(columns) !== JSON.stringify(savedBoardData.columns) ||
      JSON.stringify(cards) !== JSON.stringify(savedBoardData.cards);

    if (hasChanges) {
      setSavedBoardData({
        columns,
        cards,
        history: []  
      });
    }
  }, [columns, cards]);  

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { handleDragStart, handleDragOver, handleDragEnd } = createDragHandlers(
    cards,
    columns,
    setActiveCard,
    setCards
  );

  const handleCardClick = useCallback((card: CardType) => {
    if (isMultiSelectMode) {
      setSelectedCards(prev => {
        const newSelected = new Set(prev);
        if (newSelected.has(card.id)) {
          newSelected.delete(card.id);
        } else {
          newSelected.add(card.id);
        }
        return newSelected;
      });
    } else {
      setModalState({
        isOpen: true,
        card: card,
        mode: 'view'
      });
    }
  }, [isMultiSelectMode]);

  const handleEditCard = useCallback(() => {
    if (modalState.card) {
      setModalState(prev => ({
        ...prev,
        mode: 'edit'
      }));
    }
  }, [modalState.card]);

  const handleUpdateCard = useCallback((cardId: string, updates: Partial<CardType>) => {
    setCards(prev => prev.map(card => {
      if (card.id === cardId) {
        const oldCard = { ...card };
        const newCard = { 
          ...card, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };
 
        const changes: string[] = [];

        if (oldCard.title !== newCard.title) {
          changes.push(`Название: "${oldCard.title}" → "${newCard.title}"`);
        }

        if (oldCard.description !== newCard.description) {
          if (!oldCard.description && newCard.description) {
            changes.push('Добавлено описание');
          } else if (oldCard.description && !newCard.description) {
            changes.push('Удалено описание');
          } else {
            changes.push('Изменено описание');
          }
        }

        if (JSON.stringify(oldCard.labels) !== JSON.stringify(newCard.labels)) {
          const oldLabels = oldCard.labels.join(', ') || 'нет';
          const newLabels = newCard.labels.join(', ') || 'нет';
          changes.push(`Метки: ${oldLabels} → ${newLabels}`);
        }

        if (JSON.stringify(oldCard.checklists) !== JSON.stringify(newCard.checklists)) {
          const oldCount = oldCard.checklists.length;
          const newCount = newCard.checklists.length;
          if (newCount > oldCount) {
            changes.push(`Добавлен чек-лист: "${newCard.checklists[newCount - 1].title}"`);
          } else if (newCount < oldCount) {
            changes.push('Удален чек-лист');
          } else {
            changes.push('Изменены чек-листы');
          }
        }

        if (JSON.stringify(oldCard.images) !== JSON.stringify(newCard.images)) {
          const oldCount = oldCard.images.length;
          const newCount = newCard.images.length;
          if (newCount > oldCount) {
            changes.push(`Добавлено изображение: "${newCard.images[newCount - 1].name}"`);
          } else if (newCount < oldCount) {
            changes.push('Удалено изображение');
          } else {
            changes.push('Изменены изображения');
          }
        }
 
        if (changes.length > 0) {
          const historyEntry: CardHistory = {
            id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            action: 'Изменение карточки',
            details: changes.join('; '),
            timestamp: new Date().toISOString()
          };

          return {
            ...newCard,
            history: [...(oldCard.history || []), historyEntry]
          };
        }

        return newCard;
      }
      return card;
    }));
  }, []);

  const handleSaveCard = useCallback((cardData: Omit<CardType, 'id' | 'columnId' | 'createdAt' | 'updatedAt' | 'history'>) => {
    if (modalState.mode === 'create' && modalState.columnId) {
      const newCard: CardType = {
        ...cardData,
        id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        columnId: modalState.columnId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [{
          id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          action: 'Создание карточки',
          details: `Карточка "${cardData.title}" создана`,
          timestamp: new Date().toISOString()
        }]
      };
      setCards(prev => [...prev, newCard]);
    } else if (modalState.card && modalState.mode === 'edit') {
   
      handleUpdateCard(modalState.card.id, {
        ...cardData,
        updatedAt: new Date().toISOString()
      });
    }
    setModalState({ isOpen: false, card: null, mode: 'view' });
  }, [modalState, handleUpdateCard]);

  const handleDeleteCard = useCallback((cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
    setModalState({ isOpen: false, card: null, mode: 'view' });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState({ isOpen: false, card: null, mode: 'view' });
  }, []);

  const handleAddCard = useCallback((columnId: string) => {
    setModalState({
      isOpen: true,
      card: null,
      mode: 'create',
      columnId: columnId
    });
  }, []);

  const handleUpdateColumnTitle = useCallback((columnId: string, newTitle: string) => {
    setColumns(prev => prev.map(col => {
      if (col.id === columnId) {
        return { ...col, title: newTitle };
      }
      return col;
    }));
  }, []);

  const handleDeleteColumn = useCallback((columnId: string) => {
    setColumns(prev => prev.filter(col => col.id !== columnId));
    setCards(prev => prev.filter(card => card.columnId !== columnId));
  }, []);

  const handleToggleCardSelection = useCallback((cardId: string) => {
    setSelectedCards(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(cardId)) {
        newSelected.delete(cardId);
      } else {
        newSelected.add(cardId);
      }
      return newSelected;
    });
  }, []);

  const handleToggleMultiSelectMode = useCallback(() => {
    setIsMultiSelectMode(prev => {
      if (!prev) {
        setSelectedCards(new Set());
      } else {
        setSelectedCards(new Set());
      }
      return !prev;
    });
  }, []);

  const handleDeleteSelectedCards = useCallback(() => {
    setCards(prev => prev.filter(card => !selectedCards.has(card.id)));
    setSelectedCards(new Set());
  }, [selectedCards]);

  const handleMoveSelectedCards = useCallback((targetColumnId: string) => {
    const targetColumn = columns.find(col => col.id === targetColumnId);
    
    setCards(prev => prev.map(card => {
      if (selectedCards.has(card.id) && card.columnId !== targetColumnId) {
        const oldColumn = columns.find(col => col.id === card.columnId);
        
        // Добавляем запись в историю о перемещении
        const moveHistory: CardHistory = {
          id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          action: 'Перемещение карточки',
          details: `Перемещена из "${oldColumn?.title || 'Неизвестная колонка'}" в "${targetColumn?.title || 'Неизвестная колонка'}"`,
          timestamp: new Date().toISOString()
        };

        return { 
          ...card, 
          columnId: targetColumnId,
          updatedAt: new Date().toISOString(),
          history: [...(card.history || []), moveHistory]
        };
      }
      return card;
    }));
    setSelectedCards(new Set());
  }, [selectedCards, columns]);

  const getColumnTitle = (columnId: string) => {
    return columns.find(col => col.id === columnId)?.title || '';
  };

  const getCardHistory = useCallback((cardId?: string) => {
    if (!cardId) return [];
    const card = cards.find(c => c.id === cardId);
    return card?.history || [];
  }, [cards]);

  return (
    <div style={{ padding: '20px', width: "100%" }}>
      
      <div style={{
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
    
      }}>
        <button
          onClick={handleToggleMultiSelectMode}
          style={{
            padding: '8px 16px',
            backgroundColor: isMultiSelectMode ? '#1890ff' : '#fff',
            color: isMultiSelectMode ? '#fff' : '#333',
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {isMultiSelectMode ? 'Отменить выбор' : 'Множественный выбор'}
        </button>

        {isMultiSelectMode && selectedCards.size > 0 && (
          <>
            <span style={{ fontSize: '14px', color: '#666' }}>
              Выбрано: {selectedCards.size} карточек
            </span>
            
            <button
              onClick={handleDeleteSelectedCards}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ff4d4f',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Удалить выбранные
            </button>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' ,  }}>
              <span style={{ fontSize: '14px', color: '#666' }}>Переместить в:</span>
              {columns.map(column => (
                <button
                  key={column.id}
                  onClick={() => handleMoveSelectedCards(column.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#52c41a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {column.title}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      
      >
        <CardsWrapper>
          {columns.map(column => {
            const columnCards = cards.filter(card => card.columnId === column.id);
            return (
              <Column
                key={column.id}
                column={column}
                cards={columnCards}
                onAddCard={handleAddCard}
                onUpdateColumnTitle={handleUpdateColumnTitle}
                onDeleteColumn={handleDeleteColumn}
                onCardClick={handleCardClick}
                isMultiSelectMode={isMultiSelectMode}
                selectedCards={selectedCards}
                onToggleCardSelection={handleToggleCardSelection}
              />
            );
          })}
           
          <div style={{ minWidth: '280px' }}>
            <button
              onClick={() => {
                const newColumn: ColumnType = {
                  id: `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  title: 'Новая колонка',
                  cardIds: [],
                  order: columns.length + 1
                };
                setColumns(prev => [...prev, newColumn]);
              }}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#f0f0f0',
                border: '2px dashed #d9d9d9',
                borderRadius: '8px',
                color: '#666',
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'center'
              }}
            >
              + Добавить колонку
            </button>
          </div>
        </CardsWrapper>
        
        <DragOverlay>
          {activeCard ? (
            <div style={{
              opacity: 0.8,
              transform: 'rotate(5deg)',
              backgroundColor: 'white',
              border: '2px solid #1890ff',
              borderRadius: '8px',
              padding: '12px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              cursor: 'grabbing',
              maxWidth: '280px'
            }}>
              <strong>{activeCard.title}</strong>
              {activeCard.description && (
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
                  {activeCard.description}
                </p>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CardModal
        card={modalState.card}
        isOpen={modalState.isOpen}
        onSave={handleSaveCard}
        onUpdate={handleUpdateCard}
        onClose={handleCloseModal}
        onDelete={handleDeleteCard}
        mode={modalState.mode}
        columnTitle={modalState.card ? getColumnTitle(modalState.card.columnId) : 
                    modalState.columnId ? getColumnTitle(modalState.columnId) : undefined}
        history={getCardHistory(modalState.card?.id)}
        onEdit={handleEditCard}
      />
    </div>
  );
};

export default Board;
