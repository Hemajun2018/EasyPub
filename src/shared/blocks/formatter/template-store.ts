export interface CustomTemplateImageStyles {
  wrapperStyle: string;
  imgStyle: string;
}

export interface CustomTemplate {
  id: string;
  name: string;
  prompt: string;
  sourceUrl?: string;
  createdAt: number;
  palette?: Record<string, string> | null;
  imageBlock?: CustomTemplateImageStyles | null;
}

const KEY = 'easypub.customTemplates.v1';

function readAll(): CustomTemplate[] {
  try {
    const raw = localStorage.getItem(KEY) || '[]';
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr as CustomTemplate[];
    return [];
  } catch {
    return [];
  }
}

function writeAll(items: CustomTemplate[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

export const templateStore = {
  list(): CustomTemplate[] {
    return readAll().sort((a, b) => b.createdAt - a.createdAt);
  },
  get(id: string): CustomTemplate | null {
    return readAll().find((x) => x.id === id) || null;
  },
  save(
    item: Omit<CustomTemplate, 'id' | 'createdAt'> &
      Partial<Pick<CustomTemplate, 'id' | 'createdAt'>>
  ): CustomTemplate {
    const now = Date.now();
    const id = item.id || `tpl-${now}-${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = item.createdAt || now;
    const next: CustomTemplate = {
      id,
      name: item.name,
      prompt: item.prompt,
      sourceUrl: item.sourceUrl,
      createdAt,
      palette: item.palette ?? null,
      imageBlock: item.imageBlock ?? null,
    };
    const all = readAll();
    const idx = all.findIndex((x) => x.id === id);
    if (idx >= 0) all[idx] = next;
    else all.unshift(next);
    writeAll(all);
    return next;
  },
  remove(id: string) {
    const all = readAll();
    const next = all.filter((x) => x.id !== id);
    writeAll(next);
  },
  rename(id: string, name: string) {
    const all = readAll();
    const it = all.find((x) => x.id === id);
    if (it) {
      it.name = name;
      writeAll(all);
    }
  },
};
