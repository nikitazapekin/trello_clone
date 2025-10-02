import React, { useState, useEffect } from 'react';
import { BoardContainer, AddColumnButton, MultiSelectButton } from './styled';
import { Column } from '@components/Column';
import { CardModal } from '@components/Modal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { BoardData, Column as ColumnType, Card as CardType, HistoryAction, HistoryChange } from '../../types';

const initialData: BoardData = {
  columns: [
    { id: 'col-1', title: 'To Do', cardIds: ['card-1', 'card-2', 'card-3'] },
    { id: 'col-2', title: 'In Progress', cardIds: [] },
    { id: 'col-3', title: 'Done', cardIds: [] }
  ],
  cards: [
    { 
      id: 'card-1', 
      title: 'Карточка 1', 
      description: 'Описание 1', 
      columnId: 'col-1',
      labels: ['важно'],
      checklists: [],
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 'card-2', 
      title: 'Карточка 2', 
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
      title: 'Карточка 3', 
      description: 'Описание 3', 
      columnId: 'col-1',
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
  
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Обработчик перемещения карточек
  useEffect(() => {
    const handleCardMove = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { cardId, fromColumnId, toColumnId, targetIndex } = customEvent.detail;
      moveCard(cardId, fromColumnId, toColumnId, targetIndex);
    };

    window.addEventListener('cardMove', handleCardMove);
    
    return () => {
      window.removeEventListener('cardMove', handleCardMove);
    };
  }, []); // Убрал зависимость от boardData


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
const moveCard = (cardId: string, fromColumnId: string, toColumnId: string, targetIndex: number) => {
    setBoardData(prev => {
      const card = prev.cards.find(c => c.id === cardId);
      if (!card) return prev;

      // Если перемещение внутри одной колонки
      if (fromColumnId === toColumnId) {
        const column = prev.columns.find(col => col.id === fromColumnId);
        if (!column) return prev;

        const oldIndex = column.cardIds.indexOf(cardId);
        if (oldIndex === -1) return prev;

        // Если новая позиция совпадает со старой, ничего не делаем
        if (oldIndex === targetIndex) return prev;

        // Создаем новый порядок карточек
        const newCardIds = [...column.cardIds];
        
        // Удаляем карточку из старой позиции
        newCardIds.splice(oldIndex, 1);
        // Вставляем в новую позицию
        newCardIds.splice(targetIndex, 0, cardId);

        return {
          ...prev,
          columns: prev.columns.map(col =>
            col.id === fromColumnId ? { ...col, cardIds: newCardIds } : col
          )
        };
      } else {
        // Перемещение между колонками
        const updatedCards = prev.cards.map(c =>
          c.id === cardId ? { ...c, columnId: toColumnId } : c
        );

        const updatedColumns = prev.columns.map(column => {
          if (column.id === fromColumnId) {
            // Удаляем из исходной колонки
            return {
              ...column,
              cardIds: column.cardIds.filter(id => id !== cardId)
            };
          }
          if (column.id === toColumnId) {
            // Добавляем в целевую колонку
            const newCardIds = [...column.cardIds];
            newCardIds.splice(targetIndex, 0, cardId);
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

      <BoardContainer>
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
              isMultiSelectMode={isMultiSelectMode}
              selectedCards={selectedCards}
              onToggleCardSelection={toggleCardSelection}
            />
          );
        })}
        
        <AddColumnButton onClick={addColumn}>
          + Добавить колонку
        </AddColumnButton>
      </BoardContainer>

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
