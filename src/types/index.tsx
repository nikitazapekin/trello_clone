export interface Card {
  id: string;
  title: string;
  description: string;
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface BoardData {
  columns: Column[];
  cards: Card[];
}
 
export interface DragItem {
  type: 'card';
  id: string;
  columnId: string;
}
