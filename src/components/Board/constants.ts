import type {  Column as ColumnType } from '../../types';
export const defaultColumns: ColumnType[] = [
    { id: 'col1', title: 'To Do', cardIds: [], order: 1 },
    { id: 'col2', title: 'In Progress', cardIds: [], order: 2 },
    { id: 'col3', title: 'Done', cardIds: [], order: 3 }
  ]
