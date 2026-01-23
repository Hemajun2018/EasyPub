'use client';

import { StyleType, FORMATTING_OPTIONS } from './types';

export function StyleSelector({
  selected,
  onSelect,
}: {
  selected: StyleType;
  onSelect: (style: StyleType) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {FORMATTING_OPTIONS.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`relative rounded-lg border p-4 text-left transition-all duration-200 ${
            selected === option.id
              ? 'border-primary bg-accent/50 shadow-md ring-1 ring-primary'
              : 'border-border bg-card hover:border-border/80 hover:shadow-sm'
          }`}
          type="button"
        >
          <div className="mb-1 flex items-center justify-between">
            <h3
              className={`font-serif text-sm font-bold ${
                selected === option.id ? 'text-primary' : 'text-foreground'
              }`}
            >
              {option.name}
            </h3>
            <div className={`h-3 w-3 rounded-full ${option.previewColor}`} />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {option.description}
          </p>
        </button>
      ))}
    </div>
  );
}
