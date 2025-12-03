import { useState, useMemo } from 'react';
import { Student } from '@/types';
import { Input } from '@/components/ui/input';
import { Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentSelectorProps {
  students: Student[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function StudentSelector({ students, selectedId, onSelect }: StudentSelectorProps) {
  const [search, setSearch] = useState('');

  const filteredStudents = useMemo(() => {
    if (!search.trim()) return students;
    const query = search.toLowerCase();
    return students.filter(
      (s) => s.name.toLowerCase().includes(query) || s.phone.includes(query)
    );
  }, [students, search]);

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          className="pl-10"
        />
      </div>

      {/* Student List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
        {filteredStudents.map((student) => (
          <button
            key={student.id}
            onClick={() => onSelect(student.id)}
            className={cn(
              'flex items-center gap-3 p-4 rounded-lg border text-left transition-all duration-200',
              selectedId === student.id
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border bg-card hover:border-primary/50 hover:bg-secondary/50'
            )}
          >
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              selectedId === student.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            )}>
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{student.name}</p>
              <p className="text-sm text-muted-foreground">{student.phone}</p>
            </div>
          </button>
        ))}
        
        {filteredStudents.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            {search ? 'No students found matching your search' : 'No students registered yet'}
          </div>
        )}
      </div>
    </div>
  );
}
