export type EstadoLead = "interesado" | "en_negociacion" | "compro" | "no_compro" | "inactivo"

export type EstadoPedido = "pendiente" | "en_proceso" | "entregado" | "cancelado"

export interface Cliente {
  id: string
  nombre: string
  whatsapp: string
  ciudad: string
  email?: string
  estado_lead: EstadoLead
  acepta_promociones: boolean
  created_at: string
  updated_at: string
}

export interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  categoria: string
  imagen_url: string
  imagenes?: string[]
  disponible: boolean
  created_at?: string
}

export interface Banner {
  id: string
  titulo: string
  subtitulo: string
  imagen_url: string
  boton_texto: string
  boton_url: string
  color_fondo: string
  orden: number
  activo: boolean
  created_at: string
}

export interface Pedido {
  id: string
  cliente_id: string
  cliente?: Cliente
  producto_interes: string
  descripcion: string
  fecha_evento?: string
  ciudad: string
  estado: EstadoPedido
  notas?: string
  origen: "web" | "whatsapp" | "presencial" | "otro"
  created_at: string
  updated_at: string
}

export interface FormularioPedidoData {
  nombre: string
  whatsapp: string
  ciudad: string
  email?: string
  producto_interes: string
  descripcion: string
  fecha_evento?: string
  acepta_promociones: boolean
  acepta_datos: boolean
}
