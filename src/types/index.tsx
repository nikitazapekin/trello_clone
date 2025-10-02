export interface CardItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface CardList {
  id: string;
  title: string;
  items: CardItem[];
}

export interface CardImage {
  id: string;
  url: string;
  name: string;
}

export interface CardLabel {
  id: string;
  text: string;
  color: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface CardChecklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Card {
  id: string;
  title: string;
  description: string;
  columnId: string;
  lists?: CardList[];
  images?: CardImage[];
  labels?: CardLabel[];
  checklists?: CardChecklist[];
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface CardHistory {
  id: string;
  cardId: string;
  action: string;
  timestamp: string;
  oldValue?: any;
  newValue?: any;
  details?: any
}

export interface BoardData {
  columns: Column[];
  cards: Card[];
  history?: CardHistory[];
}
 
export interface DragItem {
  type: 'card';
  id: string;
  columnId: string;
}
