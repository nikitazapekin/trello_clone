export interface Card {
  id: string;
  title: string;
  description: string;
  columnId: string;
  labels: string[];
  checklists: Checklist[];
  images: Image[];
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: string;
  url: string;
  name: string;
  uploadedAt: string;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface BoardData {
  columns: Column[];
  cards: Card[];
  history: CardHistory[];
}

export interface CardHistory {
  id: string;
  cardId: string;
  action: string;
  timestamp: string;
  changes: HistoryChange[];
}

export interface HistoryChange {
  field: string;
  oldValue: string | null | Card;
  newValue: string | null | Card;
}

// Типы для действий с историей
export type HistoryAction = 
  | 'Создание карточки'
  | 'Изменение карточки'
  | 'Удаление карточки'
  | 'Перемещение карточки';

export type HistoryField = 
  | 'card'
  | 'title'
  | 'description'
  | 'column';
