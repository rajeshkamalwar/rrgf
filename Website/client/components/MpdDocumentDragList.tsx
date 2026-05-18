import { useCallback, useRef, useState, type ReactNode } from 'react';
import { GripVertical } from 'lucide-react';

export interface MpdDocumentDragListProps<T extends { id: string }> {
  items: T[];
  onReorder: (fromId: string, toId: string) => void;
  renderItem: (item: T, ctx: { isDragging: boolean }) => ReactNode;
  emptyMessage?: string;
}

/**
 * Native HTML5 drag reorder. Avoids role="button" on handles (breaks drag in Chrome/Edge).
 */
export function MpdDocumentDragList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  emptyMessage,
}: MpdDocumentDragListProps<T>) {
  const dragIdRef = useRef<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    e.stopPropagation();
    const sid = String(id);
    dragIdRef.current = sid;
    setDraggingId(sid);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sid);
    try {
      e.dataTransfer.setData('application/x-rrgf-doc-id', sid);
    } catch {
      /* some browsers restrict custom MIME types */
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    dragIdRef.current = null;
    setDraggingId(null);
  }, []);

  const resolveDragId = (e: React.DragEvent): string | null => {
    const fromData =
      e.dataTransfer.getData('application/x-rrgf-doc-id') ||
      e.dataTransfer.getData('text/plain') ||
      dragIdRef.current;
    return fromData ? String(fromData) : null;
  };

  const handleDropOn = useCallback(
    (e: React.DragEvent, toId: string) => {
      e.preventDefault();
      e.stopPropagation();
      const fromId = resolveDragId(e);
      if (!fromId || fromId === String(toId)) return;
      onReorder(fromId, String(toId));
      handleDragEnd();
    },
    [onReorder, handleDragEnd],
  );

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  if (items.length === 0 && emptyMessage) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-3" onDragOver={allowDrop}>
      {items.map((item) => {
        const id = String(item.id);
        const isDragging = draggingId === id;
        return (
          <div
            key={id}
            onDragOver={allowDrop}
            onDrop={(e) => handleDropOn(e, id)}
            className={isDragging ? 'opacity-50' : undefined}
          >
            <div className="flex items-start gap-2">
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, id)}
                onDragEnd={handleDragEnd}
                className="mt-1 shrink-0 cursor-grab active:cursor-grabbing touch-none select-none text-muted-foreground hover:text-foreground"
                title="Drag to reorder"
                aria-grabbed={isDragging}
              >
                <GripVertical className="h-5 w-5 pointer-events-none" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">{renderItem(item, { isDragging })}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
