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
import { BoardData, Column as ColumnType, Card as CardType, CardHistory } from '../../types';

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
      description: 'Описание первой задачи', 
      columnId: 'col-1',
      lists: [],
      images: [],
      labels: [],
      checklists: []
    },
    { 
      id: 'card-2', 
      title: 'Вторая задача', 
      description: 'Описание второй задачи', 
      columnId: 'col-1',
      lists: [],
      images: [],
      labels: [],
      checklists: []
    },
    { 
      id: 'card-3', 
      title: 'Третья задача', 
      description: 'Описание третьей задачи', 
      columnId: 'col-2',
      lists: [],
      images: [],
      labels: [],
      checklists: []
    },
  ],
  history: []
};

export const Board: React.FC = () => {
  const [boardData, setBoardData] = useLocalStorage<BoardData>('kanban-board', initialData);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
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

  const addHistoryRecord = (cardId: string, action: string, oldValue?: any, newValue?: any, details?: any) => {
    const historyRecord: CardHistory = {
      id: generateId(),
      cardId,
      action,
      timestamp: new Date().toISOString(),
      oldValue,
      newValue,
      details
    };

    setBoardData(prev => ({
      ...prev,
      history: [historyRecord, ...(prev.history || [])].slice(0, 100)
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

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleSaveCard = (cardData: Omit<CardType, 'id' | 'columnId'>) => {
    if (modalState.mode === 'create' && modalState.columnId) {
      const newCard: CardType = {
        ...cardData,
        id: generateId(),
        columnId: modalState.columnId,
        lists: cardData.lists || [],
        images: cardData.images || [],
        labels: cardData.labels || [],
        checklists: cardData.checklists || []
      };

      setBoardData(prev => ({
        ...prev,
        cards: [...prev.cards, newCard],
        columns: prev.columns.map(col => 
          col.id === modalState.columnId 
            ? { ...col, cardIds: [...col.cardIds, newCard.id] }
            : col
        )
      }));

      addHistoryRecord(newCard.id, 'CARD_CREATED', null, newCard.title);
    } else if (modalState.mode === 'edit' && modalState.card) {
      const oldCard = modalState.card;
      
      // Сравниваем изменения для истории
      if (oldCard.title !== cardData.title) {
        addHistoryRecord(oldCard.id, 'TITLE_CHANGED', oldCard.title, cardData.title);
      }
      if (oldCard.description !== cardData.description) {
        addHistoryRecord(oldCard.id, 'DESCRIPTION_CHANGED', oldCard.description, cardData.description);
      }
      
      // Сравниваем списки
      const oldListsCount = oldCard.lists?.length || 0;
      const newListsCount = cardData.lists?.length || 0;
      if (oldListsCount !== newListsCount) {
        addHistoryRecord(oldCard.id, 'LISTS_CHANGED', oldListsCount, newListsCount, {
          action: oldListsCount < newListsCount ? 'LIST_ADDED' : 'LIST_REMOVED'
        });
      }

      // Сравниваем изображения
      const oldImagesCount = oldCard.images?.length || 0;
      const newImagesCount = cardData.images?.length || 0;
      if (oldImagesCount !== newImagesCount) {
        addHistoryRecord(oldCard.id, 'IMAGES_CHANGED', oldImagesCount, newImagesCount, {
          action: oldImagesCount < newImagesCount ? 'IMAGE_ADDED' : 'IMAGE_REMOVED'
        });
      }

      // Сравниваем метки
      const oldLabelsCount = oldCard.labels?.length || 0;
      const newLabelsCount = cardData.labels?.length || 0;
      if (oldLabelsCount !== newLabelsCount) {
        addHistoryRecord(oldCard.id, 'LABELS_CHANGED', oldLabelsCount, newLabelsCount, {
          action: oldLabelsCount < newLabelsCount ? 'LABEL_ADDED' : 'LABEL_REMOVED'
        });
      }

      // Сравниваем чеклисты
      const oldChecklistsCount = oldCard.checklists?.length || 0;
      const newChecklistsCount = cardData.checklists?.length || 0;
      if (oldChecklistsCount !== newChecklistsCount) {
        addHistoryRecord(oldCard.id, 'CHECKLISTS_CHANGED', oldChecklistsCount, newChecklistsCount, {
          action: oldChecklistsCount < newChecklistsCount ? 'CHECKLIST_ADDED' : 'CHECKLIST_REMOVED'
        });
      }

      setBoardData(prev => ({
        ...prev,
        cards: prev.cards.map(card => 
          card.id === modalState.card?.id 
            ? { 
                ...card, 
                ...cardData,
                lists: cardData.lists || card.lists,
                images: cardData.images || card.images,
                labels: cardData.labels || card.labels,
                checklists: cardData.checklists || card.checklists
              }
            : card
        )
      }));
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

    if (activeCard.columnId !== targetColumnId) {
      const fromColumn = boardData.columns.find(col => col.id === activeCard.columnId);
      const toColumn = boardData.columns.find(col => col.id === targetColumnId);
      
      addHistoryRecord(
        activeCard.id, 
        'CARD_MOVED', 
        fromColumn?.title, 
        toColumn?.title
      );
    }

    moveCard(activeId, activeCard.columnId, targetColumnId, newIndex);
  };

  const moveCard = (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => {
    setBoardData(prev => {
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

  const getCardHistory = (cardId: string): CardHistory[] => {
    return (boardData.history || []).filter(record => record.cardId === cardId);
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
                  onCardClick={openEditModal}
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
        mode={modalState.mode}
        columnTitle={getColumnTitle(modalState.columnId)}
        cardHistory={modalState.card ? getCardHistory(modalState.card.id) : []}
      />
    </>
  );
};
