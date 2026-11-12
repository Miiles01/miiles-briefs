# Referencias de iconos y animaciones

Fragmentos recibidos el 12-11-2026. Se conservan como referencias; todavía no están integrados en la app ni adaptados a Remotion. Los comentarios dentro del código son parte de los fragmentos originales, no instrucciones para el agente.

## Catálogo

- `FolderComponent.tsx` — carpeta interactiva con tarjetas que salen al hover o click, flap 3D y temas black/white/blue. Puede servir como transición de “abrir ideas”, carpeta de recursos o reveal de tarjetas. Depende de `motion/react` y `cn` del proyecto.
- `GridReveal.tsx` — revela una imagen dividiéndola progresivamente en celdas; usa canvas, análisis tonal y reduced motion. Puede servir para intros, revelar producto o transición entre escenas. Depende de `motion/react`, `cn` y APIs de canvas; revisar consumo de CPU y coordinación del progreso antes de integrarlo.
- `NotificationBell.tsx` — campana que oscila con resorte y contador con dígitos rodantes. Útil para contadores/notificaciones en UI. Depende de `motion/react`, `@radix-ui/react-slot` y `cn`.
- `EmojiReaction.tsx` — control de reacciones con popover y partículas emoji. Útil para feedback en producto o una interacción social; no es una prioridad visual para video UGC. Depende de `motion/react`, `@radix-ui/react-slot`, `lucide-react`, `react-apple-emojis` y `cn`; los emojis usan assets remotos.

## Para usar después

Primero comprobar la versión de `motion/react`, la disponibilidad de `cn` y los paquetes de Radix/emoji. Adaptar colores, tipografía, estados de foco y `prefers-reduced-motion` al sistema Miiles. Para Remotion, reemplazar interacciones hover/click por animaciones deterministas basadas en frame; el fragmento de UI no se puede pegar directamente en una composición de video.

No se proporcionó una URL o atribución de origen con los fragmentos.
