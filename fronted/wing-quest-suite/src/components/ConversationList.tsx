import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pin, PinOff, Trash2, Edit, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { Conversation } from "@/lib/chatStore";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string) => void;
  onPinToggle: (id: string) => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function ConversationList({ conversations, activeId, onSelect, onNew, onDelete, onRename, onPinToggle, collapsed, onToggle }: Props) {
  const sorted = useMemo(() => {
    return [...conversations].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.updated_at - a.updated_at;
    });
  }, [conversations]);

  if (collapsed) {
    return (
      <div className="h-full flex items-center">
        <Button variant="ghost" size="icon" onClick={onToggle} aria-label="展开对话">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Button variant="accent" size="sm" className="gap-2" onClick={onNew}>
          <Plus className="w-4 h-4" /> 新建对话
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggle} aria-label="收起对话">
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      <Card className="p-3 bg-card/80 backdrop-blur border-border">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input placeholder="搜索对话" className="h-8" />
        </div>
        <div className="space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto">
          {sorted.map((c) => (
            <div key={c.id} className={`group flex items-center justify-between px-2 py-1 rounded-md ${c.id === activeId ? "bg-muted" : "hover:bg-muted/60"}`}>
              <button className="flex-1 text-left" onClick={() => onSelect(c.id)}>
                <div className="text-sm font-medium truncate">{c.title}</div>
                <div className="text-xs text-muted-foreground">{new Date(c.updated_at).toLocaleString()}</div>
              </button>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => onPinToggle(c.id)} aria-label="置顶">
                  {c.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onRename(c.id)} aria-label="重命名">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(c.id)} aria-label="删除">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

