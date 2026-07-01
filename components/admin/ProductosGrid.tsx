"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Edit2, Trash2, Package, Search, X, Save, Loader2, AlertTriangle, Upload, Star } from "lucide-react"
import type { Producto } from "@/types"
import { supabase } from "@/lib/supabase"
import { formatPrecio } from "@/lib/data"

const CATEGORIAS = ["Desayunos", "Detalles", "Decoración", "Globos", "Regalos"]

type FormData = {
  nombre: string
  descripcion: string
  precio: number
  categoria: string
  imagen_url: string
  imagenes: string[]
  disponible: boolean
}

const emptyForm: FormData = {
  nombre: "",
  descripcion: "",
  precio: 0,
  categoria: "Desayunos",
  imagen_url: "",
  imagenes: [],
  disponible: true,
}

export default function ProductosGrid() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState("")
  const [modal, setModal]         = useState<{ open: boolean; editing: Producto | null }>({ open: false, editing: null })
  const [form, setForm]           = useState<FormData>(emptyForm)
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver]   = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formError, setFormError] = useState("")
  const [urlInput, setUrlInput]   = useState("")
  const fileInputRef              = useRef<HTMLInputElement>(null)

  useEffect(() => { loadProductos() }, [])

  async function loadProductos() {
    setLoading(true)
    const { data } = await supabase.from("productos").select("*").order("created_at", { ascending: false })
    if (data) setProductos(data as Producto[])
    setLoading(false)
  }

  function openCreate() {
    setForm(emptyForm)
    setFormError("")
    setUrlInput("")
    setModal({ open: true, editing: null })
  }

  function openEdit(p: Producto) {
    const existingImagenes: string[] = Array.isArray(p.imagenes) && p.imagenes.length > 0
      ? p.imagenes
      : p.imagen_url ? [p.imagen_url] : []
    setForm({ nombre: p.nombre, descripcion: p.descripcion ?? "", precio: p.precio, imagen_url: p.imagen_url ?? "", imagenes: existingImagenes, categoria: p.categoria, disponible: p.disponible })
    setFormError("")
    setUrlInput("")
    setModal({ open: true, editing: p })
  }

  function closeModal() {
    setModal({ open: false, editing: null })
    setFormError("")
    setUrlInput("")
  }

  async function handleSave() {
    if (!form.nombre.trim()) { setFormError("El nombre es requerido."); return }
    if (form.precio < 0) { setFormError("El precio no puede ser negativo."); return }
    setSaving(true)
    setFormError("")

    if (modal.editing) {
      const { error } = await supabase.from("productos").update({ ...form }).eq("id", modal.editing.id)
      if (error) { setFormError("Error: " + error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from("productos").insert([form])
      if (error) { setFormError("Error: " + error.message); setSaving(false); return }
    }
    setSaving(false)
    closeModal()
    loadProductos()
  }

  async function handleDelete(id: string) {
    await supabase.from("productos").delete().eq("id", id)
    setDeleteConfirm(null)
    setProductos((prev) => prev.filter((p) => p.id !== id))
  }

  async function toggleDisponible(p: Producto) {
    await supabase.from("productos").update({ disponible: !p.disponible }).eq("id", p.id)
    setProductos((prev) => prev.map((x) => x.id === p.id ? { ...x, disponible: !x.disponible } : x))
  }

  async function handleImageFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setFormError("")
    const newUrls: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.startsWith("image/")) continue
      const ext = file.name.split(".").pop()
      const fileName = `producto-${Date.now()}-${i}.${ext}`
      const { error } = await supabase.storage.from("productos").upload(fileName, file, { upsert: true })
      if (error) { setFormError("Error al subir: " + error.message); setUploading(false); return }
      const { data: { publicUrl } } = supabase.storage.from("productos").getPublicUrl(fileName)
      newUrls.push(publicUrl)
    }
    setForm((prev) => {
      const combined = [...prev.imagenes, ...newUrls]
      return { ...prev, imagenes: combined, imagen_url: prev.imagen_url || combined[0] || "" }
    })
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function addUrlToGallery() {
    const url = urlInput.trim()
    if (!url) return
    setForm((prev) => {
      const combined = [...prev.imagenes, url]
      return { ...prev, imagenes: combined, imagen_url: prev.imagen_url || url }
    })
    setUrlInput("")
  }

  function setAsPortada(url: string) {
    setForm((prev) => ({ ...prev, imagen_url: url }))
  }

  function removeImage(url: string) {
    setForm((prev) => {
      const newImagenes = prev.imagenes.filter((u) => u !== url)
      const newPortada = prev.imagen_url === url ? (newImagenes[0] ?? "") : prev.imagen_url
      return { ...prev, imagenes: newImagenes, imagen_url: newPortada }
    })
  }

  const filtered = productos.filter(
    (p) => p.nombre.toLowerCase().includes(search.toLowerCase()) || p.categoria.toLowerCase().includes(search.toLowerCase())
  )

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-100 placeholder-gray-300"
  const labelCls = "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-pink-400 w-56" />
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Nuevo producto
        </button>
      </div>

      {loading && <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-pink-400" /></div>}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" strokeWidth={1} />
          <p className="text-gray-400 text-sm">{search ? "No se encontraron productos" : "No hay productos aún"}</p>
          {!search && <button onClick={openCreate} className="mt-3 text-pink-500 text-sm hover:underline">Agregar el primero</button>}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="w-full h-36 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4 overflow-hidden">
                {p.imagen_url ? <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover" /> : <Package className="w-10 h-10 text-gray-200" strokeWidth={1} />}
              </div>
              <div className="flex items-start justify-between mb-1">
                <p className="font-medium text-gray-800 text-sm truncate flex-1">{p.nombre}</p>
              </div>
              <span className="text-xs text-pink-600 bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-full">{p.categoria}</span>
              <p className="text-gray-400 text-xs mt-2 mb-3 line-clamp-2">{p.descripcion}</p>
              <p className="font-bold text-gray-800 mb-3">{formatPrecio(p.precio)}</p>

              {deleteConfirm === p.id ? (
                <div className="flex items-center gap-2">
                  <p className="text-xs text-red-500 flex-1">¿Eliminar?</p>
                  <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs">Sí</button>
                  <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs">No</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleDisponible(p)} className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${p.disponible ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}>
                    {p.disponible ? "Disponible" : "No disponible"}
                  </button>
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal crear/editar */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">{modal.editing ? "Editar producto" : "Nuevo producto"}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><X className="w-4 h-4" /></button>
            </div>

            <div className="overflow-y-auto p-6 space-y-4">
              <div>
                <label className={labelCls}>Nombre <span className="text-pink-500">*</span></label>
                <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Desayuno Sorpresa Romántico" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Descripción</label>
                <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Describe el producto..." rows={3} className={inputCls + " resize-none"} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Precio (COP) <span className="text-pink-500">*</span></label>
                  <input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })} min={0} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Categoría <span className="text-pink-500">*</span></label>
                  <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className={inputCls}>
                    {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Galería de imágenes */}
              <div>
                <label className={labelCls}>Imágenes del producto</label>
                {form.imagenes.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {form.imagenes.map((url, i) => {
                      const isPortada = url === form.imagen_url
                      return (
                        <div key={i} className={`relative group rounded-xl overflow-hidden border-2 transition-all ${isPortada ? "border-pink-500" : "border-gray-200 hover:border-gray-300"}`} style={{ height: "80px" }}>
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          {isPortada && (
                            <div className="absolute top-1 left-1 bg-pink-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" /> Portada
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                            {!isPortada && (
                              <button type="button" onClick={() => setAsPortada(url)} className="p-1.5 bg-pink-500 rounded-full text-white"><Star className="w-3 h-3" /></button>
                            )}
                            <button type="button" onClick={() => removeImage(url)} className="p-1.5 bg-red-500 rounded-full text-white"><X className="w-3 h-3" /></button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageFiles(e.target.files)} />
                <div
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImageFiles(e.dataTransfer.files) }}
                  className={`w-full flex flex-col items-center gap-1.5 px-3 py-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${dragOver ? "border-pink-400 bg-pink-50 text-pink-500" : "border-gray-200 text-gray-400 hover:border-pink-300"} ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {uploading
                    ? <><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Subiendo...</span></>
                    : <><Upload className="w-5 h-5" /><span className="text-sm font-medium">{dragOver ? "Suelta aquí" : form.imagenes.length > 0 ? "Agregar más imágenes" : "Arrastra o haz clic"}</span><span className="text-xs opacity-60">Puedes seleccionar varias a la vez</span></>
                  }
                </div>
                <div className="flex items-center gap-2 my-2">
                  <div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400">o pega una URL</span><div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="flex gap-2">
                  <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addUrlToGallery()} placeholder="https://..." className={inputCls} />
                  <button type="button" onClick={addUrlToGallery} disabled={!urlInput.trim()} className="px-3 py-2.5 rounded-xl bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 disabled:opacity-40 transition-colors">Agregar</button>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <input type="checkbox" id="disponible-check" checked={form.disponible} onChange={(e) => setForm({ ...form, disponible: e.target.checked })} className="w-4 h-4 accent-pink-500 cursor-pointer" />
                <label htmlFor="disponible-check" className="text-sm text-gray-700 cursor-pointer">Disponible (visible en el catálogo)</label>
              </div>

              {formError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />{formError}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={closeModal} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-pink-500 hover:bg-pink-600 text-white transition-colors disabled:opacity-60">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</> : <><Save className="w-4 h-4" />{modal.editing ? "Guardar cambios" : "Crear producto"}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
