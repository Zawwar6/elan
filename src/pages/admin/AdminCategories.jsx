import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import { useToast } from '../../context/ToastContext'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { slugify, generateId } from '../../utils/helpers'

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useProducts()
  const toast = useToast()
  const [newCategoryName, setNewCategoryName] = useState('')
  const [subInputs, setSubInputs] = useState({})
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)

  async function handleAddCategory(e) {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    await addCategory({ name: newCategoryName.trim(), slug: slugify(newCategoryName), subcategories: [] })
    toast.show('Category added.', 'success')
    setNewCategoryName('')
  }

  async function handleAddSubcategory(category) {
    const value = subInputs[category.id]
    if (!value?.trim()) return
    const newSub = { id: generateId('sub'), name: value.trim(), slug: slugify(value) }
    await updateCategory(category.id, { subcategories: [...category.subcategories, newSub] })
    toast.show('Subcategory added.', 'success')
    setSubInputs((prev) => ({ ...prev, [category.id]: '' }))
  }

  async function handleRemoveSubcategory(category, subId) {
    await updateCategory(category.id, { subcategories: category.subcategories.filter((s) => s.id !== subId) })
  }

  async function saveRename() {
    await updateCategory(editingCategoryId, { name: editingName, slug: slugify(editingName) })
    toast.show('Category updated.', 'success')
    setEditingCategoryId(null)
  }

  async function confirmDelete() {
    await deleteCategory(pendingDelete.id)
    toast.show('Category deleted.', 'success')
    setPendingDelete(null)
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Categories</h1>

      <form onSubmit={handleAddCategory} className="flex gap-2 mb-8 max-w-md">
        <input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="New category name" className="input-field" />
        <button type="submit" className="btn-primary px-4"><Plus size={16} /></button>
      </form>

      <div className="grid md:grid-cols-2 gap-5">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-line p-5">
            <div className="flex items-center justify-between mb-3">
              {editingCategoryId === cat.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input value={editingName} onChange={(e) => setEditingName(e.target.value)} className="input-field !py-1.5" />
                  <button onClick={saveRename} className="text-xs text-accent">Save</button>
                  <button onClick={() => setEditingCategoryId(null)} className="text-xs text-ink-soft">Cancel</button>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-lg">{cat.name}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingCategoryId(cat.id); setEditingName(cat.name) }}
                      aria-label="Rename category"
                      className="text-ink-soft hover:text-ink"
                    >
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setPendingDelete(cat)} aria-label="Delete category" className="text-ink-soft hover:text-sale">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </>
              )}
            </div>

            <ul className="space-y-1.5 mb-3">
              {cat.subcategories.map((sub) => (
                <li key={sub.id} className="flex items-center justify-between text-sm text-ink-soft">
                  {sub.name}
                  <button onClick={() => handleRemoveSubcategory(cat, sub.id)} aria-label={`Remove ${sub.name}`} className="hover:text-sale">
                    <X size={13} />
                  </button>
                </li>
              ))}
              {cat.subcategories.length === 0 && <li className="text-xs text-ink-soft/60">No subcategories yet.</li>}
            </ul>

            <div className="flex gap-2">
              <input
                value={subInputs[cat.id] || ''}
                onChange={(e) => setSubInputs((prev) => ({ ...prev, [cat.id]: e.target.value }))}
                placeholder="Add subcategory"
                className="input-field !py-1.5 text-xs"
              />
              <button onClick={() => handleAddSubcategory(cat)} className="btn-secondary !py-1.5 !px-3"><Plus size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this category?"
        description={pendingDelete ? `"${pendingDelete.name}" and its subcategories will be removed. Existing products keep their category text but it will no longer appear in navigation.` : ''}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
