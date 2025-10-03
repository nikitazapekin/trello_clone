 
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
    order: number;
}
 
export interface CardHistory {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  columnId: string;
  labels: string[];
  checklists: Checklist[];
  images: Image[];
  history: CardHistory[]; 
  createdAt: string;
  updatedAt: string;
}

export interface BoardData {
  columns: Column[];
  cards: Card[];
  history: CardHistory[]; 
}
 
 
export interface HistoryChange {
  field: string;
  oldValue: string;
  newValue: string;
}


export type HistoryAction = 
  | 'Создание карточки'
  | 'Изменение карточки'
  | 'Удаление карточки'
  | 'Перемещение карточки';

export type HistoryField = 
  | 'card'
  | 'title'
  | 'description'
  | 'labels'
  | 'checklists'
  | 'images'
  | 'column';



 
export interface CardImage {
  id: string;
  url: string;
  name: string;
}

 

 