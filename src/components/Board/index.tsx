import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { BoardContainer, AddColumnButton } from './styled';
import { Column } from '@components/Column';
import { Card } from '../Card';
import { CardModal } from '@components/Modal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { BoardData, Column as ColumnType, Card as CardType, HistoryAction, HistoryField } from '../../types';

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addHistoryRecord = (cardId: string, action: HistoryAction, changes: Array<{
    field: HistoryField;
    oldValue: string | null | CardType;
    newValue: string | null | CardType;
  }>) => {
    const historyRecord = {
      id: generateId(),
      cardId,
      action,
      timestamp: new Date().toISOString(),
      changes
    };

    setBoardData(prev => ({
      ...prev,
      history: [historyRecord, ...prev.history.slice(0, 49)]
    }));
  };
 
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

      addHistoryRecord(cardId, 'Удаление карточки', [
        { field: 'card', oldValue: card, newValue: null }
      ]);

      return {
        ...prev,
        cards: prev.cards.filter(c => c.id !== cardId),
        columns: prev.columns.map(col => ({
          ...col,
          cardIds: col.cardIds.filter(id => id !== cardId)
        }))
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

      addHistoryRecord(newCard.id, 'Создание карточки', [
        { field: 'card', oldValue: null, newValue: newCard }
      ]);

      setBoardData(prev => ({
        ...prev,
        cards: [...prev.cards, newCard],
        columns: prev.columns.map(col => 
          col.id === modalState.columnId 
            ? { ...col, cardIds: [...col.cardIds, newCard.id] }
            : col
        )
      }));
      
      closeModal();
      
    } else if (modalState.mode === 'edit' && modalState.card) {
      const changes: Array<{
        field: HistoryField;
        oldValue: string | null | CardType;
        newValue: string | null | CardType;
      }> = [];
      
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

      if (changes.length > 0) {
        addHistoryRecord(modalState.card.id, 'Изменение карточки', changes);
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
        )
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

    moveCard(activeId, activeCard.columnId, targetColumnId, newIndex);
  };

  const moveCard = (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => {
    setBoardData(prev => {
      const card = prev.cards.find(c => c.id === cardId);
      if (!card) return prev;

      if (fromColumnId === toColumnId) {
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

        addHistoryRecord(cardId, 'Перемещение карточки', [
          { 
            field: 'column', 
            oldValue: fromColumnId, 
            newValue: toColumnId 
          }
        ]);

        return {
          ...prev,
          columns: updatedColumns,
          cards: updatedCards
        };
      }
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
            <Card card={activeCard} onClick={() => {}} isDragging />
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
