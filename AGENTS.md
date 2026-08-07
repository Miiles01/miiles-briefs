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
