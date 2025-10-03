import { arrayMove } from '@dnd-kit/sortable';
import { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import type { Card, Column } from '../types';

export interface DragHandlers {
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
}

export const createDragHandlers = (
  cards: Card[],
  columns: Column[],
  setActiveCard: (card: Card | null) => void,
  setCards: (cards: Card[] | ((prev: Card[]) => Card[])) => void
): DragHandlers => {
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const cardId = active.id as string;
    const card = cards.find(c => c.id === cardId);
    
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
 
    const activeCard = cards.find(c => c.id === activeId);
    if (!activeCard) return;
 
    const overCard = cards.find(c => c.id === overId);
    if (overCard) {
      const overColumnId = overCard.columnId;
      
      if (activeCard.columnId !== overColumnId) {
        setCards(items => 
          items.map(item => 
            item.id === activeId 
              ? { ...item, columnId: overColumnId, updatedAt: new Date().toISOString() }
              : item
          )
        );
      }
    } 
    
    else if (columns.some(col => col.id === overId)) {
      setCards(items => 
        items.map(item => 
          item.id === activeId 
            ? { ...item, columnId: overId, updatedAt: new Date().toISOString() }
            : item
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
 
    if (activeId !== overId) {
      const activeCard = cards.find(c => c.id === activeId);
      const overCard = cards.find(c => c.id === overId);
      
      if (activeCard && overCard && activeCard.columnId === overCard.columnId) {
        const columnCards = cards.filter(c => c.columnId === activeCard.columnId);
        const oldIndex = columnCards.findIndex(c => c.id === activeId);
        const newIndex = columnCards.findIndex(c => c.id === overId);

        if (oldIndex !== newIndex) {
          const newCardOrder = arrayMove(columnCards, oldIndex, newIndex);
          const otherCards = cards.filter(c => c.columnId !== activeCard.columnId);
          
          setCards([...otherCards, ...newCardOrder]);
        }
      }
    }
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd
  };
};
