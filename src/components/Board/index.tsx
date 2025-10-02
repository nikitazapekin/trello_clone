
// Board.tsx
import React, { useState, useCallback } from 'react';
import { Column } from '../Column';
import type { Card as CardType, Column as ColumnType } from '../../types';

export const Board: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType[]>([
    { id: 'col1', title: 'To Do', cardIds: [] , order: 1  },
    { id: 'col2', title: 'In Progress', cardIds: [], order: 2 },
    { id: 'col3', title: 'Done', cardIds: [], order: 3}
  ]);

  const [cards, setCards] = useState<CardType[]>([
    { 
      id: 'card1', 
      title: 'Задача 1', 
      description: 'Описание задачи 1',
      columnId: 'col1',
      labels: ['важно'],
      images: [],
      checklists: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 'card2', 
      title: 'Задача 2', 
      description: 'Описание задачи 2',
      columnId: 'col1',
      labels: ['срочно'],
      images: [],
      checklists: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 'card3', 
      title: 'Задача 3', 
      description: 'Описание задачи 3',
      columnId: 'col2',
      labels: [],
      images: [],
      checklists: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 'card4', 
      title: 'Задача 4', 
      description: 'Описание задачи 4',
      columnId: 'col3',
      labels: ['исправлено'],
      images: [],
      checklists: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const [draggedCard, setDraggedCard] = useState<{id: string, columnId: string} | null>(null);
  const [lastHoveredCardId, setLastHoveredCardId] = useState<string | null>(null);
  const [hoverHistory, setHoverHistory] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState<boolean>(false);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  const handleDragStart = useCallback((cardId: string, columnId: string) => {
    setDraggedCard({ id: cardId, columnId });
    setLastHoveredCardId(null);
    setHoverHistory([]);
    console.log(`Начало перетаскивания карточки: ${cardId}`);
  }, []);

  const handleDragEnd = useCallback(() => {
    console.log('Завершение перетаскивания');
    console.log('История наведения:', hoverHistory);
    
    if (draggedCard && lastHoveredCardId && draggedCard.id !== lastHoveredCardId) {
      console.log(`Обмен позициями: ${draggedCard.id} ↔ ${lastHoveredCardId}`);
      
      setCards(prevCards => {
        const newCards = [...prevCards];
        const draggedIndex = newCards.findIndex(card => card.id === draggedCard.id);
        const targetIndex = newCards.findIndex(card => card.id === lastHoveredCardId);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
          const draggedCardData = newCards[draggedIndex];
          const targetCardData = newCards[targetIndex];
          
          // Сохраняем оригинальные columnId
          const draggedColumnId = draggedCardData.columnId;
          const targetColumnId = targetCardData.columnId;
          
          // Меняем карточки местами с обновлением columnId
          newCards[draggedIndex] = { 
            ...targetCardData, 
            columnId: draggedColumnId,
            updatedAt: new Date().toISOString()
          };
          newCards[targetIndex] = { 
            ...draggedCardData, 
            columnId: targetColumnId,
            updatedAt: new Date().toISOString()
          };
          
          console.log('Карточки успешно поменялись местами');
        }
        
        return newCards;
      });
    }
    
    setDraggedCard(null);
    setLastHoveredCardId(null);
    setHoverHistory([]);
  }, [draggedCard, lastHoveredCardId, hoverHistory]);

  const handleDragOver = useCallback((targetCardId: string) => {
    if (draggedCard && draggedCard.id !== targetCardId) {
      setLastHoveredCardId(targetCardId);
      setHoverHistory(prev => {
        const newHistory = [...prev, targetCardId];
        console.log(`Наведение на карточку: ${targetCardId}`);
        console.log('Полная история наведения:', newHistory);
        return newHistory;
      });
    }
  }, [draggedCard]);

  const handleDrop = useCallback((draggedCardId: string, targetCardId: string) => {
    console.log(`DROP: Перетаскиваемая ${draggedCardId} → Целевая ${targetCardId}`);
  }, []);

  const handleDropToEmpty = useCallback((draggedCardId: string, targetColumnId: string) => {
    console.log(`DROP TO EMPTY: Карточка ${draggedCardId} → Колонка ${targetColumnId}`);
    
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === draggedCardId 
          ? { 
              ...card, 
              columnId: targetColumnId,
              updatedAt: new Date().toISOString()
            }
          : card
      )
    );
  }, []);

  const handleAddCard = useCallback((columnId: string) => {
    const newCard: CardType = {
      id: `card${Date.now()}`,
      title: `Новая задача ${cards.filter(card => card.columnId === columnId).length + 1}`,
      description: '',
      columnId: columnId,
      labels: [],
      images: [],
      checklists: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCards(prev => [...prev, newCard]);
  }, [cards]);

  const handleUpdateColumnTitle = useCallback((columnId: string, newTitle: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, title: newTitle } : col
    ));
  }, []);

  const handleDeleteColumn = useCallback((columnId: string) => {
    setColumns(prev => prev.filter(col => col.id !== columnId));
    setCards(prev => prev.filter(card => card.columnId !== columnId));
  }, []);

  const handleCardClick = useCallback((card: CardType) => {
    console.log('Карточка кликнута:', card.id);
    
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
    }
  }, [isMultiSelectMode]);

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
        // При включении режима множественного выбора очищаем предыдущий выбор
        setSelectedCards(new Set());
      } else {
        // При выключении очищаем выбор
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
    setCards(prev => prev.map(card => 
      selectedCards.has(card.id) 
        ? { 
            ...card, 
            columnId: targetColumnId,
            updatedAt: new Date().toISOString()
          }
        : card
    ));
    setSelectedCards(new Set());
  }, [selectedCards]);

  // Обновляем cardIds в колонках на основе текущих карточек
  const columnsWithCardIds = columns.map(column => ({
    ...column,
    cardIds: cards.filter(card => card.columnId === column.id).map(card => card.id)
  }));

  return (
    <div style={{ padding: '20px' }}>
      {/* Панель управления */}
      <div style={{
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap'
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

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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

      {/* Панель отладки перетаскивания */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1000,
        maxWidth: '300px'
      }}>
        <div><strong>Отладка перетаскивания:</strong></div>
        <div>Перетаскиваемая: {draggedCard?.id || 'нет'}</div>
        <div>Последняя наведенная: {lastHoveredCardId || 'нет'}</div>
        <div>История наведения: {hoverHistory.join(' → ')}</div>
        <div>Режим выбора: {isMultiSelectMode ? 'ВКЛ' : 'ВЫКЛ'}</div>
        <div>Выбрано карточек: {selectedCards.size}</div>
      </div>

      {/* Колонки */}
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
        {columnsWithCardIds.map(column => (
          <Column
            key={column.id}
            column={column}
            cards={cards.filter(card => card.columnId === column.id)}
            onAddCard={handleAddCard}
            onUpdateColumnTitle={handleUpdateColumnTitle}
            onDeleteColumn={handleDeleteColumn}
            onCardClick={handleCardClick}
            isMultiSelectMode={isMultiSelectMode}
            selectedCards={selectedCards}
            onToggleCardSelection={handleToggleCardSelection}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDropToEmpty={handleDropToEmpty}
            draggedCard={draggedCard}
            lastHoveredCardId={lastHoveredCardId}
          />
        ))}
        
        {/* Кнопка добавления новой колонки */}
        <div style={{ minWidth: '280px' }}>
          <button
            onClick={() => {
              const newColumn: ColumnType = {
                id: `col${Date.now()}`,
                title: 'Новая колонка',
                cardIds: [], 
                order: columns.length+1
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
      </div>

      {/* Статистика */}
      <div style={{
        marginTop: '20px',
        padding: '12px',
        backgroundColor: '#f9f9f9',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#666'
      }}>
        <div>Всего колонок: {columns.length}</div>
        <div>Всего карточек: {cards.length}</div>
        <div>Карточек по колонкам: {columns.map(col => 
          `${col.title}: ${cards.filter(card => card.columnId === col.id).length}`
        ).join(' | ')}</div>
      </div>
    </div>
  );
};

export default Board;
/* // Board.tsx
import React, { useState, useCallback } from 'react';
import { Column } from '../Column';
import type { Card as CardType, Column as ColumnType } from '../../types';

export const Board: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType[]>([
    { id: 'col1', title: 'To Do', cardIds: [] , order: 1,},
    { id: 'col2', title: 'In Progress', cardIds: [] ,order: 2 },
    { id: 'col3', title: 'Done', cardIds: [], order: 3 }
  ]);

  const [cards, setCards] = useState<CardType[]>([
    { 
      id: 'card1', 
      title: 'Задача 1', 
      description: 'Описание задачи 1',
      columnId: 'col1',
      labels: ['важно'],
      images: [],
      checklists: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 'card2', 
      title: 'Задача 2', 
      description: 'Описание задачи 2',
      columnId: 'col1',
      labels: ['срочно'],
      images: [],
      checklists: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 'card3', 
      title: 'Задача 3', 
      description: 'Описание задачи 3',
      columnId: 'col2',
      labels: [],
      images: [],
      checklists: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 'card4', 
      title: 'Задача 4', 
      description: 'Описание задачи 4',
      columnId: 'col3',
      labels: ['исправлено'],
      images: [],
      checklists: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const [draggedCard, setDraggedCard] = useState<{id: string, columnId: string} | null>(null);
  const [lastHoveredCardId, setLastHoveredCardId] = useState<string | null>(null);
  const [hoverHistory, setHoverHistory] = useState<string[]>([]);

  const handleDragStart = useCallback((cardId: string, columnId: string) => {
    setDraggedCard({ id: cardId, columnId });
    setLastHoveredCardId(null);
    setHoverHistory([]);
    console.log(`Начало перетаскивания карточки: ${cardId}`);
  }, []);

  const handleDragEnd = useCallback(() => {
    console.log('Завершение перетаскивания');
    console.log('История наведения:', hoverHistory);
    
    if (draggedCard && lastHoveredCardId && draggedCard.id !== lastHoveredCardId) {
      console.log(`Обмен позициями: ${draggedCard.id} ↔ ${lastHoveredCardId}`);
      
      setCards(prevCards => {
        const newCards = [...prevCards];
        const draggedIndex = newCards.findIndex(card => card.id === draggedCard.id);
        const targetIndex = newCards.findIndex(card => card.id === lastHoveredCardId);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
          const draggedCardData = newCards[draggedIndex];
          const targetCardData = newCards[targetIndex];
          
          // Сохраняем оригинальные columnId
          const draggedColumnId = draggedCardData.columnId;
          const targetColumnId = targetCardData.columnId;
          
          // Меняем карточки местами с обновлением columnId
          newCards[draggedIndex] = { 
            ...targetCardData, 
            columnId: draggedColumnId,
            updatedAt: new Date().toISOString()
          };
          newCards[targetIndex] = { 
            ...draggedCardData, 
            columnId: targetColumnId,
            updatedAt: new Date().toISOString()
          };
          
          console.log('Карточки успешно поменялись местами');
        }
        
        return newCards;
      });
    }
    
    setDraggedCard(null);
    setLastHoveredCardId(null);
    setHoverHistory([]);
  }, [draggedCard, lastHoveredCardId, hoverHistory]);

  const handleDragOver = useCallback((targetCardId: string) => {
    if (draggedCard && draggedCard.id !== targetCardId) {
      setLastHoveredCardId(targetCardId);
      setHoverHistory(prev => {
        const newHistory = [...prev, targetCardId];
        console.log(`Наведение на карточку: ${targetCardId}`);
        console.log('Полная история наведения:', newHistory);
        return newHistory;
      });
    }
  }, [draggedCard]);

  const handleDrop = useCallback((draggedCardId: string, targetCardId: string) => {
    console.log(`DROP: Перетаскиваемая ${draggedCardId} → Целевая ${targetCardId}`);
  }, []);

  const handleDropToEmpty = useCallback((draggedCardId: string, targetColumnId: string) => {
    console.log(`DROP TO EMPTY: Карточка ${draggedCardId} → Колонка ${targetColumnId}`);
    
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === draggedCardId 
          ? { 
              ...card, 
              columnId: targetColumnId,
              updatedAt: new Date().toISOString()
            }
          : card
      )
    );
  }, []);

  const handleAddCard = useCallback((columnId: string) => {
    const newCard: CardType = {
      id: `card${Date.now()}`,
      title: `Новая задача ${cards.filter(card => card.columnId === columnId).length + 1}`,
      description: '',
      columnId: columnId,
      labels: [],
      images: [],
      checklists: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCards(prev => [...prev, newCard]);
  }, [cards]);

  const handleUpdateColumnTitle = useCallback((columnId: string, newTitle: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, title: newTitle } : col
    ));
  }, []);

  const handleDeleteColumn = useCallback((columnId: string) => {
    setColumns(prev => prev.filter(col => col.id !== columnId));
    setCards(prev => prev.filter(card => card.columnId !== columnId));
  }, []);

  const handleCardClick = useCallback((card: CardType) => {
    console.log('Карточка кликнута:', card.id);
  }, []);

  // Обновляем cardIds в колонках на основе текущих карточек
  const columnsWithCardIds = columns.map(column => ({
    ...column,
    cardIds: cards.filter(card => card.columnId === column.id).map(card => card.id)
  }));

  return (
    <div style={{ display: 'flex', gap: '16px', padding: '20px' }}>
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1000,
        maxWidth: '300px'
      }}>
        <div><strong>Отладка перетаскивания:</strong></div>
        <div>Перетаскиваемая: {draggedCard?.id || 'нет'}</div>
        <div>Последняя наведенная: {lastHoveredCardId || 'нет'}</div>
        <div>История наведения: {hoverHistory.join(' → ')}</div>
      </div>

      {columnsWithCardIds.map(column => (
        <Column
          key={column.id}
          column={column}
          cards={cards.filter(card => card.columnId === column.id)}
          onAddCard={handleAddCard}
          onUpdateColumnTitle={handleUpdateColumnTitle}
          onDeleteColumn={handleDeleteColumn}
          onCardClick={handleCardClick}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDropToEmpty={handleDropToEmpty}
          draggedCard={draggedCard}
          lastHoveredCardId={lastHoveredCardId}
        />
      ))}
    </div>
  );
};
 */
