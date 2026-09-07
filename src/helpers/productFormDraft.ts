import { ProductForm } from '@/src/types/propsTypes';

const DRAFT_KEY = 'aps:product-form-draft';

export type ProductFormDraft = {
  mode: 'create' | 'edit';
  productId: string | null;
  form: ProductForm;
};

// Android Chrome can kill a backgrounded tab's process while the native
// photo picker is in the foreground, reloading the page from scratch when
// the user returns. Persisting the in-progress form to sessionStorage lets
// us restore it after that kind of reload instead of silently losing it.

export function readProductFormDraft(): ProductFormDraft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as ProductFormDraft) : null;
  } catch {
    return null;
  }
}

export function writeProductFormDraft(draft: ProductFormDraft) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // sessionStorage unavailable (private browsing, etc.) — draft just won't persist
  }
}

export function clearProductFormDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}
