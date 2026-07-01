"use client"

import { useState, useEffect, useRef } from "react"
import {
  Plus, Edit2, Trash2, X, Save, Loader2, AlertTriangle,
  Upload, Eye, EyeOff, ChevronUp, ChevronDown, Megaphone, Maximize2,
} from "lucide-react"
import type { Banner } from "@/types"
import { supabase } from "@/lib/supabase"

type FormData = Omit<Banner, "id" | "created_at">

const emptyForm: FormData = {
  titulo: "",
  subtitulo: "",
  imagen_url: "",
  boton_texto: "Ver más",
  boton_url: "#pedido",
  color_fondo: "#be185d",
  orden: 0,
  activo: true,
}

const inputCls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-100 placeholder-gray-300"
const labelCls = "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"

export default function BannersGrid() {
  const [banners, setBanners]           = useState<Banner[]>([])
  const [loading, setLoading]           = useState(true)
  const [modal, setModal]               = useState<{ open: boolean; editing: Banner | null }>({ open: false, editing: null })
  const [form, setForm]                 = useState<FormData>(emptyForm)
  const [saving, setSaving]             = useState(false)
  const [uploading, setUploading]       = useState(false)
  const [dragOver, setDragOver]         = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [previewBanner, setPreviewBanner] = useState<Banner | null>(null)
  const [formError, setFormError]       = useState("")
  const fileInputRef                    = useRef<HTMLInputElement>(null)

  useEffect(() => { loadBanners() }, [])

  async function loadBanners() {
    setLoading(true)
    const { data } = await supabase.from("banners").select("*").order("orden", { ascending: true })
    if (data) setBanners(data as Banner[])
    setLoading(false)
  }

  function openCreate() {
    const nextOrden = banners.length > 0 ? Math.max(...banners.map((b) => b.orden)) + 1 : 0
    setForm({ ...emptyForm, orden: nextOrden })
    setFormError("")
    setModal({ open: true, editing: null })
  }

  function openEdit(b: Banner) {
    setForm({
      titulo: b.titulo,
      subtitulo: b.subtitulo ?? "",
      imagen_url: b.imagen_url ?? "",
      boton_texto: b.boton_texto ?? "Ver más",
      boton_url: b.boton_url ?? "#pedido",
      color_fondo: b.color_fondo ?? "#be185d",
      orden: b.orden,
      activo: b.activo,
    })
    setFormError("")
    setModal({ open: true, editing: b })
  }

  function closeModal() {
    setModal({ open: false, editing: null })
    setFormError("")
  }

  async function handleSave() {
    if (!form.titulo.trim()) { setFormError("El título es requerido."); return }
    setSaving(true)
    setFormError("")

    if (modal.editing) {
      const { error } = await supabase.from("banners").update({ ...form }).eq("id", modal.editing.id)
      if (error) { setFormError("Error: " + error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from("banners").insert([form])
      if (error) { setFormError("Error: " + error.message); setSaving(false); return }
    }
    setSaving(false)
    closeModal()
    loadBanners()
  }

  async function handleDelete(id: string) {
    await supabase.from("banners").delete().eq("id", id)
    setDeleteConfirm(null)
    setBanners((prev) => prev.filter((b) => b.id !== id))
  }

  async function toggleActivo(b: Banner) {
    await supabase.from("banners").update({ activo: !b.activo }).eq("id", b.id)
    setBanners((prev) => prev.map((x) => x.id === b.id ? { ...x, activo: !x.activo } : x))
  }

  async function moveOrden(b: Banner, dir: "up" | "down") {
    const sorted = [...banners].sort((a, x) => a.orden - x.orden)
    const idx = sorted.findIndex((x) => x.id === b.id)
    const swapIdx = dir === "up" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    const other = sorted[swapIdx]
    await Promise.all([
      supabase.from("banners").update({ orden: other.orden }).eq("id", b.id),
      supabase.from("banners").update({ orden: b.orden }).eq("id", other.id),
    ])
    loadBanners()
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setFormError("")
    const file = files[0]
    const ext = file.name.split(".").pop()
    const fileName = `banner-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from("productos").upload(fileName, file, { upsert: true })
    if (error) { setFormError("Error al subir: " + error.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from("productos").getPublicUrl(fileName)
    setForm((prev) => ({ ...prev, imagen_url: publicUrl }))
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">{banners.length} banner{banners.length !== 1 ? "s" : ""}</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Nuevo banner
        </button>
      </div>

      {loading && <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-pink-400" /></div>}

      {!loading && banners.length === 0 && (
        <div className="text-center py-20">
          <Megaphone className="w-12 h-12 text-gray-200 mx-auto mb-3" strokeWidth={1} />
          <p className="text-gray-400 text-sm mb-3">No hay banners aún</p>
          <button onClick={openCreate} className="text-pink-500 text-sm hover:underline">Crear el primero</button>
        </div>
      )}

      {!loading && banners.length > 0 && (
        <div className="space-y-3">
          {banners.map((b, idx) => (
            <div key={b.id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-center transition-opacity ${!b.activo ? "opacity-50" : ""}`}>
              <div className="flex-shrink-0 w-28 h-16 rounded-xl overflow-hidden relative" style={{ background: b.imagen_url ? undefined : b.color_fondo }}>
                {b.imagen_url && <img src={b.imagen_url} alt="" className="w-full h-full object-cover" />}
                <div className="absolute inset-0 flex items-end p-1.5">
                  <p className="text-white text-[9px] font-bold leading-tight line-clamp-2 drop-shadow">{b.titulo}</p>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{b.titulo}</p>
                {b.subtitulo && <p className="text-gray-400 text-xs truncate mt-0.5">{b.subtitulo}</p>}
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${b.activo ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-gray-500 bg-gray-50 border-gray-200"}`}>
                    {b.activo ? "Activo" : "Inactivo"}
                  </span>
                  <span className="text-gray-400 text-[10px]">Orden: {b.orden}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveOrden(b, "up")} disabled={idx === 0} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => moveOrden(b, "down")} disabled={idx === banners.length - 1} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                </div>
                <button onClick={() => setPreviewBanner(b)} className="p-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 hover:text-pink-500 transition-colors"><Maximize2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => toggleActivo(b)} className="p-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors">
                  {b.activo ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                {deleteConfirm === b.id ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleDelete(b.id)} className="px-2 py-1 rounded-lg bg-red-500 text-white text-xs">Sí</button>
                    <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded-lg bg-gray-100 text-xs text-gray-600">No</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(b.id)} className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview pantalla completa */}
      {previewBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setPreviewBanner(null)}>
          <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="bg-pink-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full">Vista previa</span>
              <button onClick={() => setPreviewBanner(null)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="relative overflow-hidden rounded-3xl min-h-[220px] md:min-h-[280px] shadow-2xl">
              {previewBanner.imagen_url ? (
                <><img src={previewBanner.imagen_url} alt="" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40" /></>
              ) : (
                <div className="absolute inset-0" style={{ backgroundColor: previewBanner.color_fondo }} />
              )}
              <div className="relative z-10 p-8 md:p-12 max-w-xl">
                <h2 className="text-2xl md:text-4xl font-extrabold leading-tight text-white mb-3 whitespace-pre-line">{previewBanner.titulo || "Título del banner"}</h2>
                {previewBanner.subtitulo && <p className="text-white/80 text-sm md:text-base mb-6">{previewBanner.subtitulo}</p>}
                {previewBanner.boton_texto && (
                  <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-pink-600 font-semibold text-sm cursor-default">{previewBanner.boton_texto}</span>
                )}
              </div>
            </div>
            <p className="text-center text-white/40 text-xs mt-3">Haz clic fuera para cerrar</p>
          </div>
        </div>
      )}

      {/* Modal crear/editar */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">{modal.editing ? "Editar banner" : "Nuevo banner"}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><X className="w-4 h-4" /></button>
            </div>

            <div className="overflow-y-auto p-6 space-y-4">
              <div>
                <label className={labelCls}>Título <span className="text-pink-500">*</span></label>
                <textarea value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="¡Sorpresa especial este mes!" rows={2} className={inputCls + " resize-none"} />
              </div>
              <div>
                <label className={labelCls}>Subtítulo</label>
                <textarea value={form.subtitulo} onChange={(e) => setForm({ ...form, subtitulo: e.target.value })} placeholder="Desayunos y detalles con descuento..." rows={2} className={inputCls + " resize-none"} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Texto del botón</label>
                  <input type="text" value={form.boton_texto} onChange={(e) => setForm({ ...form, boton_texto: e.target.value })} placeholder="Ver más" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Enlace del botón</label>
                  <input type="text" value={form.boton_url} onChange={(e) => setForm({ ...form, boton_url: e.target.value })} placeholder="#pedido" className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Color de fondo</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.color_fondo} onChange={(e) => setForm({ ...form, color_fondo: e.target.value })} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                  <input type="text" value={form.color_fondo} onChange={(e) => setForm({ ...form, color_fondo: e.target.value })} className={inputCls + " flex-1"} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Imagen de fondo (opcional)</label>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files)} />
                <div
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImageUpload(e.dataTransfer.files) }}
                  className={`w-full flex flex-col items-center gap-1.5 px-3 py-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${dragOver ? "border-pink-400 bg-pink-50 text-pink-500" : "border-gray-200 text-gray-400 hover:border-pink-300"} ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {uploading ? <><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Subiendo...</span></> : <><Upload className="w-5 h-5" /><span className="text-sm font-medium">{dragOver ? "Suelta aquí" : "Arrastra o haz clic"}</span></>}
                </div>
                {form.imagen_url && (
                  <div className="mt-2 h-24 rounded-xl overflow-hidden border border-gray-200 relative">
                    <img src={form.imagen_url} alt="preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setForm({ ...form, imagen_url: "" })} className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 text-white"><X className="w-3 h-3" /></button>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400">o pega una URL</span><div className="flex-1 h-px bg-gray-200" />
                </div>
                <input type="url" value={form.imagen_url} onChange={(e) => setForm({ ...form, imagen_url: e.target.value })} placeholder="https://..." className={inputCls + " mt-2"} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Orden</label>
                  <input type="number" value={form.orden} onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })} min={0} className={inputCls} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} className="w-4 h-4 accent-pink-500" />
                    <span className="text-sm text-gray-700">Activo (visible)</span>
                  </label>
                </div>
              </div>

              {/* Preview mini */}
              <div>
                <label className={labelCls}>Vista previa</label>
                <div className="w-full h-20 rounded-xl overflow-hidden relative" style={{ background: form.imagen_url ? undefined : form.color_fondo }}>
                  {form.imagen_url && <><img src={form.imagen_url} alt="" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40" /></>}
                  <div className="absolute inset-0 flex flex-col justify-center px-4">
                    <p className="text-white font-bold text-sm leading-tight line-clamp-2">{form.titulo || "Título del banner"}</p>
                    {form.subtitulo && <p className="text-white/70 text-[11px] mt-0.5 line-clamp-1">{form.subtitulo}</p>}
                  </div>
                </div>
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
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</> : <><Save className="w-4 h-4" />Guardar banner</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
