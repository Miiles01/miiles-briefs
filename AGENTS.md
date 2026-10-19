# Reglas de Diseño y Estructura — WeAreMiiles

## Welth Catriz Font Usage
- **PROHIBIDO DENTRO DEL CUESTIONARIO:** La tipografía Welth Catriz **NUNCA** debe usarse dentro de las preguntas, títulos de preguntas, subtítulos, opciones o inputs del cuestionario. Todo el runner de preguntas debe usar tipografía sans-serif limpia (Poppins / Inter).
- **Uso Exclusivo:** Welth Catriz se utilizará **únicamente** en páginas informativas / portadas / catálogo / landing para resaltar 1 o 2 palabras clave en títulos (h1 y h2).
- Siempre agregar `padding` u `overflow: visible;` para evitar recortes (clipping) en los bordes de la cursiva.

## No Textos en Pura Mayúscula
- **NUNCA** utilices textos en mayúsculas sostenidas completas (evitar clases CSS `uppercase` o textos escritos en bloque mayúsculo). Usa siempre Sentence case (Capitalización natural) o Title case suave con tipografía limpia.

## Cero Dividers / Sin Líneas Separadoras
- **NUNCA** utilices dividers, elementos `<hr>`, líneas separadoras, `border-b` o `border-t` divisorios entre secciones o tarjetas.
- El espacio en blanco limpio (`margin`, `padding`, `gap`) es el único separador de jerarquía permitido.

## Ilustraciones y Dark Mode
- Al integrar ilustraciones que tengan fondos transparentes, asegúrate de que el contenedor o forma que las sostiene tenga un color de fondo definido (por ejemplo, blanco en modo claro y negro en modo oscuro).

## Portafolios UGC: hero sin CTAs
- En los portafolios UGC **no** se ponen botones tipo "Ver mi trabajo" / "Contáctame" debajo del texto del hero. El hero lleva solo titular, párrafo corto y redes; el contacto vive en el navbar y en la sección final.

## Portafolios UGC: menú hamburguesa
- Cuando el navbar sea de menú hamburguesa, el menú se abre como panel a **media pantalla** (desde un lado, con el resto oscurecido) y con un botón visible de **Cerrar**. Nunca a pantalla completa.
- Con menú hamburguesa el navbar va **sin fondo**: solo flotan el logo y el botón.

## Portafolios UGC en Lovable (dominios)
- V10 → repo Miiles01/rotate-display → https://ugc10.lovable.app/
- V11 → repo Miiles01/media-portfolio-garden → https://ugc11.lovable.app/
- Se trabaja en `main` de cada repo (Lovable sincroniza solo); el sitio público se actualiza cuando se da Publish en Lovable.
