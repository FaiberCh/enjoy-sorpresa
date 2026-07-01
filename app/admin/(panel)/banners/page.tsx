import BannersGrid from "@/components/admin/BannersGrid"

export default function BannersPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Banners</h1>
        <p className="text-gray-500 text-sm mt-1">Administra los banners promocionales del sitio</p>
      </div>
      <BannersGrid />
    </div>
  )
}
