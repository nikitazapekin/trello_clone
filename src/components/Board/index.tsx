import React, { useState } from 'react';
import { Column } from '@components/Column';
import { CardModal } from '@components/Modal';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent} from '@dnd-kit/core';
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';

import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { BoardData, Card as CardType, Column as ColumnType, HistoryAction,   HistoryChange } from '../../types';
import { Card } from '../Card';

import { AddColumnButton, BoardContainer, MultiSelectButton } from './styled';

const initialData: BoardData = {
  columns: [
    { id: 'col-1', title: 'To Do', cardIds: ['card-1', 'card-2'] },
    { id: 'col-2', title: 'In Progress', cardIds: ['card-3'] },
    { id: 'col-3', title: 'Done', cardIds: [] }
  ],
  cards: [
    { 
      id: 'card-1', 
      title: 'Первая задача', 
      description: 'Описание 1', 
      columnId: 'col-1',
      labels: ['важно', 'срочно'],
      checklists: [],
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 'card-2', 
      title: 'Вторая задача', 
      description: 'Описание 2', 
      columnId: 'col-1',
      labels: [],
      checklists: [],
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 'card-3', 
      title: 'Третья задача', 
      description: 'Описание 3', 
      columnId: 'col-2',
      labels: [],
      checklists: [],
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
  ],
  history: []
};

export const Board: React.FC = () => {
  const [boardData, setBoardData] = useLocalStorage<BoardData>('kanban-board', initialData);
  
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view';
    columnId?: string;
    card?: CardType | null;
  }>({
    isOpen: false,
    mode: 'create',
    card: null
  });
  
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Функции для множественного выбора
  const toggleMultiSelectMode = () => {
    setIsMultiSelectMode(!isMultiSelectMode);

    if (isMultiSelectMode) {
      setSelectedCards(new Set());
    }
  };

  const toggleCardSelection = (cardId: string) => {
    if (!isMultiSelectMode) return;
    
    setSelectedCards(prev => {
      const newSelection = new Set(prev);

      if (newSelection.has(cardId)) {
        newSelection.delete(cardId);
      } else {
        newSelection.add(cardId);
      }

      return newSelection;
    });
  };

  const clearSelection = () => {
    setSelectedCards(new Set());
  };

  const isCardSelected = (cardId: string) => selectedCards.has(cardId);
 
  const addColumn = () => {
    const newColumn: ColumnType = {
      id: generateId(),
      title: 'Новая колонка',
      cardIds: []
    };

    setBoardData(prev => ({
      ...prev,
      columns: [...prev.columns, newColumn]
    }));
  };

  const updateColumnTitle = (columnId: string, title: string) => {
    setBoardData(prev => ({
      ...prev,
      columns: prev.columns.map(col => 
        col.id === columnId ? { ...col, title } : col
      )
    }));
  };

  const deleteColumn = (columnId: string) => {
    setBoardData(prev => {
      const column = prev.columns.find(col => col.id === columnId);

      if (!column) return prev;
 
      const remainingCards = prev.cards.filter(card => card.columnId !== columnId);

      return {
        ...prev,
        columns: prev.columns.filter(col => col.id !== columnId),
        cards: remainingCards
      };
    });
  };

  const deleteCard = (cardId: string) => {
    setBoardData(prev => {
      const card = prev.cards.find(c => c.id === cardId);

      if (!card) return prev;

      const changes: HistoryChange[] = [
        { 
          field: 'card', 
          oldValue: card, 
          newValue: null 
        }
      ];

      const historyRecord = {
        id: generateId(),
        cardId,
        action: 'Удаление карточки' as HistoryAction,
        timestamp: new Date().toISOString(),
        changes
      };

      return {
        ...prev,
        cards: prev.cards.filter(c => c.id !== cardId),
        columns: prev.columns.map(col => ({
          ...col,
          cardIds: col.cardIds.filter(id => id !== cardId)
        })),
        history: [historyRecord, ...prev.history.slice(0, 49)]
      };
    });
    closeModal();
  };
 
  const openCreateModal = (columnId: string) => {
    setModalState({
      isOpen: true,
      mode: 'create',
      columnId,
      card: null
    });
  };

  const openEditModal = (card: CardType) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      columnId: card.columnId,
      card
    });
  };

  const openViewModal = (card: CardType) => {
    setModalState({
      isOpen: true,
      mode: 'view',
      columnId: card.columnId,
      card
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: 'create',
      card: null
    });
  };

  const handleSaveCard = (cardData: Omit<CardType, 'id' | 'columnId' | 'createdAt' | 'updatedAt'>) => {
    if (modalState.mode === 'create' && modalState.columnId) {
      const newCard: CardType = {
        ...cardData,
        id: generateId(),
        columnId: modalState.columnId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const changes: HistoryChange[] = [
        { 
          field: 'card', 
          oldValue: null, 
          newValue: newCard
        }
      ];

      const historyRecord = {
        id: generateId(),
        cardId: newCard.id,
        action: 'Создание карточки' as HistoryAction,
        timestamp: new Date().toISOString(),
        changes
      };

      setBoardData(prev => ({
        ...prev,
        cards: [...prev.cards, newCard],
        columns: prev.columns.map(col => 
          col.id === modalState.columnId 
            ? { ...col, cardIds: [...col.cardIds, newCard.id] }
            : col
        ),
        history: [historyRecord, ...prev.history.slice(0, 49)]
      }));
      
      closeModal();
      
    } else if (modalState.mode === 'edit' && modalState.card) {
      const changes: HistoryChange[] = [];
      
      if (modalState.card.title !== cardData.title) {
        changes.push({ 
          field: 'title', 
          oldValue: modalState.card.title, 
          newValue: cardData.title 
        });
      }
      
      if (modalState.card.description !== cardData.description) {
        changes.push({ 
          field: 'description', 
          oldValue: modalState.card.description, 
          newValue: cardData.description 
        });
      }
      
      const oldLabels = modalState.card.labels || [];
      const newLabels = cardData.labels || [];

      if (JSON.stringify(oldLabels) !== JSON.stringify(newLabels)) {
        changes.push({ 
          field: 'labels', 
          oldValue: oldLabels.join(', '), 
          newValue: newLabels.join(', ') 
        });
      }
      
      const oldChecklists = modalState.card.checklists || [];
      const newChecklists = cardData.checklists || [];

      if (JSON.stringify(oldChecklists) !== JSON.stringify(newChecklists)) {
        changes.push({ 
          field: 'checklists', 
          oldValue: `Чек-листов: ${oldChecklists.length}`, 
          newValue: `Чек-листов: ${newChecklists.length}` 
        });
      }
      
      const oldImages = modalState.card.images || [];
      const newImages = cardData.images || [];

      if (JSON.stringify(oldImages) !== JSON.stringify(newImages)) {
        changes.push({ 
          field: 'images', 
          oldValue: `Изображений: ${oldImages.length}`, 
          newValue: `Изображений: ${newImages.length}` 
        });
      }

      let historyRecord = null;

      if (changes.length > 0) {
        historyRecord = {
          id: generateId(),
          cardId: modalState.card.id,
          action: 'Изменение карточки' as HistoryAction,
          timestamp: new Date().toISOString(),
          changes
        };
      }

      setBoardData(prev => ({
        ...prev,
        cards: prev.cards.map(card => 
          card.id === modalState.card?.id 
            ? { 
                ...card, 
                ...cardData,
                updatedAt: new Date().toISOString()
              }
            : card
        ),
        history: historyRecord 
          ? [historyRecord, ...prev.history.slice(0, 49)]
          : prev.history
      }));
      
      closeModal();
    }
  };
 
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const cardId = active.id as string;
    const card = boardData.cards.find(c => c.id === cardId);

    if (card) {
      setActiveCard(card);
      setActiveColumnId(card.columnId);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    
    if (!over) {
      setActiveColumnId(null);

      return;
    }

    const overId = over.id as string;
     
    const overColumn = boardData.columns.find(col => col.id === overId);

    if (overColumn) {
      setActiveColumnId(overColumn.id);

      return;
    }
   
    const overCard = boardData.cards.find(card => card.id === overId);

    if (overCard) {
      setActiveColumnId(overCard.columnId);

      return;
    }
   
    if (over.data?.current?.type === 'column') {
      setActiveColumnId(overId);
    }
  };  

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveCard(null);
    setActiveColumnId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
   
    const activeCard = boardData.cards.find(card => card.id === activeId);

    if (!activeCard) return;

    let targetColumnId: string | undefined;

    const overColumn = boardData.columns.find(col => col.id === overId);

    if (overColumn || over.data?.current?.type === 'column') {
      targetColumnId = overColumn ? overColumn.id : overId;
    } else {
      const overCard = boardData.cards.find(card => card.id === overId);

      if (overCard) {
        targetColumnId = overCard.columnId;
      }
    }

    if (!targetColumnId) return;
   
    let newIndex: number;

    if (over.data?.current?.type === 'card') {
      const targetColumn = boardData.columns.find(col => col.id === targetColumnId);
      const overCardIndex = targetColumn?.cardIds.indexOf(overId) ?? -1;
      
      newIndex = overCardIndex !== -1 ? overCardIndex : 0;
    } else {
      const targetColumn = boardData.columns.find(col => col.id === targetColumnId);

      newIndex = targetColumn?.cardIds.length ?? 0;
    }

    // Если есть выбранные карточки и активная карточка среди них, перемещаем все выбранные
    if (selectedCards.size > 0 && selectedCards.has(activeId)) {
      moveMultipleCards(Array.from(selectedCards), activeCard.columnId, targetColumnId, newIndex);
      clearSelection();
    } else {
      moveCard(activeId, activeCard.columnId, targetColumnId, newIndex);
    }
  };

  const moveCard = (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => {
    setBoardData(prev => {
      const card = prev.cards.find(c => c.id === cardId);

      if (!card) return prev;

      if (fromColumnId === toColumnId) {
        // Перемещение внутри одной колонки
        const column = prev.columns.find(col => col.id === fromColumnId);

        if (!column) return prev;

        const oldIndex = column.cardIds.indexOf(cardId);

        if (oldIndex === -1) return prev;

        const newCardIds = arrayMove(column.cardIds, oldIndex, newIndex);

        return {
          ...prev,
          columns: prev.columns.map(col =>
            col.id === fromColumnId ? { ...col, cardIds: newCardIds } : col
          )
        };
      } else {
        // Перемещение между колонками
        const updatedCards = prev.cards.map(card =>
          card.id === cardId ? { ...card, columnId: toColumnId } : card
        );

        const updatedColumns = prev.columns.map(column => {
          if (column.id === fromColumnId) {
            return {
              ...column,
              cardIds: column.cardIds.filter(id => id !== cardId)
            };
          }

          if (column.id === toColumnId) {
            const newCardIds = [...column.cardIds];

            newCardIds.splice(newIndex, 0, cardId);

            return {
              ...column,
              cardIds: newCardIds
            };
          }

          return column;
        });

        const fromColumnTitle = prev.columns.find(col => col.id === fromColumnId)?.title || fromColumnId;
        const toColumnTitle = prev.columns.find(col => col.id === toColumnId)?.title || toColumnId;

        const changes: HistoryChange[] = [
          { 
            field: 'column', 
            oldValue: fromColumnTitle, 
            newValue: toColumnTitle 
          }
        ];

        const historyRecord = {
          id: generateId(),
          cardId,
          action: 'Перемещение карточки' as HistoryAction,
          timestamp: new Date().toISOString(),
          changes
        };

        return {
          ...prev,
          columns: updatedColumns,
          cards: updatedCards,
          history: [historyRecord, ...prev.history.slice(0, 49)]
        };
      }
    });
  };

  const moveMultipleCards = (cardIds: string[], fromColumnId: string, toColumnId: string, startIndex: number) => {
    setBoardData(prev => {
      const cardsToMove = prev.cards.filter(card => cardIds.includes(card.id));

      if (cardsToMove.length === 0) return prev;

      const updatedCards = prev.cards.map(card =>
        cardIds.includes(card.id) ? { ...card, columnId: toColumnId } : card
      );

      const updatedColumns = prev.columns.map(column => {
        if (column.id === fromColumnId) {
          // Удаляем все перемещаемые карточки из исходной колонки
          return {
            ...column,
            cardIds: column.cardIds.filter(id => !cardIds.includes(id))
          };
        }

        if (column.id === toColumnId) {
          // Добавляем карточки в целевую колонку начиная с указанной позиции
          const newCardIds = [...column.cardIds];

          cardIds.forEach((cardId, index) => {
            newCardIds.splice(startIndex + index, 0, cardId);
          });

          return {
            ...column,
            cardIds: newCardIds
          };
        }

        return column;
      });

      const fromColumnTitle = prev.columns.find(col => col.id === fromColumnId)?.title || fromColumnId;
      const toColumnTitle = prev.columns.find(col => col.id === toColumnId)?.title || toColumnId;

      // Создаем записи истории для каждой перемещенной карточки
      const historyRecords = cardIds.map(cardId => ({
        id: generateId(),
        cardId,
        action: 'Перемещение карточки' as HistoryAction,
        timestamp: new Date().toISOString(),
        changes: [
          { 
            field: 'column', 
            oldValue: fromColumnTitle, 
            newValue: toColumnTitle 
          }
        ]
      }));

      return {
        ...prev,
        columns: updatedColumns,
        cards: updatedCards,
        history: [...historyRecords, ...prev.history.slice(0, 50 - historyRecords.length)]
      };
    });
  };

  const getColumnTitle = (columnId?: string) => {
    if (!columnId) return '';

    const column = boardData.columns.find(col => col.id === columnId);

    return column?.title || '';
  };

  const getCardHistory = (cardId?: string) => {
    if (!cardId) return [];

    return boardData.history.filter(record => record.cardId === cardId);
  };

  return (
    <>
      <MultiSelectButton 
        onClick={toggleMultiSelectMode}
        $isActive={isMultiSelectMode}
      >
        {isMultiSelectMode ? 'Отменить выбор' : 'Выбрать несколько'}
        {selectedCards.size > 0 && ` (${selectedCards.size})`}
      </MultiSelectButton>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <BoardContainer>
          <SortableContext 
            items={boardData.columns.map(col => col.id)} 
            strategy={horizontalListSortingStrategy}
          >
            {boardData.columns.map(column => {
              const columnCards = boardData.cards.filter(card => 
                column.cardIds.includes(card.id)
              );
              
              return (
                <Column
                  key={column.id}
                  column={column}
                  cards={columnCards}
                  onAddCard={openCreateModal}
                  onUpdateColumnTitle={updateColumnTitle}
                  onDeleteColumn={deleteColumn}
                  onCardClick={openViewModal}
                  isActive={activeColumnId === column.id}
                  isMultiSelectMode={isMultiSelectMode}
                  selectedCards={selectedCards}
                  onToggleCardSelection={toggleCardSelection}
                />
              );
            })}
          </SortableContext>
          
          <AddColumnButton onClick={addColumn}>
            + Добавить колонку
          </AddColumnButton>
        </BoardContainer>

        <DragOverlay>
          {activeCard ? (
            <Card 
              card={activeCard} 
              onClick={() => {}} 
              isDragging 
              isMultiSelectMode={isMultiSelectMode}
              isSelected={isCardSelected(activeCard.id)}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <CardModal
        isOpen={modalState.isOpen}
        card={modalState.card}
        onSave={handleSaveCard}
        onClose={closeModal}
        onDelete={deleteCard}
        mode={modalState.mode}
        columnTitle={getColumnTitle(modalState.columnId)}
        history={getCardHistory(modalState.card?.id)}
        onEdit={() => modalState.card && openEditModal(modalState.card)}
      />
    </>
  );
};
