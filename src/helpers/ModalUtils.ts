import React from 'react';
import type { Card,  Checklist, ChecklistItem, Image, CardHistory } from '../types/';
 
class ModalUtils {
  static generateId(): string {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static handleSave(
    title: string,
    description: string,
    labels: string[],
    checklists: Checklist[],
    images: Image[],
    history: CardHistory[],  
    onSave: (card: Omit<Card, 'id' | 'columnId' | 'createdAt' | 'updatedAt'>) => void
  ): void {
    if (title.trim()) {
      onSave({
        title: title.trim(),
        description: description.trim(),
        labels: labels || [],
        checklists: checklists || [],
        images: images || [],
        history: history || [] 
      });
    }
  }

  static handleAddLabel(
    newLabel: string,
    labels: string[],
    setLabels: React.Dispatch<React.SetStateAction<string[]>>,
    setNewLabel: React.Dispatch<React.SetStateAction<string>>
  ): void {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels(prev => [...prev, newLabel.trim()]);
      setNewLabel('');
    }
  }

  static handleRemoveLabel(
    labelToRemove: string,
    setLabels: React.Dispatch<React.SetStateAction<string[]>>
  ): void {
    setLabels(prev => prev.filter(label => label !== labelToRemove));
  }

  static handleAddChecklist(
    newChecklistTitle: string,
    checklists: Checklist[],
    setChecklists: React.Dispatch<React.SetStateAction<Checklist[]>>,
    setNewChecklistTitle: React.Dispatch<React.SetStateAction<string>>
  ): void {
    if (newChecklistTitle.trim()) {
      const newChecklist: Checklist = {
        id: this.generateId(),
        title: newChecklistTitle.trim(),
        items: []
      };

      setChecklists(prev => [...prev, newChecklist]);
      setNewChecklistTitle('');
    }
  }

  static handleDeleteChecklist(
    checklistId: string,
    setChecklists: React.Dispatch<React.SetStateAction<Checklist[]>>
  ): void {
    setChecklists(prev => prev.filter(checklist => checklist.id !== checklistId));
  }

  static handleAddChecklistItem(
    checklistId: string,
    text: string,
    setChecklists: React.Dispatch<React.SetStateAction<Checklist[]>>
  ): void {
    if (text.trim()) {
      const newItem: ChecklistItem = {
        id: this.generateId(),
        text: text.trim(),
        completed: false
      };
      
      setChecklists(prev => prev.map(checklist => 
        checklist.id === checklistId 
          ? {
              ...checklist,
              items: [...(checklist.items || []), newItem]
            }
          : checklist
      ));
    }
  }

  static handleToggleChecklistItem(
    checklistId: string,
    itemId: string,
    setChecklists: React.Dispatch<React.SetStateAction<Checklist[]>>
  ): void {
    setChecklists(prev => prev.map(checklist => 
      checklist.id === checklistId 
        ? {
            ...checklist,
            items: (checklist.items || []).map(item =>
              item.id === itemId 
                ? { ...item, completed: !item.completed }
                : item
            )
          }
        : checklist
    ));
  }

  static handleDeleteChecklistItem(
    checklistId: string,
    itemId: string,
    setChecklists: React.Dispatch<React.SetStateAction<Checklist[]>>
  ): void {
    setChecklists(prev => prev.map(checklist => 
      checklist.id === checklistId 
        ? {
            ...checklist,
            items: (checklist.items || []).filter(item => item.id !== itemId)
          }
        : checklist
    ));
  }

  static handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    setImages: React.Dispatch<React.SetStateAction<Image[]>>,
    fileInputRef: React.RefObject<HTMLInputElement>
  ): void {
    const files = e.target.files;

    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const newImage: Image = {
          id: this.generateId(),
          url: e.target?.result as string,
          name: file.name,
          uploadedAt: new Date().toISOString()
        };

        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  static handleDeleteImage(
    imageId: string,
    images: Image[],
    setImages: React.Dispatch<React.SetStateAction<Image[]>>,
    selectedImage: Image | null,
    setSelectedImage: React.Dispatch<React.SetStateAction<Image | null>>
  ): void {
    setImages(prev => prev.filter(image => image.id !== imageId));

    if (selectedImage?.id === imageId) {
      setSelectedImage(null);
    }
  }

  static handleOverlayClick(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    onClose: () => void
  ): void {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  static handleKeyDown(
    e: React.KeyboardEvent,
    onClose: () => void,
    mode: string,
    handleSave: () => void
  ): void {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && e.ctrlKey && mode !== 'view') {
      handleSave();
    }
  }

  static handleChecklistItemKeyPress(
    e: React.KeyboardEvent<HTMLInputElement>,
    checklistId: string,
    setChecklists: React.Dispatch<React.SetStateAction<Checklist[]>>
  ): void {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;

      this.handleAddChecklistItem(checklistId, target.value, setChecklists);
      target.value = '';
    }
  }
}

export default ModalUtils;
